<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="日志"></PageHeader>
    <div class="h-full flex flex-col">
      <div><span></span></div>
    </div>
  </div>
</template>

<script setup>
import { useScriptStore } from '../store'

const scriptStore = useScriptStore()
const data = {
  logContent: '',
  ...scriptStore.script
}

const getLogContent = async () => {
  if (data.scriptPath) {
    const res = await window.electron.ipcRenderer.invoke('get-log-file', data.scriptPath)
    data.logContent = res
  }
}
onMounted(() => {
  getLogContent()
})
</script>
