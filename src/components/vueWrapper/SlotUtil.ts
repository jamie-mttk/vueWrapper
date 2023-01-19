//Qualify the slot configuration
  //Refer to the proper documentation to understand the slot configuration
  export function parseSlot(c: any) {
    if (!c || !c.slots) {
      return {};
    }
   
    //
    let result = {} as { [key: string]: Array<Object> };
    for (let key of Object.keys(c.slots)) {
      let slotDefine = c.slots[key];
      if (!slotDefine) {
        continue;
      }
      let parsed = parseSlotSingle(slotDefine);
      //
      result[key] =Array.isArray(parsed)?parsed: [parsed];    
    }
    
    //
    return result;
  }
  //parse slot configuration define
  //if slotDefine is any array, an array is returned;otherwise a JSON/Object is returned
  function parseSlotSingle(slotDefine: any) {
    //
    if (Array.isArray(slotDefine)) {
      //
      let result = [];
      //
      for (let d of slotDefine) {
        let r = parseSlotSingle(d);
        if (Array.isArray(r)) {
          result = [...result, ...r];
        } else {
          result.push(r);
        }
      }
      //
      return result;
    }

    //
    if (typeof slotDefine === "string") {
      return { type: "text", value: slotDefine };
    } else if (typeof slotDefine === "function") {
      return { type: "function", value: slotDefine };
    } else if (typeof slotDefine === "object") {
      //check whether there are type field.
      if (slotDefine.hasOwnProperty('type')){
        return slotDefine;
      }
      //If there is no type property, consider it is ignored,add default value wrap
      return {type:'wrap',value:slotDefine}
      
    } else {
      throw "Unsupported slotDefine type:" + typeof slotDefine;
    }
  }