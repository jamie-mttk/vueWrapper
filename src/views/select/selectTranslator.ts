import { ref, reactive } from "vue";


export function useMySelect(config: any) {
  //Clone may cause the value to be evaluted?So no clone here so far
let configNew=config
  //extra
  let extra = configNew.extra;
  delete configNew.extra;
  //
  if (extra?.options) {
    translateOptions(extra.options, configNew);
  }
  //
  return reactive(configNew);
}

//translate options from config to slot
function translateOptions(options, configNew) {
  //
  if (!configNew.slots) {
    configNew.slots = {};
  }
  //
  let valueOptions = options.value;
  if (!valueOptions) {
    return;
  }
  if (Array.isArray(valueOptions)) {
    //build wrap array
    configNew.slots.default =parseOptionsArray(options, valueOptions)
  } else if (typeof valueOptions == "function") {
    configNew.slots.default=  parseOptionsFunction(options,valueOptions)
  } else {
    throw "Unsupported value option type:" + typeof valueOptions;
  }
}
//parse options array to wrap options
function parseOptionsArray(options, value) {
  let labelField = options.labelField || "id";
  let valueField = options.valueField || "name";
  //
  let result ={
    type: "wrap",
    value:[]}
  //
  for (let v of value) {
    result.value.push({
        sys: { component: "el-option" },
        props: {
          label: v[labelField],
          value: v[valueField],
        }
      }
   );
  }
  //
  return result;
}
//
function parseOptionsFunction(options, value) {
  //Evaluate function 
  let result=value()
  //
  return parseOptionsArray(options,result)

}