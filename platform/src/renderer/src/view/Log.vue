<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="日志"></PageHeader>
    <div class="h-full flex flex-col">
      <div class="mb-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <el-switch
            v-model="autoRefresh"
            active-text="自动刷新"
            @change="handleAutoRefreshChange"
          />
          <span v-if="autoRefresh" class="text-sm text-gray-500">
            每 {{ refreshInterval }}s 刷新一次
          </span>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="getLogContent">刷新</el-button>
          <el-button type="danger" @click="clearLog">清空日志</el-button>
        </div>
      </div>
      <div class="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
        <pre v-if="data.logContent" class="whitespace-pre-wrap text-sm">{{ data.logContent }}</pre>
        <div v-else class="text-center text-gray-400 py-4">暂无日志内容</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useScriptStore } from '../store'
import { ElMessage } from 'element-plus'

const scriptStore = useScriptStore()
const data = reactive({
  logContent: '',
  ...scriptStore.script
})

const autoRefresh = ref(false)
const refreshInterval = ref(5)
let refreshTimer = null

const getLogContent = async () => {
  if (data.scriptPath) {
    try {
      const res = await window.electron.ipcRenderer.invoke('get-log-file', data.scriptPath)
      data.logContent = res
    } catch (error) {
      ElMessage.error('获取日志失败：' + error.message)
    }
  }
}

const clearLog = async () => {
  if (data.scriptPath) {
    try {
      await window.electron.ipcRenderer.invoke('clear-log-file', data.scriptPath)
      data.logContent = ''
      ElMessage.success('日志已清空')
    } catch (error) {
      ElMessage.error('清空日志失败：' + error.message)
    }
  }
}

const handleAutoRefreshChange = (value) => {
  if (value) {
    refreshTimer = setInterval(getLogContent, refreshInterval.value * 1000)
  } else {
    clearInterval(refreshTimer)
  }
}

onMounted(() => {
  getLogContent()
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.pre {
  font-family: Consolas, Monaco, 'Courier New', monospace;
}
</style>
