<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="脚本详情"></PageHeader>

    <div class="flex flex-row justify-between items-center">
      <el-tag>当前脚本:{{ data.scriptName }}</el-tag>
      <el-button
        type="primary"
        plain
        @click="
          () => {
            this.$router.push('/scriptList')
          }
        "
        >返回</el-button
      >
    </div>
    <el-divider></el-divider>
    <div class="flex flex-row justify-between items-center">
      <el-button
        type="primary"
        @click="handleRunScript"
        :loading="onRunning"
        plain
        :disabled="running"
        >运行</el-button
      >
      <el-button
        type="primary"
        @click="handleStopScript"
        :loading="onStoping"
        plain
        :disabled="!running"
        >停止</el-button
      >
      <el-button type="primary" plain>日志</el-button>
      <el-button type="primary" @click="handleSaveScript" plain>保存</el-button>
    </div>
    <el-divider></el-divider>
    <div class="flex flex-row items-center h-full">
      <JsEditor v-model="data.scriptContent" :language="'javascript'" :theme="'vs-dark'"></JsEditor>
    </div>
  </div>
</template>

<script setup>
import { useScriptStore } from '../store'
import { useRouter } from 'vue-router'
const router = useRouter()
const scriptStore = useScriptStore()
const data = scriptStore.script
const running = ref(data.scriptStatus)
const onStoping = ref(false)
const onRunning = ref(false)
const onSaving = ref(false)
// 读取js脚本内容
const getScriptContent = async () => {
  if (data.scriptPath == '') return
  const scriptContent = await window.electron.ipcRenderer.invoke('read-file', data.scriptPath)
  data.scriptContent = scriptContent
}
getScriptContent()

const handleRunScript = async () => {
  onRunning.value = true
  running.value = true
  scriptStore.runScript(data.scriptName)
  //调用主线程运行脚本
  await window.electron.ipcRenderer.invoke('run-script', data.scriptPath)
  //   渲染线程监听运行状态
  onRunning.value = false
  scriptStore.runScript(data.scriptName)
  await window.electron.ipcRenderer.on('script-exit', (event, message) => {
    data.scriptStatus = false
    running.value = false
    console.log('脚本运行结束')
    onRunning.value = false
    scriptStore.scriptEnd(data.scriptName)
  })
}

const handleStopScript = async () => {
  onStoping.value = true
  await window.electron.ipcRenderer.invoke('stop-script')
  scriptStore.scriptEnd(data.scriptName)
  onStoping.value = false
}
const handleSaveScript = async () => {
  onSaving.value = true
  const saveStatus = await window.electron.ipcRenderer.invoke(
    'save-script',
    data.scriptPath,
    data.scriptContent
  )
  if (saveStatus) {
    onSaving.value = false
  }
  console.log(saveStatus)
}
</script>
