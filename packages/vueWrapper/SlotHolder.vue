<script setup lang="ts">

import { computed, isRef } from 'vue'
import CompWrap from './CompWrap.vue'
defineOptions({
    name: "SlotHolder"
});

//context is the context to obtain props/emit or call method
const props = defineProps(['context','slotDefine', 'slotValue', 'modelValue'])

//Slot parameter used for component/function/wrap
const slotPara = computed(() => {
    let result = {} as {
        [key: string]: any
    }
    result['slotDefine'] = props.slotDefine
    result['modelValue'] = props.modelValue
    result['slotValue'] = props.slotValue
    return result
})
//If the wrapValue is a function ,the function is called with parameter slotPara and the return value is returned
//Otherwise the input value is returned directly
function wrapValue(value) {
    if (typeof value == "function") {
        return value(slotPara.value)
    } else {
        return value;
    }
}
//conver to array if it is not an array;otherwise return directly
function convertToArray(val) {
    if (isRef(val)) {
        val = val.value
    }
    //Get field value,it is not vue ref...
    val = val.value
    //
    if (Array.isArray(val)) {
        return val
    } else {
        return [val]
    }
}

</script>

<template>
    <!--Loop all the slot define except inherit since it is handled in CompWrap-->
    <template v-for="sd of slotDefine">
        <template v-if="sd.type == 'text'">
            <span v-for="v of convertToArray(sd)">{{ v }}</span>
        </template>
        <template v-if="sd.type == 'html'">
            <span v-for="v of convertToArray(sd)" v-html="v"></span>
        </template>
        <template v-if="sd.type == 'component'">
            <component v-for="v of convertToArray(sd)" :is="v" :slotPara="slotPara"></component>
        </template>
        <template v-if="sd.type == 'function'">
            <span v-for="v of convertToArray(sd)" v-html="v(props.context,slotPara)"></span>
        </template>
        <template v-if="sd.type == 'wrap'">
            <CompWrap v-for="v of convertToArray(sd)" :config="wrapValue(v)"></CompWrap>
        </template>
    </template>
</template>
