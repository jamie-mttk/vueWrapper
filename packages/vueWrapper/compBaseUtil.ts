import { isRef, isReactive, toRaw } from "vue";

//Conver to standard format if the config is flat format
//Add missing fields: so far only instanceKey is added
export function standardizedConfig(ctx) {
  // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~')
  // console.log(ctx)
  //eval if config is a funciton
  const config = evalConfig(ctx) || {};

  //
  //get raw config,consider ref or reactive
  let configNew = getRawValue(config);
  //
  //check whether there is transform,if yes ,call it
  configNew = handleTransform(configNew, ctx);
  //convert to standard format if it is a flat structure
  configNew = convertFlatConfig(configNew);

  //apply instance key if it is not provided
  applyInstanceKey(configNew);
  //
  return configNew;
}

//Convert flat config to standard format if it is flat format;otherwise return directly
export function convertFlatConfig(config) {
  //
  if (!config["~component"]) {
    //Considier it is standard config, do not convert
    return config;
  }
  //
  return convertFlatInternal(config);
}

//**********************************************************
//* Below are private functions
//**********************************************************
//Parse config,evaluate if it is function
function evalConfig(ctx) {
  let c = ctx.props.config;

  if (typeof c == "function") {
    return c(ctx);
  } else {
    return c;
  }
}

//GET raw of the confif, if it is ref,call .value,otherwise call toRaw
function getRawValue(para) {
  if (isRef(para)) {
    return para.value;
  } else if (isReactive(para)) {
    //here we should use toRaw to get the original object,otherwise the convertFlatConfig will not work --- the value,for example modelValue will be unwrapped
    return toRaw(para);
  } else {
    return para;
  }
}

//Core function of convert flat config to standand config
function convertFlatInternal(config) {
  //styles/classes are one level, so it can be set directly
  //And please also note it is a low level copy!
  let configNew = {
    sys: {},
    props: {},
    slots: {},
    events: {},
    styles: {},
    classes: [],
    lifecycle: {},
  };
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
      //consider # as default slot
      configNew.slots["#" == k ? "default" : k.substring(1)] = config[k];
    } else if (k.startsWith("@")) {
      //event
      configNew.events[k.substring(1)] = config[k];
    } else if (k.startsWith("^")) {
      //lifecycle
      configNew.lifecycle[k.substring(1)] = config[k];
    } else {
      //props - no special prefix
      configNew.props[k] = config[k];
    }
  }
  //
  // console.log('#################')
  // console.log(JSON.stringify(configNew,null,2))
  //
  return configNew;
}

function handleTransform(configNew, ctx) {
  let transform = undefined;
  if (configNew.sys?.transform) {
    transform = configNew.sys?.transform;
  } else {
    transform = configNew["~transform"];
  }

  if (transform && typeof transform == "function") {
    return transform(configNew);
  } else {
    return configNew;
  }
}
//Return true if there is a instanceKey already
function applyInstanceKey(configNew) {
  //
  //if there is no instanceKey,add a unique one
  let key = configNew.sys?.instanceKey;
  if (!key) {
    //Create a unique one if there is no instance key

    //
    key = getUniqueID();
    if (configNew.sys == undefined) {
      configNew.sys = {};
    }
    configNew.sys.instanceKey = key;
  }
}

//Generate a unique string as component key
function getUniqueID() {
  let time = Date.now().toString(36);
  let random = Math.random().toString(36);
  random = random.substring(2, random.length);
  return random + time;
}
