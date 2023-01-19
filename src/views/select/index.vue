<script setup lang="ts">

import { value, config1,config2,config3} from './data.ts'
import {useMySelect} from './selectTranslator.ts'
import {codeConfig} from './code.ts'
import  CodeView from '@/components/CodeView/index.vue'
import CompWrap from "@/components/vueWrapper/CompWrap.vue";
//
const config2Translated=useMySelect(config2)
const config3Translated=useMySelect(config3)
</script>

<template>
	<div>
		<h3>This sample try to show how to enhance the functionalities of the base component.<br>
			The el-select can set options by el-option in template.<br>
			Here we try to config options by JSON or by funciton. In real project can also config options by a String which is a URL to remottely load options.
		</h3>
		{{ value }}
		<h3>In this sample options are configured in slot directly</h3>
		<CompWrap :config="config1"></CompWrap>	
		<el-divider></el-divider>
		<h3>In this sample options are configured by JSON array</h3>
		<CompWrap :config="config2Translated"></CompWrap>	
		<el-divider></el-divider>
		<h3>In this sample options are configured by function</h3>
		<CompWrap :config="config3Translated"></CompWrap>	
		<el-divider></el-divider>
		<CodeView :config="codeConfig"></CodeView>
	</div>
</template>
<style>

</style>