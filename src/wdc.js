import axios from 'axios'
import {max, differenceInSeconds} from 'date-fns'
import {groupBy} from 'lodash-es'
import {businessDays, isValidDate, nextBusinessDay, dateRange, dayType, toDateString} from './dateHelpers.js'
import projectsSchema from './schemas/projects.js'
import tasksSchema from './schemas/tasks.js'
import usersSchema from './schemas/users.js'
import clientsSchema from './schemas/clients.js'
import timeEntriesSchema from './schemas/timeEntries.js'
import calendarSchema from './schemas/calendar.js'

const estimateProgress = ({progress_status, start_date, due_date, complete}) => {
  if (complete) {
    return 1
  } else if (progress_status == "Prorata") {
    return businessDays(new Date(start_date), new Date()).length/businessDays(new Date(start_date), new Date(due_date)).length
  } else {
    const match =/(\d?\d)%/.exec(progress_status)
    if (match) return Number(match[1])/100
    else return 0
  }
}

const entryDateAndDuration = ({date: date0, duration: duration0, start_time, end_time}) => {
  let
    date = date0 || toDateString(new Date(start_time)),
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
    const {queryStartDate, queryEndDate} = JSON.parse(tableau.connectionData)
    if (id == "calendar") {
      (async () => {
        const [{data:{tasks:planned_tasks}},{data:{tasks:notplanned_tasks}},{data:{users}},{data:{bookings}}] = await Promise.all([
          paymo.get(`tasks?where=due_date>=${queryStartDate} and start_date<=${queryEndDate}&include=*,progress_status,entries`),
          paymo.get(`tasks?where=due_date=null and start_date=null&include=*,progress_status,entries`),
          paymo.get('users'),
          paymo.get(`bookings?where=date_interval in ("${queryStartDate}","${queryEndDate}")&include=*,usertask`)
        ])
        const now = new Date()
        const bookings_dict = groupBy(bookings,ut=>ut.usertask.task_id)
        for (let {id: user_id} of users) {
          table.appendRows(
            dateRange(new Date(queryStartDate),new Date(queryEndDate))
            .map(date => ({date: toDateString(date), user_id, entry_type: "user", day_type: dayType(date)}))
          )
        }
        for (let task of planned_tasks) {
          let {id: task_id, budget_hours, start_date, due_date, users} = task
          let hoursLeft = (1 - estimateProgress(task)) * budget_hours
          if (bookings_dict[task_id]!=undefined) {
            for (let {start_date,end_date,hours_per_day,usertask:{user_id}} of bookings_dict[task_id]){
              let dates = businessDays(max([new Date(start_date), now]),new Date(end_date))
              table.appendRows(
                dates.map(date=>({
                  ddate: toDateString(date),
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
            let
              startDate = new Date(start_date),
              dueDate = new Date(due_date),
              dates,
              entry_type
            if (now > dueDate) {
              dates = [nextBusinessDay(now)]
              entry_type = "late"
            } else {
              dates = businessDays(max([now,startDate]),dueDate)
              entry_type = "budget"
            }
            let
              usersCount = users.length,
              datesCount = dates.length
            if (usersCount==0) {
              table.appendRows(
                dates.map(date=>({
                  date: toDateString(date),
                  entry_type,
                  day_type: dayType(date),
                  task_id,
                  duration: hoursLeft/datesCount
                })))
            } else {
              for (let user_id of users) {
                table.appendRows(
                  dates.map(date=>({
                    date: toDateString(date),
                    entry_type,
                    day_type: dayType(date),
                    task_id,
                    user_id,
                    duration: hoursLeft/usersCount/datesCount
                  }))
                )
              }
            }
          }
          
          table.appendRows(task.entries.map(({date, duration, start_time, end_time, user_id}) => ({
            entry_type: "timesheet",
            task_id,
            user_id,
            ...entryDateAndDuration({date, duration, start_time, end_time})
          })))
        }
        for (let task of notplanned_tasks) {
          let {id: task_id} = task
          if (bookings_dict[task.id]!=undefined) {
            for (let {start_date,end_date,hours_per_day,usertask:{user_id}} of bookings_dict[task.id]){
              let dates = businessDays(max([new Date(start_date), now]),new Date(end_date))
              table.appendRows(
                dates.map(date=>({
                  date: toDateString(date),
                  entry_type: "booking",
                  day_type: dayType(date),
                  task_id,
                  user_id,
                  duration: hours_per_day
                })))
            }
          }
          table.appendRows(task.entries.map(({date, duration, start_time, end_time, user_id}) => ({
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
        const {data} = await paymo.get(`entries?where=time_interval in("${queryStartDate}","${queryEndDate}")`)
        table.appendRows(data[id].map((date,...rest)=>({date:date||toDateString(rest.start_time),...rest})))
        doneCallback()
      })()
    } else if (id == "tasks") {
      (async () => {
        const [{data:{tasks:planned_tasks}},{data:{tasks:notplanned_tasks}}] = await Promise.all([
          paymo.get(`tasks?where=due_date>=${queryStartDate} and start_date<=${queryEndDate}&include=*,progress_status`),
          paymo.get(`tasks?where=due_date=null and start_date=null&include=*,progress_status`),
        ])
        table.appendRows(planned_tasks.map(t=>{
          t.progress = estimateProgress(t)
          return t
        }))
        table.appendRows(notplanned_tasks)
        doneCallback()
      })()
    } else if (id == "projects") {
      (async () => {
        const {data:{projects}} = await paymo.get('projects?include=*,projectstatus.name')
        table.appendRows(projects.map(p=>{
          p.status = p.projectstatus.name
          return p
        }))
        doneCallback()
      })()
    } else {
      (async () => {
        const {data} = await paymo.get(id)
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
      queryStartDate = new Date(document.getElementById("startDate").value),
      queryEndDate = new Date(document.getElementById("endDate").value)
    if (isValidDate(queryStartDate) && isValidDate(queryEndDate)) {
      tableau.connectionData = JSON.stringify({queryStartDate,queryEndDate})
      tableau.submit()
    } else {
      document.getElementById("error").innerHTML =
        (!isValidDate(queryStartDate) && "<p>La date de début est invalide.</p>" || "")
      +  (!isValidDate(queryEndDate) && "<p>La date de fin est invalide.</p>" || "")
    }
  })
})
