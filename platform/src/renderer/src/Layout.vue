<script setup>
import { RouterView } from 'vue-router'
import Appbars from './components/Appbars.vue'
import sidebars from './components/Sidebars.vue'
// import RouterView from 'vue-router'
</script>

<template>
  <div class="bg-slate-100 w-full h-full">
    <el-container>
      <Appbars />
    </el-container>
    <el-container id="main">
      <sidebars></sidebars>
      <el-container class="h-full">
        <el-main class="min-h-full">
          <el-scrollbar class="w-full min-h-full rounded-lg shadow" wrap-class="scrollbar-wrapper">
            <!-- 滚动条包裹部分 -->
            <RouterView class="flex grow w-full h-full bg-white rounded-md shadow" />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
#main {
  height: calc(100vh - 60px);
}
 


</style>
