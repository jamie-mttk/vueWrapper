<script setup lang="ts">

import { computed, isRef } from 'vue'
import CompWrap from './CompWrap.vue'
defineOptions({
    name: "SlotHolder"
});

//context is the context to obtain props/emit or call method
const props = defineProps(['context','slotDefine', 'slotValue'])

//Slot parameter used for component/function/wrap
const slotPara = computed(() => {
    let result = {} as {
        [key: string]: any
    }
    result['slotDefine'] = props.slotDefine
    result['context'] = props.context
    result['slotValue'] = props.slotValue
    return result
})
//slotPara of this component,first copy all the parent slotPara,then add this one
const slotParaStack = computed(() => {
    let result =[...props.context.slotParaStack||[]]
    result.push(slotPara.value)
    return result
})

//conver to array if it is not an array;otherwise return directly
function convertToArray(val) {
    if (isRef(val)) {
        val = val.value
    }
    //Get field value,it is not vue ref...
    val = val.value
    //
    if (typeof val == "function") {
        val= val(slotPara.value,slotParaStack)
    }
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
            <component v-for="v of convertToArray(sd)" :is="v" :slotParaStack="slotParaStack"></component>
        </template>
        <template v-if="sd.type == 'function'">
            <span v-for="v of convertToArray(sd)" v-html="v"></span>
        </template>
        <template v-if="sd.type == 'wrap'">
            <CompWrap v-for="v of convertToArray(sd)" :config="v" :slotParaStack="slotParaStack"></CompWrap>
        </template>
    </template>
</template>
