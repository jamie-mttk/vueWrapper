import { ref, reactive } from "vue";

export function useMyTable(value: any, config: any) {
  let result = {
    sys: {
      component: "el-table",
    },
    props: {
      stripe: true,
      border: true,
      showHeade: true,
      //
      data: value,
    },
    slots: {default: {type: "wrap", value: []}}
  };
  //build default
  result.slots.default.value = buildColumns(config);
  //
  return reactive(result);
}

function buildColumns( config: any) {
  let columns = [];
  //
  for (let c of config.columns || []) {
    columns.push(buildColumn( c));
  }
  //
  return columns;
}
function buildColumn(c: any) {
  let column = {
    sys: {
      component: "el-table-column",
    },
    props: {},
  };
  //props
  for (let k of Object.keys(c)) {
	if(k.startsWith('_')){
		continue;
	}
    column.props[k] = c[k];
  }
  //If there is a formatter, try to handle this
  if (c._formatter){
	column.slots={default:c._formatter}
  }
  //
  return column;
}
