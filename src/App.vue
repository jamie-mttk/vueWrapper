<script setup lang="ts">
import {computed} from 'vue'
import {  RouterView,useRouter, useRoute } from 'vue-router'


//
//得到所有的路由列表
const routerList = computed(() => {
  const router = useRouter()
  return router.getRoutes()
})
</script>

<template>
   <el-container>
    <el-header style="padding:0px;">
      <el-menu router mode="horizontal" style="width:100%;background-color:#E0E0E0;">
        <el-menu-item :index="router.path"  v-for="router in routerList">{{ router.name }}</el-menu-item>
      </el-menu>

    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
 
</template>


<style scoped>

</style>
