import axios from 'axios'
import {addDays} from 'date-fns'
import {businessDays, isHoliday, isWeekend, dateRange, dayType} from './dateHelpers.js'
import projectsSchema from './schemas/projects.js'
import tasksSchema from './schemas/tasks.js'
import usersSchema from './schemas/users.js'
import clientsSchema from './schemas/clients.js'
import timeEntriesSchema from './schemas/timeEntries.js'
import calendarSchema from './schemas/calendar.js'

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
    if (id == "calendar") {
      (async () => {
        const [{data:{tasks}},{data:{users}}] = await Promise.all([
          paymo.get('tasks'),
          paymo.get('users')
        ])
        for (let {id: user_id} of users) {
          table.appendRows(
            dateRange(new Date('2018-01-01'),new Date('2028-01-01'))
            .map(date => ({date, user_id, id, day_type: dayType(date)}))
          )
        }
        for (let task of tasks) {
          let { id, users, start_date, due_date, budget_hours } = task
          let dates = businessDays(new Date(start_date),new Date(due_date))
          let usersCount = users.length
          let datesCount = dates.length
          if (usersCount==0) {
            table.appendRows(
              dates.map(date=>({
                date,
                day_type: dayType(date),
                task_id: id,
                workload: budget_hours/datesCount
              }))
          } else {
            for (let user of users) {
              table.appendRows(
                dates.map(date=>({
                  date,
                  day_type: dayType(date),
                  task_id: id,
                  user_id: user,
                  workload: budget_hours/usersCount/datesCount
                }))
              )
            }
          }
        }
        doneCallback()
      })()
    } else if (id == "entries") {
      (async () => {
        let {data} = await paymo.get(id+'?where=time_interval in ("2018-01-01T00:00:00Z","2028-01-01T00:00:00Z")')
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
    tableau.password = document.getElementById("token").value
    tableau.submit()
  })
})
