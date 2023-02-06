//提供了通用的一些自定义组件的创建支持
import {
  ref,
  computed,
  defineAsyncComponent,
  isRef,
  isReactive,
  reactive,
  toRaw,
} from "vue";
import { getByPath, setByPath } from "./pathUtil.ts";
import { parseSlot } from "./SlotUtil.ts";
//
//定义配置的数据类型
export interface configType {
  component: any;
  props?: {
    [key: string]: any;
  };
  slots?: {
    [key: string]: any;
  };
  events?: {
    [key: string]: any;
  };
  styles?: {
    [key: string]: any;
  };
}
export interface propsType {
  modelValue?: any;
  config?: configType;
}

export function useCompBase(props, emit) {
  //Try to convert config to standard format
  let configStd = convertFlatIfNeeded(parseConfig()) || {};

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
  const parseBaseComponent = computed(() => {
    let component = configStd.sys?.component;
    //
    if (component && typeof component == "function") {
      return defineAsyncComponent(component);
    }
    //
    return component;
  });
  //
  const configProps = computed(() => {
    if (!configStd || !configStd.props) {
      return {};
    }
    //console.log(JSON.stringify(configStd.props))
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
        config.value( ...arguments);
        return;
      } else if (type == "inherit") {
        //抛出事件
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
  const componentWrapRef = ref(null);
  //
  function callMethod(methodName: string, ...paras: any[]) {
    const code = "componentWrapRef.value." + methodName + "(...paras)";
    return eval(code);
  }

  //Convert flat config to standard format
  function convertFlatIfNeeded(config) {
    if (!config["~component"]) {
      //Considier it is standard config, do not conver
      return config;
    }
    //Here use toRaw to get raw value
    let configNew = convertFlatInternal(toRaw(config));

    //Here we keep the Reactivity if needed
    if (isRef(config)) {
      return ref(configNew);
    } else if (isReactive(config)) {
      return reactive(configNew);
    } else {
      return configNew;
    }
  }
  //Core function of convert flat config to standand config
  function convertFlatInternal(config) {
    //styles/classes are one level, so it can be set directly
    //And please also note it is a low level copy!
    let configNew = { sys: {}, props: {}, slots: {}, events: {} };
    for (let k of Object.keys(config)) {
      if (k.startsWith("~")) {
        //
        if ("~styles" == k) {
          configNew.styles = config[k];
        } else if ("~classes" == k) {
          configNew.classes = config[k];
        } else {
          //sys
          configNew.sys[k.substring(1)] = config[k];
        }
      } else if (k.startsWith("#")) {
        //slot

        //consider # as default slot
        configNew.slots["#" == k ? "default" : k.substring(1)] = config[k];
      } else if (k.startsWith("@")) {
        //event
        configNew.events[k.substring(1)] = config[k];
      } else {
        //props
        configNew.props[k] = config[k];
      }
      //
    }
    //
    return configNew;
  }
  //build context  used by config function
  const context= computed(() => {
    return buildContext();
  })
//Because of the JS Hoisting, parseConfig can not access context directly
//Error:  can't access lexical declaration 'context' before initialization
function buildContext(){
  return { emit, props, callMethod };
}
  //Parse config,evaluate  if it is function
  function parseConfig() {
    let c=props.config;
    if (typeof c=='function'){
      return c(buildContext())
    }else{
      return c;
    }
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
    componentWrapRef,
    context,
    callMethod,
  };
}
