//模拟这是一个StandardPage
import { ref, reactive, computed } from "vue";

import { useMyForm } from "@/views/form/formTranslator.ts";
import { useMyTable } from "@/views/table/tableTranlator.ts";
//
//HAHA,这里通过config提供参数，其实可以定义config的数据格式
export default function useApp1Transtator(config) {
  //
  const criteriaValue = reactive({});
  const tableValue = ref([]);
  //
  function onSearch() {
	//First we could validate form here,ignored
	//Call configed function to retrieve data
    let result = config.retrieveMethod(criteriaValue);
    tableValue.value = result;
  }
  //
  const configTranslated = reactive({
    sys: { component: "el-row" },
    props: {
      gutter: 10,
      justify: "start",
      align: "top",
    },
    //
    slots: {
      default: [
        {
          sys: { component: "el-col" },
          props: {
            span: 22,
          },
          slots: {
            default: useMyForm(criteriaValue, config.criteriaConfig),
          },
        },
        {
          sys: { component: "el-col" },
          props: {
            span: 2,
          },
          slots: {
            default: {
              sys: { component: "ElButton" },
              props: {
                type: "success",
              },
              slots: {
                default: "Search",
              },
              events: {
                click: onSearch,
              },
            },
          },
        },
        {
          sys: { component: "el-col" },
          props: {
            span: 24,
          },
          slots: {
            default: useMyTable(tableValue, config.tableConfig),
          },
        },
      ],
    },
  });
  //
  return { configTranslated, criteriaValue, tableValue };
}
