<script setup>
// import Versions from './components/Versions.vue'

import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Layout from './Layout.vue'

</script>

<template>
  <div class="app">
    <el-config-provider :locale="zhCn">
      <Layout />
    </el-config-provider>
  </div>
</template>
