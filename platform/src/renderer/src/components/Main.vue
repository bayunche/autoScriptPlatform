<template>
  <el-main class="min-h-full">
    <el-scrollbar
      class="flex w-full min-h-full rounded-lg shadow bg-white"
      wrap-class="scrollbar-wrapper"
    >
      <!-- 滚动条包裹部分 -->
      <div class="flex w-full h-full"><RouterView class="flex grow w-full h-full" /></div>
    </el-scrollbar>
  </el-main>
</template>

<style lang="scss" scoped>
:deep(.scrollbar-wrapper) {
  display: flex;
  flex-grow: 1;
}
:deep(.el-scrollbar__view) {
  display: flex;
  flex: 1;
}
</style>
