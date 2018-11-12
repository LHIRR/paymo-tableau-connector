export default {
  id: "calendar",
  alias: "Team calendar",
  columns: [
    {
      id: "entry_type",
      alias: "Entry type",
      dataType: tableau.dataTypeEnum.string
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
      id: "date",
      alias: "Date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "duration",
      alias: "Duration",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "day_type",
      alias: "Day type",
      dataType: tableau.dataTypeEnum.string
    }
  ]
}
