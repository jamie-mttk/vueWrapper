
<script setup lang="ts">
import { ref, computed, useSlots, onBeforeUpdate } from 'vue'

import SlotHolder from './SlotHolder.vue'
import { getByPath, setByPath, parsePathFirstItem } from './pathUtil.ts'

import { useCompBase } from './compBase.js'
import CompWrap from "./CompWrap.vue";

defineOptions({
    name: "CompWrap"
});



interface propsType {
    modelValue?: any,  //说明可以接受任意类型
    config?: any
    slotPara: any,//仅仅针对在slot时传值
}
//定义属性
const props = defineProps<propsType>()
//v-model的事件
const emit = defineEmits(['update:modelValue'])

const {
    modelValue,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    eventHandlers,
    componentWrapRef,
    callMethod,
    //		getNestedConfig,
    // getChildProps,
    // getChildSlots,
    // getChildStyles,
    // getChildClasses,
} = useCompBase(props, emit)

// //Get vue ref by path.Return the main wrapped object is path is empty(undefined,null,empty string)
// function getRef(path:string){
//     let {first,remainder}=parsePathFirstItem(path)

//     if (!first){
//        //没有第一部分?那么返回当前主要组件
//         return componentWrapRef
//     }
//     //从childrenRef中获取,获取不到返回undefined
//     let childRef=childrenRef.value[first]
//     if(!childRef || childRef.getRef||typeof childRef.getRef!='function'){
//         return undefined
//     }else{
//         return childRef.getRef(remainder)
//     }
// }

// const childrenRef=ref({})
// onBeforeUpdate(() => {
//     childrenRef.value = {}
// })
//
defineExpose({
    // getRef,
    callMethod
})

// //TEST
// function test1(v){

//     console.log(JSON.stringify(v))

// }
</script>
<template>
    <component :is="props.config?.sys?.component" v-model="modelValue" ref="componentWrapRef" v-bind="configProps"
        v-on="eventHandlers" :style="configStyles" :class="configClasses" >
        <!--Template of NOT-Inherit-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlots">
            <SlotHolder :slotDefine="v" :modelValue="modelValue" :slotValue="sp">
            </SlotHolder>
        </template>
    
        <!--Template of -Inherit-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlotsInherit">
            <slot :name="v.value ? v.value : k" v-bind="sp"></slot>
        </template>
        <!--Children -- REMMOVED!-->
        <!--If the children is empty, DO NOT run the v-for, otherwise it will cause some unexpected  exception
        <template v-if="props?.config?.children && props?.config?.children.length > 0">
            <CompWrap v-for="child in props?.config?.children || []" :config="child"> </CompWrap>
        </template>
        -->
    </component>
</template>  
  
  
<style lang="scss">

</style>