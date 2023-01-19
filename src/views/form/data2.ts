//
export const configFormSimple = {
  items: [
    {
      props: {
        label: "Name",
        prop: "name",
        labelWidth: "50px",
      },
      component: "ElInput",
      componentProp: {
        placeholder: "Please input name to filter",
        clearable: true,
      },
    },
    {
      props: {
        prop: "address",
      },
      component: "ElInput",
      componentProp: {
        placeholder: "Please input addrss to filter",
        clearable: true,
      },
    },
  ],
};
