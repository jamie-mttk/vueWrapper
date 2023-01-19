<script setup lang="ts">

import { layoutwConfig } from './data.ts'

import CompWrap from "@/components/vueWrapper/CompWrap.vue";



</script>

<template>
	<h3>Layout is another container component. This implementation is based on element plus el-row/el-col.</h3>
		<CompWrap ref="mainRef1" :config="layoutwConfig"></CompWrap>
</template>
<style>

</style>