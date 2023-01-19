import { ref, reactive } from "vue";

//The value of the input which are share in this sample
export const value = ref("003");

//
export const config1 = reactive({
  sys: {
    //
    component: "ElSelect",
    modelValue: value,
  },
  props: {
    placeholder: "Please select manager",
    clearable: true,
    filterable: true,
  },
  slots: {
    default: [
      {
        type: "wrap",
        value: {
          sys: { component: "ElOption" },
          props: { label: "Tom", value: "001" },
        },
      },
      {
        type: "wrap",
        value: {
          sys: { component: "ElOption" },
          props: { label: "Jack", value: "002" },
        },
      },
      {
        type: "wrap",
        value: {
          sys: { component: "ElOption" },
          props: { label: "Peter", value: "003" },
        },
      },
      {
        type: "wrap",
        value: {
          sys: { component: "ElOption" },
          props: { label: "Alice", value: "004" },
        },
      },
    ],
  },
  events: {},
});

//
export const config2 = reactive({
  sys: {
    //
    component: "ElSelect",
    modelValue: value,
  },
  props: {
    placeholder: "Please select",
    clearable: true,
    filterable: true,
  },
  slots: {},
  events: {},
  extra: {
    options: {
      valueField: "code",
      labelField: "name",
      value: [
        { code: "001", name: "Tom" },
        { code: "002", name: "Jack" },
        { code: "003", name: "Peter" },
        { code: "004", name: "Alice" },
      ],
    },
  },
});
//
export const config3 = reactive({
  sys: {
    //
    component: "ElSelect",
    modelValue: value,
  },
  props: {
    placeholder: "Please select",
    clearable: false,
    filterable: false,
  },
  slots: {},
  events: {},
  extra: {
    options: {
      valueField: "code",
      labelField: "name",
      value: loadOptions,
    },
  },
});
//Demo to load data,maybe from remote server
function loadOptions() {
  return [
    { code: "001", name: "Tom" },
    { code: "002", name: "Jack" },
    { code: "003", name: "Peter" },
    { code: "004", name: "Alice" },
  ];
}
