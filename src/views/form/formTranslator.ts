import { ref, reactive } from "vue";
import CompWrap from "@/components/vueWrapper/CompWrap.vue";
//
export function useMyForm(formValue: any, config: any) {
  return reactive({
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
        value: buildItems(formValue, config),
      },
    },
  });
}

function buildItems(formValue: any, config: any) {
  let items = [];
  //
  for (let childConfig of config.items) {
    items.push(buildItem(formValue, childConfig));
  }
  //
  return items;
}
function buildItem(formValue: any, c: any) {
	if(!c.props?.prop){
		throw 'prop is missing in config:'+JSON.stringify(c)
	}
	//If label is not set, use prop instead  
	//This is a simple demo to optimize the configuration by using default value
	if (!c.props?.label){
		c.props.label=c.props.prop
	}
	//component(such as input/select,etc.) config
	let v= {
		sys: {
		  component: c.component,
		   //Use modelValuePath config modelValue
		  modelValue: formValue,
		  modelValuePath:c.props.prop,
		},
		props: c.componentProp||{},
	  }
	//
  let item = {
    sys: {
      //
      component: "el-form-item",
    },
    props:c.props,
    slots: {
      default: {
        type: "wrap",
        value: v,
      },
    },
  };
  //
  return item;
}
