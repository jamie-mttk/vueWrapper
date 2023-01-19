<template>
    <div>
        <el-link type="success" :underline="false" @click="toggleShowCode"
            style="margin:0px auto;width:100%;">{{ showCodeText }}</el-link>
        <div v-show="showCode">
            <el-tabs v-model="activeTab">
                <el-tab-pane v-for="item of config" :key="item.key" :label="item.caption" :name="item.key">
                    <codemirror v-model="item.content"  :style="{ height: '640px' }"
                        :autofocus="true" :indent-with-tab="true" :tabSize="2" :extensions="extensions" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

defineOptions({
    name: "CodeView"
});
//Define props
const props = defineProps({
    config: Array
})
//Active tab
const activeTab=ref(0)
//Set the tab open the first one
if(props.config?.length>0){
    activeTab.value=props.config[0].key
}
//Whether the code is shown
const showCode = ref(false)
//Toggle code show/hide
function toggleShowCode() {
    showCode.value = !showCode.value
}
//Content of show/hide code
const showCodeText = computed(() => {
    if (showCode.value) {
        return 'Hide code'
    } else {
        return 'Show code'
    }
});
//Configuration for code mirror
const extensions = [javascript(), oneDark];
</script>