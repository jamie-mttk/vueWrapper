<script setup lang="ts">

import { valueInput, configInput1, configInput2} from './data.ts'
import {codeConfig} from './code.ts'
import  CodeView from '@/components/CodeView/index.vue'
import CompWrap from "@/components/vueWrapper/CompWrap.vue";
</script>

<template>
	<div>
		<h3>This is a simple sample. The below input is rendered with traditional mode.<br>
			Simplely to say, the el-input is configured with multiple props.
		</h3>
		<el-input v-model="valueInput" placeholder="Please input value" :clearable="true"></el-input>
		<el-divider></el-divider>
		<h3>Here the input is configured with a JS with same funcionalities as above.<br>
		And setting modelValue with computed is also demotrated.</h3>
		<CompWrap :config="configInput1"></CompWrap>
		<el-divider></el-divider>
		<h3>It is also configured with JS to demostrate props,slots,events.</h3>
		<CompWrap :config="configInput2">
			<template #mysuffix>Suffix to demostrate inherit</template>
		</CompWrap>
		<el-divider></el-divider>
		<CodeView :config="codeConfig"></CodeView>
	</div>
</template>
<style>

</style>