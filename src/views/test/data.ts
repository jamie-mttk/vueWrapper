export const config=[
    {key:'vue',caption:'vue',content:`<script setup lang="ts">
    import { ref, reactive, defineAsyncComponent, computed, isRef, isReactive, onBeforeUpdate } from ”vue”
    import { valueInput, configInput } from ”./data1.ts”
    import { valueInput2, configInput2 } from ”./data2.ts”
    import { configButton3 } from ”./data3.ts”
    
    </script>
    
    <template>
        <div style="margin:24px;">
            <h4>这是一个简单例子,演示props,v-model,event,slot,method</h4>
            <el-input v-model="valueInput"></el-input>
            <el-divider></el-divider>
            <component :is="configInput.component" ref="mainRef" :config="configInput">
                <template #mysuffix>AABBCC</template>
            </component>
            <el-divider></el-divider>
    
        
            <h5>下面演示一个按钮事件调用的例子</h5>
            <component :is="configButton3.component" ref="mainRef3" :config="configButton3"></component>
        </div>
    </template>
    <style>
    
    </style>`},
    {key:'data1',caption:'data1.ts',content:`aa
    
    `},
  ]