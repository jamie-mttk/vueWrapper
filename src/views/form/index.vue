<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, computed, isRef, isReactive, onBeforeUpdate } from 'vue'
import { formValue, formConfig1 } from './data1.ts'
import { configFormSimple } from './data2.ts'
import { useMyForm } from './formTranslator.ts'

import CompWrap from "@/components/vueWrapper/CompWrap.vue";

//以下演示如何简化FORM配置
const formConfig2 = useMyForm(formValue, configFormSimple)

</script>

<template>
	<div style="margin:10px;">

		<h3>This is a sample to configure form</h3>
		{{ formValue }}
		<CompWrap ref="mainRef1" :config="formConfig1"></CompWrap>
		<el-divider></el-divider>
		<h3>Same as the previous samples, here we define a simple form config format to simplify the configuration<br />
			In a real project, the useMyForm may have a third paramter to project specific specification.<br />
			Anyway only the possibility of simplify is demoed here,it is NOT a suggestion or specification.</h3>

		<CompWrap ref="mainRef2" :config="formConfig2"></CompWrap>
	</div>
</template>
<style>

</style>