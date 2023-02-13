//This module includes the functions used by ComWrap.vue
//Split into a ts file to reduce the size of ComWrap.vue
//
import {
  ref,
  computed,
  defineAsyncComponent,
  isRef,
  isReactive,
  reactive,
  toRaw,
  inject,
  provide,
} from "vue";
import {standardizedConfig} from './compBaseUtil.ts'
import { getByPath, setByPath } from "./pathUtil.ts";
import { parseSlot } from "./SlotUtil.ts";
//
export function useCompBase(props, emit) {
  //Try to convert config to standard format
  var configStd = standardizedConfig(parseConfig()) || {};

  //since provide/inject should be called in setup,so save here
  var instances = obtainInstances();

  //modelValue - Here we need to use computed and return configStd.sys?.modelValue does not work.
  const modelValue = computed({
    get() {
      let modelValuePath = configStd.sys?.modelValuePath;
      if (modelValuePath) {
        return getByPath(configStd.sys?.modelValue, modelValuePath);
      } else {
        return configStd.sys?.modelValue;
      }
    },
    set(valueNew) {
      //
      if (!configStd.sys?.hasOwnProperty("modelValue")) {
        //do nothing
        return;
      }
      //
      let modelValuePath = configStd.sys?.modelValuePath;
      if (modelValuePath) {
        setByPath(configStd.sys?.modelValue, modelValuePath, valueNew);
      } else {
        configStd.sys.modelValue = valueNew;
      }
    },
  });
  //Parse component
  //if it is a function, consider it is imported as "() => import('xxx')",
  //so function will be wrapped into defineAsyncComponent
  //To avoid the below warning, the return is wrapped with toRaw
  //Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
  const parseBaseComponent = computed(() => {
    let component = configStd.sys?.component;
    //
    if (component && typeof component == "function") {
      return toRaw(defineAsyncComponent(component));
    }
    //
    return toRaw(component);
  });
  //
  const configProps = computed(() => {
    if (!configStd || !configStd.props) {
      return {};
    }
    //
    return configStd.props;
  });

  //
  const eventHandlers = computed(() => {
    if (!configStd || !configStd.events) {
      return {};
    }
    let events = {} as { [key: string]: any };
    for (let key of Object.keys(configStd.events)) {
      events[key] = handleEvent(key, handleEvent(key, configStd.events[key]));
    }
    //
    return events;
  });
  //
  function handleEvent(key: string, config: any) {
    return function () {
      if (typeof config == "function") {
        config(...arguments);
        return;
      }
      //If it is a String, the function can be found by component tree,may implemented later
      //If it is not a funciton directly, consider it is a JSON
      let type = config?.type;
      if (type == "function" && typeof config?.value == "function") {
        config.value(buildContext(),...arguments);
        return;
      } else if (type == "inherit") {
        //
        emit(config.value ? config.value : key, ...arguments);
        return;
      } else {
        throw "Unsupported event type:" + typeof type;
      }
    };
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
    if (!configStd || !configStd.styles) {
      return {};
    }
    //
    return configStd.styles;
  });

  //
  const configClasses = computed(() => {
    if (!configStd || !configStd.classes) {
      return [];
    }
    //
    return configStd.classes;
  });

  //
  function getRef(instanceKey: string) {
    //if instanceKey is not provided,assume to get the current component
    if (!instanceKey) {
      instanceKey = configStd?.sys?.instanceKey;
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
    return { emit, props, getRef};
  }
  //Parse config,evaluate  if it is function
  function parseConfig() {
    let c = props.config;
    if (typeof c == "function") {
      return c(buildContext());
    } else {
      return c;
    }
  }
  //This function is to set this component instance to global(use obtainInstances) storage
  function setComponentInstance(el) {
    let key = isRef(configStd)? configStd.value.sys?.instanceKey
      : configStd?.sys?.instanceKey;
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
    parseBaseComponent,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    eventHandlers,
    context,
    setComponentInstance,
    getRef,
  };
}
