export const configTableSimple = {
  columns: [
    {
      type: "selection",
    },
    {
      type: "index",
      label: "#",
    },
    {
      prop: "date",
      label: "Date",
      sortable: true,
      width: "200px",
    },
    {
      prop: "name",
      label: "Name",
      width: "300px",
      _formatter: elTagFormatter('primay','name'),
    },
    {
      prop: "address",
      label: "Address",
      _formatter: elTagFormatter('success','address'),
    },
  ],
};

function elTagFormatter(type, key) {
  return function (sp) {
    let address = sp.slotValue.row[key];
    //This the HTML of el-tag
    return (
      '<span class="el-tag el-tag--'+type+' el-tag--dark">' +
      '<span class="el-tag__content">' +
      address +
      "</span>" +
      "</span>"
    );
  };
}
