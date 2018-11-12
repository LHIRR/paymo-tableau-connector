export default {
  id: "clients",
  alias: "Clients",
  columns: [{
      id: "id",
      alias: "Client ID",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "city",
      alias: "City",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "postal_code",
      alias: "Postal code",
      dataType: tableau.dataTypeEnum.int
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
