export default {
  id: "tasks",
  alias: "Tasks",
  columns: [
    {
      id: "id",
      alias: "Task ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "project_id",
      alias: "Project ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "tasklist_id",
      alias: "Tasklist ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "description",
      alias: "Description",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "complete",
      alias: "Complete ?",
      dataType: tableau.dataTypeEnum.bool
    },
    {
      id: "billable",
      alias: "Billable ?",
      dataType: tableau.dataTypeEnum.bool
    },
    {
      id: "due_date",
      alias: "Due date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "start_date",
      alias: "Start date",
      dataType: tableau.dataTypeEnum.date
    },
    {
      id: "price_per_hour",
      alias: "Price / hour",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "budget_hours",
      alias: "Time budget",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "estimated_price",
      alias: "Estimated price",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "progress_status",
      alias: "Status",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "progress",
      alias: "Progress",
      dataType: tableau.dataTypeEnum.float
    }
  ]
}
