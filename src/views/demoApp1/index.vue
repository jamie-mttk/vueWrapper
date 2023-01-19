<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
//Reuse the form and table defined
import { configFormSimple } from '@/views/form/data2.ts'

import { configTableSimple } from '@/views/table/data2.ts'

import CompWrap from "@/components/vueWrapper/CompWrap.vue";

import useApp1Transtator from './app1Transtator.ts'
//This is the cofniguration to define a demo page
let configPage = reactive({
	criteriaConfig: configFormSimple,
	tableConfig: configTableSimple,
	retrieveMethod: retrieveDataDemo,//Demo to retrive data from server,in a real project it can be a URL
})
//Use to show code
let configText = JSON.stringify(configPage, null, 2)

//Translate to standard cofniguration
let { configTranslated, criteriaValue, tableValue } = useApp1Transtator(configPage)
//Here set the default criteria 
criteriaValue.name = 'Hello'
criteriaValue.address = 'World'


//Get a random int
function randomInt(max) {
	return Math.floor((Math.random() * max) + 1);
}
//
function retrieveDataDemo(criteria) {
	// alert('This is the criteria you input:' + JSON.stringify(criteria))
	let result = [];
	//generate demo data
	for (let i = 0; i < 10; i++) {
		let r = {}
		let day = randomInt(31);
		r.date = '2023-01-' + (day < 10 ? '0' + day : day);
		//r.name=criteria.name||'Who'+'-'+randomInt(100);
		r.name = (criteria.name || 'Who') + '-' + randomInt(100);
		r.address = (criteria.address || 'Where') + '-' + randomInt(1000);
		result.push(r)
	}
	//

	//
	return result

}
//
let activeTab = ref('demo')

</script>

<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="Demo" name="demo">
				<CompWrap ref="pageRef" :config="configTranslated"></CompWrap>
			</el-tab-pane>
			<el-tab-pane label="Introduction" name="intro">
				<h3>In a real project,normally 80% pages are similiar or they could be summarized into several templates. 
				So we could define the  variable into a config file, and then render the page according to the configuration.<br>
				Use Single-File Component absolutely can fullfil the requirement, but you need to define a SFC component for each component.
				This project can meet this requirement with a common way and all the code are pure JS code.<br>
				This demo is a typical page:there is a form to collect criteria information, and then retrieve data from server to display in the table.<br>
				Below are the content in config file: <br>
				<b>FORM config</b> The form fields and the field component type<br>
				<b>Method to retrieve data</b> In this demo random data is generate. In a real project it can be URL and then use axios/fetch to call server API.<br>
				<b>Table config</b> Table columns<br>
				Anyway it is a simple demo, you coudl add more functionalities in  real project.
				</h3>
			</el-tab-pane>
			<el-tab-pane label="config" name="config">
				<h3>This is the config to render the page</h3>
				<codemirror v-model="configText" :style="{ height: '640px' }" :autofocus="true" :indent-with-tab="true"
					:tabSize="2" :extensions="[javascript(), oneDark]" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style>
.testClass1 {
	margin: 32px !important;
}

.testClass2 {
	margin: 16px !important;
	border: 3px dotted yellow;
}
</style>