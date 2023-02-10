import { ref, isRef, isReactive, reactive, toRaw } from "vue";

//Conver to standard format if the config is flat format
//Add missing fields: so far only instanceKey is added
export function standardizedConfig(config) {
  let configNew = convertFlatConfig(config);
  //
  //if there is no instanceKey,add a unique one
  let key = isRef(configNew)
    ? configNew.value.sys?.instanceKey
    : configNew.sys?.instanceKey;
  if (key) {
    //alreay has a key,return directly since it is not necessary to create one for the config
    return configNew;
  }
  //
  key = getUniqueID();
  //
  if (isRef(configNew)) {
    configNew.value.sys.instanceKey = key;
  } else {
    configNew.sys.instanceKey = key;
  }
  //
  return configNew;
}

//**********************************************************
//* Below are private functions
//**********************************************************



//Convert flat config to standard format if it is flat format;otherwise return directly
function convertFlatConfig(config) {
  //please note, toRaw can NOT process ref
  let configRaw = isRef(config) ? config.value : toRaw(config);
  if (!configRaw["~component"]) {
    //Considier it is standard config, do not conver
    return config;
  }
  //
  let configNew = convertFlatInternal(configRaw);

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
      //consider # as default slot
      configNew.slots["#" == k ? "default" : k.substring(1)] = config[k];
    } else if (k.startsWith("@")) {
      //event
      configNew.events[k.substring(1)] = config[k];
    } else {
      //props - no special prefix
      configNew.props[k] = config[k];
    }
  }
  //
  return configNew;
}

//Generate a unique string as component key
function getUniqueID() {
  let time = Date.now().toString(36);
  let random = Math.random().toString(36);
  random = random.substring(2, random.length);
  return random + time;
}
