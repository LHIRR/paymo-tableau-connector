import axios from 'axios'
import {addDays, startOfDay} from 'date-fns'
import {groupBy} from 'lodash-es'
import {businessDays, isValidDate, isHoliday, isWeekend, dateRange, dayType} from './dateHelpers.js'
import projectsSchema from './schemas/projects.js'
import tasksSchema from './schemas/tasks.js'
import usersSchema from './schemas/users.js'
import clientsSchema from './schemas/clients.js'
import timeEntriesSchema from './schemas/timeEntries.js'
import calendarSchema from './schemas/calendar.js'

const parseProgress = progressStatus => {
  const match = /(\d?\d)%/.exec(progressStatus)
  if (match) return Number(match[1])/100
  else return 0
}

const entryDateAndDuration = ({date: date0, duration: duration0, start_time, end_time}) => {
  let
    date = date0 || startOfDay(new Date(start_time)),
    duration = (duration0 || differenceInSeconds(new Date(end_time), new Date(start_time)))/3600
  return {
    date,
    duration,
    day_type : dayType(new Date(date))
  }
}

window.addEventListener("load", function() {

  const myConnector = tableau.makeConnector()
  myConnector.getSchema = function(schemaCallback) {
    schemaCallback([
      projectsSchema,
      tasksSchema,
      usersSchema,
      clientsSchema,
      timeEntriesSchema,
      calendarSchema
    ])
  }

  myConnector.getData = function(table, doneCallback) {
    const {id} = table.tableInfo
    const {startDate, endDate} = JSON.parse(tableau.connectionData)
    if (id == "calendar") {
      (async () => {
        const [{data:{tasks}},{data:{users}},{data:{bookings}}] = await Promise.all([
          paymo.get('tasks?include=*,progress_status,entries'),
          paymo.get('users'),
          paymo.get(`bookings?where=date_interval in ("${startDate}","${endDate}")&include=*,usertask`)
        ])
        const bookings_dict = groupBy(bookings,ut=>ut.usertask.task_id)
        for (let {id: user_id} of users) {
          table.appendRows(
            dateRange(new Date(startDate),new Date(endDate))
            .map(date => ({date, user_id, entry_type: "user", day_type: dayType(date)}))
          )
        }
        for (let task of tasks) {
          let { id, users, start_date, due_date, budget_hours, progress_status, entries} = task
          let hoursLeft = (1 - parseProgress(progress_status)) * budget_hours
          if (bookings_dict[id]!=undefined) {
            for (let {start_date,end_date,hours_per_day,usertask:{task_id,user_id}} of bookings_dict[id]){
              let dates = businessDays(new Date(start_date),new Date(end_date))
              table.appendRows(
                dates.map(date=>({
                  date,
                  entry_type: "booking",
                  day_type: dayType(date),
                  task_id,
                  user_id,
                  duration: hours_per_day
                })))
              hoursLeft -= dates.length * hours_per_day
            }
          }
          if (hoursLeft > 0) {
            let dates = businessDays(new Date(start_date),new Date(due_date))
            let usersCount = users.length
            let datesCount = dates.length
            if (usersCount==0) {
              table.appendRows(
                dates.map(date=>({
                  date,
                  entry_type: "budget",
                  day_type: dayType(date),
                  task_id: id,
                  duration: hoursLeft/datesCount
                })))
            } else {
              for (let user of users) {
                table.appendRows(
                  dates.map(date=>({
                    date,
                    entry_type: "budget",
                    day_type: dayType(date),
                    task_id: id,
                    user_id: user,
                    duration: hoursLeft/usersCount/datesCount
                  }))
                )
              }
            }
          }
          table.appendRows(entries.map(({date, duration, start_time, end_time, task_id, user_id}) => ({
            entry_type: "timesheet",
            task_id,
            user_id,
            ...entryDateAndDuration({date, duration, start_time, end_time})
          })))
        }
        doneCallback()
      })()
    } else if (id == "entries") {
      (async () => {
        let {data} = await paymo.get(`$${id}?where=time_interval in("${startDate}","${endDate}")`)
        table.appendRows(data[id])
        doneCallback()
      })()
    } else {
      (async () => {
        let {data} = await paymo.get(id)
        table.appendRows(data[id])
        doneCallback()
      })()
    }
  }

  myConnector.init = function(initCallback) {
    tableau.authType = tableau.authTypeEnum.basic
    if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
      window.paymo = axios.create({
        baseURL: "https://app.paymoapp.com/api/",
        timeout: 30000,
        auth: {
          username: tableau.password,
          password: ""
        }
      })
    }
    initCallback()
  }

  tableau.registerConnector(myConnector);
  document.getElementById("submit").addEventListener("click",function(){
    tableau.password = document.getElementById("APIToken").value
    let
      startDate = new Date(document.getElementById("startDate").value)
      endDate = new Date(document.getElementById("endDate").value)
    if (isValidDate(startDate) && isValidDate(endDate)) {
      tableau.connectionData = JSON.stringify({startDate,endDate})
      tableau.submit()
    } else {
      document.getElementById("error").innerHTML =
        (isValidDate(startDate) ? "<p>La date de début est invalide.</p>" : "")
        (isValidDate(endDate) ? "<p>La date de fin est invalide.</p>" : "")
    }
  })
})
