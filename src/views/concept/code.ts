export const codeConfig=[
    {key:'index.vue',caption:'index.vue',content:`<script setup lang="ts">

    import { valueInput, configInput1, configInput2} from './data.ts'
    import {codeConfig} from './code.ts'
    import  CodeView from '@/components/CodeView/index.vue'
    import CompWrap from "@/components/vueWrapper/CompWrap.vue";
    </script>
    
    <template>
      <div>
        <h4>This is a simple sample. The below input is rendered with traditional mode.<br>
          Simplely to say, the el-input is configured with multiple props.
        </h4>
        <el-input v-model="valueInput" placeholder="Please input value" :clearable="true"></el-input>
        <el-divider></el-divider>
        <h4>Here the input is configured with a JS with same funcionalities as above.</h4>
        <CompWrap :config="configInput1"></CompWrap>
        <el-divider></el-divider>
        <h4>It is also configured with JS to demostrate props,slots,events.</h4>
        <CompWrap :config="configInput2">
          <template #mysuffix>Suffix to demostrate inherit</template>
        </CompWrap>
        <el-divider></el-divider>
        <CodeView :config="codeConfig"></CodeView>
      </div>
    </template>
    <style>
    
    </style>`},
    {key:'data.ts',caption:'data.ts',content:`import { ref, reactive } from "vue";



    //The value of the input which are share in this sample
    export const valueInput = ref("InitValue");
    
    
    //input配置
    export const configInput1 = reactive({
      sys: {
        //
        component: "ElInput",
        modelValue: valueInput,
      },
      props: {
        placeholder: "Please input value",
        clearable: true,
    
      },
      slots: {},
      events: {},
    });
    //
    //Input size to demostrate that the config properties can be changed dynamically
    const inputSize = ref("default");
    //input配置
    export const configInput2 = reactive({
      sys: {
        //
        component: "ElInput",
        modelValue: valueInput,
      },
      props: {
        placeholder: "Please input value complex sample",
        clearable: true,
        prefixIcon: "Calendar",
        disabled: false,
        size: inputSize,
      },
      slots: {
        //Here to demostrate different way to set slots
        prepend: { type: 'function', value: samplePrepend },
        //The value is a array
        append: [{ type: "html", value: "w<b>or</b>ld" },sampleAppend],
        //If both inherit and something else is configured, what will happen?
        //If the inherit is implemented at parent component ,the inherit will take place;otherwise the inherit is ignored
        suffix: [{ type: "inherit", value: "mysuffix" },'Pure text']
      },
      events: {
        //Once get focus enlarge the component and restore once lose focus
        blur: { type: "function", value: inputBlur },
        focus: { type: "function", value: inputFocused },
      },
    });
    //
    function samplePrepend(){
      return 'Sample <b>prepend</b>'
    }
    function sampleAppend(){
      return '@Sample <b>append</b>'
    }
    
    function inputFocused() {
      inputSize.value = "large";
    }
    function inputBlur() {
      inputSize.value = "default";
    }
    `},
  ]