const patientTableColumns = [
  {
    columnId: "familyName",
    columnName: "Family Name",
    type: String,
    isSortedAsc: true,
  },
  {
    columnId: "givenName",
    columnName: "Given Name",
    type: String,
    isSortedAsc: true,
  },
  {
    columnId: "birthDate",
    columnName: "Birth Date",
    isSortedAsc: true,
  },
  {
    columnId: "sex",
    columnName: "Sex",
    type: String,
    isSortedAsc: true,
  },
  {
    columnId: "nOfParameters",
    columnName: "N. of parameters",
    type: Number,
    isSortedAsc: true,
  },
  {
    columnId: "alert",
    columnName: "Alert",
    type: Boolean,
    isSortedAsc: true,
  },
];

export default patientTableColumns;
