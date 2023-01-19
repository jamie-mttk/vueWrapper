<script setup lang="ts">
import { ref, } from 'vue'
import { tableValue, tableConfig1 } from './data1.ts'

import { useMyTable } from './tableTranlator.ts'
import {configTableSimple} from './data2.ts'
import CompWrap from "@/components/vueWrapper/CompWrap.vue";

import {codeConfig} from './code.ts'
import  CodeView from '@/components/CodeView/index.vue'
//

const tableConfig2 = useMyTable(tableValue, configTableSimple)
//
function clearData(){
	tableValue.value=[]
}
//
const mainRef1=ref(null)
//
function clearSelection(){
	mainRef1.value.callMethod('clearSelection')
}
</script>

<template>
	<div style="margin:10px;">

		<h3>Table can be considered as a container: One el-table with multiple el-table-column.</h3>
		{{ tableValue }}<br>
		<el-button type="danger" @click="clearData">Clear data to see the content of empty slot</el-button>
		<h3>Here a simple sample to call method to clear selection. A more complex method call solution is under development.</h3>
		<el-button type="primary" @click="clearSelection">Clear selection</el-button><br><br>
		<CompWrap ref="mainRef1" :config="tableConfig1"></CompWrap>
		<el-divider></el-divider>
		<h3>If look into the configuration, it is powerful and flexible,but it look quite complex.<br />
		We could simplify the table configuration with customized configuration format ,
		and then write a piece of code to translate to the standard format as the config in the above sample.<br>
		How to simplfy the config depends on the requrirement, here is just a sample, you can define your own config file and translate code.<br>
		Normally in a real project multiple config can be defined for different use cases.<br>
		</h3>
		
		<el-divider></el-divider>
		<CompWrap ref="mainRef2" :config="tableConfig2"></CompWrap>
		<el-divider></el-divider>
		<CodeView :config="codeConfig"></CodeView>
	</div>
</template>
<style>

</style>