import { ref, reactive, isRef, computed } from "vue";

export const formValue = reactive({ name: "o", address: "1" });
export const formConfig1 = reactive({
  sys: {
    //
    component: "ElForm",
  },
  props: {
    // inline:true,
    labelPosition: "right",
    labelWidth: 60,
    size: "default",
    disabled: false,
    model: formValue,
    inline: true,
  },
  //
  slots: {
    default: {
      type: "wrap",
      value: [
        {
          sys: {
            //
            component: "el-form-item",
          },
          props: {
            //
            label: "Name",
            prop: "name",
            labelWidth: "50px",
            required: true,
          },
          slots: {
            default: {
              type: "wrap",
              value: {
                sys: {
                  component: "ElInput",
                  //Use a computed to config modelValue
                  modelValue: computed({
                    get() {
                      return formValue.name;
                    },
                    set(valueNew) {
                      formValue.name=valueNew
                    },
                  }),
                },
                props: {
                  //
                  placeholder: "Please input name to filter",
                  clearable: false,
                },
              },
            },
          },
        },
        {
          sys: {
            //
            component: "el-form-item",
          },
          props: {
            label: "Address",
            prop: "address",
          },
          slots: {
            default: {
              type: "wrap",
              value: {
                sys: {
                  component: "ElInput",
                   //Use modelValuePath config modelValue
                  modelValue: formValue,
                  modelValuePath:'address',
                },
                props: {
                  placeholder: "Input address to filter",
                },
              },
            },
          },
        },
      ],
    },
  },
  events: {
    validate: { type: "inherit", value: "validate" },
  },
});
