//提供了通用的一些自定义组件的创建支持
import { ref, computed, isRef, isReactive } from "vue";
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
  modelValue?: any; //说明可以接受任意类型
  config?: configType;
}

export function useCompBase(props, emit) {
  //modelValue - Here we need to use computed and return props.config?.sys?.modelValue does not work.
  const modelValue = computed({
    get() {
      let modelValuePath = props.config?.sys?.modelValuePath;
      if (modelValuePath) {
        return getByPath(props.config?.sys?.modelValue, modelValuePath);
      } else {
        return props.config?.sys?.modelValue;
      }
    },
    set(valueNew) {
      //
      if (!props.config?.sys?.hasOwnProperty("modelValue")) {
        //do nothing
        return;
      }
      //
      let modelValuePath = props.config?.sys?.modelValuePath;
      if (modelValuePath) {
        setByPath(props.config?.sys?.modelValue, modelValuePath, valueNew);
      } else {
        props.config.sys.modelValue = valueNew;
      }
    },
  });
  //此组件属性的配置，过滤掉所有下划线开头的属性
  const configProps = computed(() => {
    if (!props.config || !props.config.props) {
      return {};
    }
    //console.log(JSON.stringify(props.config.props))
    //
    return props.config.props;
  });

  //事件处理相关的
  const eventHandlers = computed(() => {
    if (!props.config || !props.config.events) {
      return {};
    }
    let events = {} as { [key: string]: any };
    for (let key of Object.keys(props.config.events)) {
      events[key] = handleEvent(
        key,
        handleEvent(key, props.config.events[key])
      );
    }

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
        config.value(...arguments);
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
    return parseSlot(props.config);
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

  //此组件Style的配置
  const configStyles = computed(() => {
    if (!props.config || !props.config.styles) {
      return {};
    }
    //
    return props.config.styles;
  });

  //此组件class的配置
  const configClasses = computed(() => {
    if (!props.config || !props.config.classes) {
      return [];
    }
    //
    return props.config.classes;
  });

  //指向目标对象
  const componentWrapRef = ref(null);
  //调用函数
  function callMethod(methodName: string, ...paras: any[]) {
    const code = "componentWrapRef.value." + methodName + "(...paras)";
    return eval(code);
  }

  //以下适用于批量处理
  //获取配置值，先从childConfig的props获取,没找到则从本组件的config中获取，没有则返回defaultVal
  function getNestedConfig(
    key: string,
    childConfig: any,
    defaultVal: any
  ): any {
    //从childConfig获取
    let temp = childConfig?.props[key];
    if (temp) {
      return temp;
    }
    //从本组件的config获取
    temp = props?.config?.props[key];
    if (temp) {
      return temp;
    }
    //
    return defaultVal;
  }

  //
  return {
    modelValue,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    eventHandlers,
    componentWrapRef,
    callMethod,
    getNestedConfig,
  };
}
