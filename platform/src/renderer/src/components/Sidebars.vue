<script setup></script>

<template>
  <!-- 侧边栏组件 -->
  <el-aside class="sticky mt-5 rounded-lg border-1 bg-white shadow ml-5 sidebar mb-5" width="200px">
    <el-scrollbar>
      <div>
        <el-menu default-active="/" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/scriptList">脚本列表</el-menu-item>
          <el-menu-item index="/log">日志</el-menu-item>
          <el-menu-item index="/settings">设置</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </div>
    </el-scrollbar>
  </el-aside>
</template>
