
<script setup lang="ts">
import SlotHolder from './SlotHolder.vue'
import { useCompBase } from './compBase.js'
//Define component name with unplugin-vue-define-options
defineOptions({
    name: "CompWrap"
});
//
const props = defineProps(["config"])
//v-model event
const emit = defineEmits(['update:modelValue'])
//
const {
    modelValue,
    modelValueName,
    parseBaseComponent,
    configShow,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    eventHandlers,
    setComponentInstance,
    context,
    getRef,

} = useCompBase(props, emit)

//Define the methods to expose 
defineExpose({
    getRef
})
</script>
<template>

    <component :ref="setComponentInstance" :is="parseBaseComponent" v-show="configShow" v-model:[modelValueName]="modelValue"  v-bind="configProps"
        v-on="eventHandlers" :style="configStyles" :class="configClasses" >
        <!--Template of NOT-Inherit,use SlotHolder to process-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlots">
            <SlotHolder :slotDefine="v" :modelValue="modelValue" :slotValue="sp" :context="context">
            </SlotHolder>
        </template>    
        <!--Template of -Inherit-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlotsInherit">
            <slot :name="v.value ? v.value : k" v-bind="sp"></slot>
        </template>
    </component>
</template>  
