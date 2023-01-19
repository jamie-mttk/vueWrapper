import { ref, reactive,computed} from "vue";

//The value of the input which are share in this sample
export const valueInput = ref("InitValue");

//A simple input configuration
export const configInput1 = reactive({
  sys: {
    //
    component: "ElInput",
    //Set modelValue with computed,demo only since here it is not necessary
    modelValue: computed({
      get() {
        return valueInput.value
      },
      set(value) {
        valueInput.value=value
      }
    }),
  },
  props: {
    placeholder: "Please input value",
    clearable: true,
  },
  slots: {},
  events: {},
});
//
//Input size to demostrate that the config properties can be changed dynamically
const inputSize = ref("default");
//A complex input configuration
export const configInput2 = reactive({
  sys: {
    //
    component: "ElInput",
    modelValue: valueInput,
  },
  props: {
    placeholder: "Please input value complex sample",
    clearable: true,
    prefixIcon: "Calendar",
    disabled: false,
    size: inputSize,
  },
  slots: {
    //It can be an array/object, the value can be an array/object as well
    //For one slot it can be configured by different types
    prefix: [
      { type: "text", value: ["text1", "text2"] },
      {
        type: "wrap",
        value: {
          //Use element tag to display name
          sys: {
            component: "el-tag",
          },
          props: {
            type: "primary",
            effect: "dark",
          },
          slots: {
            default: "Test tag1",
          },
          events: {},
        },
      },
    ],
    //If both inherit and something else is configured, what will happen?
    //If the inherit is implemented at parent component ,the inherit will take place;otherwise the inherit is ignored
    suffix: [{ type: "inherit", value: "mysuffix" }, "Pure text"],

    //Here to demostrate different way to set slots
    prepend: { type: "function", value: samplePrepend },
    //The value is a array
    append: [{ type: "html", value: "H<b>ell</b>o " }, sampleAppend],
  },
  events: {
    //Once get focus enlarge the component and restore once lose focus
    blur: { type: "function", value: inputBlur },
    focus: { type: "function", value: inputFocused },
  },
});
//
function samplePrepend() {
  return "Hello <b>prepend</b>";
}
function sampleAppend() {
  return "World <b>append</b>";
}

function inputFocused() {
  inputSize.value = "large";
}
function inputBlur() {
  inputSize.value = "default";
}
