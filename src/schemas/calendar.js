export default {
  id: "calendar",
  alias: "Team calendar",
  columns: [
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
      id: "workload",
      alias: "Workload (hours)",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "day_type",
      alias: "Day type",
      dataType: tableau.dataTypeEnum.string
    }
  ]
}
