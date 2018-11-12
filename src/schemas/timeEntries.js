export default {
  id: "entries",
  alias: "Time entries",
  columns: [{
      id: "id",
      alias : "Time entry ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "project_id",
      alias: "Project ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "task_id",
      alias: "Task ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "user_id",
      alias: "User ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "start_time",
      alias: "Start time",
      dataType: tableau.dataTypeEnum.datetime
    },
    {
      id: "end_time",
      alias: "End time",
      dataType: tableau.dataTypeEnum.datetime
    },
    {
      id: "date",
      alias: "Date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "duration",
      alias: "Duration",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "created_on",
      alias: "Creation date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "updated_on",
      alias: "Last modification date",
      dataType: tableau.dataTypeEnum.date
    }
  ]
}
