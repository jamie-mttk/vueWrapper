import { ref, reactive } from "vue";

import { tableValue } from "@/views/table/data1.ts";
import { useMyTable } from "@/views/table/tableTranlator.ts";
import { configTableSimple } from "@/views/table/data2.ts";

import { formValue } from "@/views/form/data1.ts";
import { useMyForm } from "@/views/form/formTranslator.ts";
import { configFormSimple } from "@/views/form/data2.ts";

export const tabsSelect = ref("Basic");
//TABLE
const tableConfig = useMyTable(tableValue, configTableSimple);

//FORM
const formConfig = useMyForm(formValue, configFormSimple);

//
export const tabsConfig = reactive({
  sys: {
    component: "el-tabs",
    modelValue: tabsSelect,
  },
  props: {
    type: "card",
    tabPosition: "top",
  },
  slots: {
    //Please note ,the type is ignored; type=warp will automatically added by engine
    default:  [
        {
          sys: {
            component: "el-tab-pane",
          },
          props: {
            disabled: false,
            name: "Basic",
            closable: false,
          },
          slots: {
            label: { type: "html", value: "Basic <b>Information</b>" },
            default: {
              type: "html",
              value: "Demostrate tab,a piece of HTML, a FORM and a table",
            },
            // suffix: { type: 'inherit', value: 'mysuffix' },
          },
        },
        {
          sys: {
            component: "el-tab-pane",
          },
          props: {
            //子元素配置,具体含义由组件决定,这里不以_开头的会设置到Form Item上
            label: "Advanced",
            disabled: false,
            name: "Advanced",
            closable: false,
          },
          slots: {
            default: { type: "wrap", value: tableConfig },
          },
        },
        {
          sys: {
            component: "el-tab-pane",
          },
          props: {
            label: "Extra",
            disabled: false,
            name: "Extra",
            closable: true,
          },
          slots: {
            default: { type: "wrap", value: formConfig },
          },
        },
      ],

  },
});
