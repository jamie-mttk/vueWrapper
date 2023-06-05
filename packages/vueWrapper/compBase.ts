//This module includes the functions used by ComWrap.vue
//Split into a ts file to reduce the size of ComWrap.vue
//
import {
  computed,
  defineAsyncComponent,
  isRef,
  reactive,
  toRaw,
  inject,
  provide,unref,
} from "vue";
import { standardizedConfig } from "./compBaseUtil.ts";
import { getByPath, setByPath } from "./pathUtil.ts";
import { parseSlot } from "./SlotUtil.ts";
//
export function useCompBase(props, emitRaw) {
  //
  const emit=customziedEmit
  //Try to convert config to standard format
  // console.log('################')
  // console.log(props.config)
  var configStd = computed(() => standardizedConfig(buildContext()));
  // console.log('@@@@@@@@@@@@@@@@')
  // console.log(unref(configStd))
  //var configStd =standardizedConfig(buildContext())
  //since provide/inject should be called in setup,so save here
  var instances = obtainInstances();

  //modelValue - Here we need to use computed and return configStd.sys?.modelValue does not work.
  const modelValue = computed({
    get() {
      let modelValuePath = configStd.value.sys?.modelValuePath;
      if (modelValuePath) {
        return getByPath(configStd.value.sys?.modelValue, modelValuePath);
      } else {
        return isRef(configStd.value.sys?.modelValue)
          ? configStd.value.sys?.modelValue.value
          : configStd.value.sys?.modelValue;
      }
    },
    set(valueNew) {
      //
      if (!configStd.value.sys?.hasOwnProperty("modelValue")) {
        //do nothing
        return;
      }
      //
      let modelValuePath = configStd.value.sys?.modelValuePath;
      if (modelValuePath) {
        setByPath(configStd.value.sys.modelValue, modelValuePath, valueNew);
      } else {
        if (isRef(configStd.value.sys.modelValue)) {
          configStd.value.sys.modelValue.value = valueNew;
        } else {
          configStd.value.sys.modelValue = valueNew;
        }
      }
    },
  });
  const modelValueName = computed(() => {
    if (configStd.value.sys?.modelValueName == undefined) {
      //Not set,use modelValue
      return "modelValue";
    }
    //
    return configStd.value.sys.modelValueName;
  });
  //Parse component
  //if it is a function, consider it is imported as "() => import('xxx')",
  //so function will be wrapped into defineAsyncComponent
  //To avoid the below warning, the return is wrapped with toRaw
  //Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
  const parseBaseComponent = computed(() => {
    let component = configStd.value.sys?.component;
    //
    if (component && typeof component == "function") {
      return toRaw(defineAsyncComponent(component));
    }
    //
    return toRaw(component);
  });
  //v-show
  const configShow = computed(() => {
    if (configStd.value.sys?.show == undefined) {
      //Not set,always show
      return true;
    }
    const show = isRef(configStd.value.sys.show)
      ? configStd.value.sys.show.value
      : configStd.value.sys.show;
    // here is to convert to real true/false
    return show ? true : false;
  });
    //v-if
    const configIf = computed(() => {
      if (configStd.value.sys?.if == undefined) {
        //Not set,always show
        return true;
      }
      const ifValue = isRef(configStd.value.sys.if)
        ? configStd.value.sys.if.value
        : configStd.value.sys.if;
      // here is to convert to real true/false
      return ifValue ? true : false;
    });
  //modelValue name,the default value is modelValue

  //
  const configProps = computed(() => {
    // console.log('configProps is calculated!~~~')
    // console.log(configStd.value.props)
    if (!configStd || !configStd.value.props) {
      return {};
    }
    //
    let result = {};
    for (const k of Object.keys(configStd.value.props)) {
      const v = configStd.value.props[k];
      //Here is to calculate the computed... I do not know why it is needed
      result[k] = isRef(v) ? v.value : v;
    }
    //
    return result;
  });

  //
  const eventHandlers = computed(() => {
    if (!configStd || !configStd.value.events) {
      return {};
    }
    let events = {} as { [key: string]: any };
    for (let key of Object.keys(configStd.value.events)) {
      // console.log('@@@@@@@@@'+key)
      // console.log(configStd.value.events[key])
      // console.log(JSON.stringify(configStd.value.events[key]))
      // events[key] = handleEvent(
      //   key,
      //   handleEvent(key, configStd.value.events[key])
      // );
      events[key] = handleEvent(key,configStd.value.events[key] );
    }
    //
    return events;
  });
  //
  function handleEvent(key: string, configEvent: any) {
    // console.log('###'+key)
    // console.log(configEvent)
    return function () {
      if (typeof configEvent == "function") { 
          configEvent(buildContext(), ...arguments);
        return;
      }
      //If it is a String, the function can be found by component tree,may implemented later
      //If it is not a funciton directly, consider it is a JSON
      let type = configEvent?.type;
      if (type == "function" && typeof configEvent?.value == "function") {
        // console.log("~~~~~~~~~" + key);
        // console.log(arguments);
        configEvent.value(buildContext(), ...arguments);
        return;
      } else if (type == "inherit") {
        //
        emit(configEvent.value ? configEvent.value : key, ...arguments);
        return;
      } else {
        throw "Unsupported event type:" + typeof type;
      }
    };
  }
//Why we need a customzied emit? We need to catch the event to triiger possible event handle defined in event config
function customziedEmit(event: string, ...args: any[]){
 const handler=eventHandlers.value[event]
 // console.log('Handler is found:'+handler)
 if(handler){
  handler(args)
 }
  //
  emitRaw(event,...args)
}
  //Slot configuration - well formated
  const configSlots = computed(() => {
    return parseSlot(configStd);
  });
  //Only the slots with inherit is returned
  const configSlotsInherit = computed(() => {
    let result = {};
    for (let key of Object.keys(configSlots.value)) {
      let value = configSlots.value[key];
      //
      for (let v of value) {
        if (v.type == "inherit") {
          //Multiple inherit define for one slot is not supported
          result[key] = v;
        }
      }
    }
    return result;
  });

  //
  const configStyles = computed(() => {

    if (!configStd || !configStd.value.styles) {
      return reactive({});
    }
    //Here the returned value should wrapped by reactive,same as classes
    //Otherwise, the value will not be evaluated (For example backgroundColor:myColor ,myColor is a ref)
    let styles=configStd.value.styles
    if(isRef(styles)){
      styles=styles.value
    }

    return reactive(styles);
  });

  //
  const configClasses = computed(() => {
    if (!configStd || !configStd.value.classes) {
      return reactive([]);
    }
    //
    let classes=configStd.value.classes
    if(isRef(classes)){
      classes=classes.value
    }
    return reactive(classes);
  });

  //
  const configLifecycle = computed(() => {
    if (!configStd || !configStd.value.lifecycle) {
      return {};
    }
    //
    const lifecycle = configStd.value.lifecycle;
    //
    return isRef(lifecycle) ? lifecycle.value : lifecycle;
  });
  //
  function getRef(instanceKey: string) {
    //if instanceKey is not provided,assume to get the current component
    if (!instanceKey) {
      instanceKey = configStd.value.sys?.instanceKey;
    }
    //
    if (!instanceKey || !instances) {
      //Maybe component is not intitialized
      return undefined;
    }
    //
    //
    return instances[instanceKey];
  }
  //build context  used by config function
  const context = computed(() => {
    return buildContext();
  });
  //Because of the JS Hoisting, parseConfig can not access context directly
  //Error:  can't access lexical declaration 'context' before initialization
  function buildContext() {
    return { emit, props, getRef ,slotParaStack:props.slotParaStack};
  }

  //This function is to set this component instance to global(use obtainInstances) storage
  function setComponentInstance(el) {
    let key = configStd.value.sys?.instanceKey;
    if (!key) {
      //since key is always set,so the code should NOT go here
      return;
    }
    //
    if (el) {
      //add
      instances[key] = el;
    } else {
      //remove
      delete instances[key];
    }
  }
  //Inject(Get from parent component) or provide (Creat a new and provide to children) instances
  //Instances is a map to store component key and component $el
  function obtainInstances() {
    const instancesExist = inject("vueWrapperInstances", undefined);
    if (instancesExist != undefined) {
      return instancesExist;
    }
    //
    const instancesNew = reactive({});
    provide("vueWrapperInstances", instancesNew);
    //
    return instancesNew;
  }

  //
  return {
    modelValue,
    modelValueName,
    parseBaseComponent,
    configIf,
    configShow,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    configLifecycle,
    eventHandlers,
    context,
    setComponentInstance,
    getRef,
  };
}
