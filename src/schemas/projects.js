export default {
  id: "projects",
  alias: "Projects",
  columns: [{
      id: "id",
      alias: "Project ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "code",
      alias: "Code",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "client_id",
      alias: "Client ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "status_id",
      alias: "Status ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "active",
      alias: "Active ?",
      dataType: tableau.dataTypeEnum.bool
    },
    {
      id: "billable",
      alias: "Billable ?",
      dataType: tableau.dataTypeEnum.bool
    },
    {
      id: "price",
      alias: "Price",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "estimated_price",
      alias: "Estimated price",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "budget_hours",
      alias: "Time budget",
      dataType: tableau.dataTypeEnum.float
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
