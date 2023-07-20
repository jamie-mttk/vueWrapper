<script setup lang="ts">
import {
    onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onBeforeUnmount, onErrorCaptured, onActivated,
    onDeactivated,unref,
} from 'vue'
import SlotHolder from './SlotHolder.vue'
import { useCompBase } from './compBase.js'
//Define component name with unplugin-vue-define-options
defineOptions({
    name: "CompWrap"
});
//
//
const props = defineProps({
    config: {
        type: Object,
        required: true,
        default() {
            return {}
        }
    },
    //Only used internally to transfer slotPara among components tree
    slotParaStack: {
        type: Array,
        required: false,
        default() {
            return []
        }
    },
})

//v-model event
const emit = defineEmits(['update:modelValue'])
//
const {
    modelValue,
    modelValueName,
    parsedBaseComponent,
    configIf,
    configShow,
    configProps,
    configSlots,
    configSlotsInherit,
    configStyles,
    configClasses,
    configLifecycle,
    eventHandlers,
    setComponentInstance,
    context,
    getRef,

} = useCompBase(props, emit)

//lifecycle
function invokeLifecycle(type: string) {
    const handler = configLifecycle.value[type]
    if (handler && typeof handler == 'function') {
        handler(context)
    }
}

onMounted(() => invokeLifecycle('onMounted'))
onUpdated(() => invokeLifecycle('onUpdated'))
onUnmounted(() => invokeLifecycle('onUnmounted'))
onBeforeMount(() => invokeLifecycle('onBeforeMount'))
onBeforeUpdate(() => invokeLifecycle('onBeforeUpdate'))
onBeforeUnmount(() => invokeLifecycle('onBeforeUnmount'))
onActivated(() => invokeLifecycle('onActivated'))
onDeactivated(() => invokeLifecycle('onDeactivated'))
onErrorCaptured((err, instance, info) => {
    const handler = configLifecycle.value.onErrorCaptured
    if (typeof handler == 'function') {
        handler(err, instance, info)
    }
})
//The methods to expose 
defineExpose({
    getRef
})
</script>
<template>

    <component :ref="setComponentInstance" :is="parsedBaseComponent" v-show="configShow"  v-if="configIf"
        v-model:[modelValueName]="modelValue" v-bind="configProps" v-on="eventHandlers" :style="configStyles"
        :class="configClasses" :slotParaStack="slotParaStack">
        <!--Template of NOT-Inherit,use SlotHolder to process-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlots">
            <SlotHolder :slotValue="sp" :slotDefine="v"   :context="context"></SlotHolder>
        </template>
        <!--Template of -Inherit-->
        <template #[k]="sp" :key="k" v-for="(v, k)  in  configSlotsInherit">
            <slot :name="unref(v) ? unref(v) : k" v-bind="sp" :slotDefine="v" :context="context"></slot>
        </template>
    </component>
</template>  
