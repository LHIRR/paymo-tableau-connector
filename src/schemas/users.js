export default {
  id: "users",
  alias: "Users",
  columns: [{
      id: "id",
      alias: "User ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "email",
      alias: "Email",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "active",
      alias: "Active ?",
      dataType: tableau.dataTypeEnum.bool
    },
    {
      id: "workday_hours",
      alias: "Work hours / day",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "price_per_hour",
      alias: "Price / hour",
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
