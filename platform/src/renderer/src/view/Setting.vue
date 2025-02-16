<template>
  <div class="p-5 h-full flex flex-col ">
    <PageHeader header="设置"></PageHeader>
    <el-divider></el-divider>
  
    <div class="p-5 bg-white rounded-lg shadow">
        <Title title="本地大模型设置（当前仅支持兼容openai api的模型框架）"></Title>
        <div class="p-5 bg-white rounded-lg shadow">
      <el-form :model="data" label-width="120px">
        <el-form-item label="API Key">
          <el-input v-model="data.apiKey" @change="saveSettings"></el-input>
        </el-form-item>
        <el-form-item label="API URL">
          <el-input v-model="data.apiUrl" @change="saveSettings"></el-input>
        </el-form-item>
      </el-form>
    </div>
      <Title title="模型参数设置"></Title>
    <div class="p-5 bg-white rounded-lg shadow">
      <el-form :model="data" label-width="120px">
        <el-form-item label="模型">
          <el-input v-model="data.model" @change="saveSettings"></el-input>
        </el-form-item>
        <el-form-item label="温度">
          <el-input-number v-model="data.temperature" :min="0" :max="1" :step="0.1" @change="saveSettings"></el-input-number>
        </el-form-item>
        <el-form-item label="Top P">
          <el-input-number v-model="data.top_p" :min="0" :max="1" :step="0.1" @change="saveSettings"></el-input-number>
        </el-form-item>
        <el-form-item label="频率惩罚">
          <el-input-number v-model="data.frequency_penalty" :min="0" :max="1" :step="0.1" @change="saveSettings"></el-input-number>
        </el-form-item>
        <el-form-item label="存在惩罚">
          <el-input-number v-model="data.presence_penalty" :min="0" :max="1" :step="0.1" @change="saveSettings"></el-input-number>
        </el-form-item>
        <el-form-item label="最大令牌数">
          <el-input-number v-model="data.max_tokens" :min="1" :max="4096" :step="1" @change="saveSettings"></el-input-number>
        </el-form-item>
        <el-form-item label="停止标记">
          <el-input v-model="data.stop" @change="saveSettings"></el-input>
        </el-form-item>
      </el-form>
    </div>
    </div>

    <el-divider></el-divider>
    <div class="p-5 bg-white rounded-lg shadow ">
        <Title title="远程调用API设置（当前仅支持openai和deepseek）"></Title>
      <el-form :model="remoteData" label-width="120px">
        <el-form-item label="API Key">
          <el-input v-model="remoteData.apiKey" @change="saveRemoteSettings"></el-input>
        </el-form-item>
        <el-form-item label="API URL">
          <el-input v-model="remoteData.apiUrl" @change="saveRemoteSettings"></el-input>
        </el-form-item>
      </el-form>
    </div>
    
    <el-divider></el-divider>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useConfigStore } from '../store'
import Title from '../components/Title.vue'

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
const data = reactive({
  apiKey: '',
  apiUrl: '',
  model: '',
  temperature: 0.4,
  top_p: 0.6,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: 4096,
  stop: ['Human:', 'AI:']
})
const remoteData = reactive({
  apiKey: '',
  apiUrl: '',
  model: '',
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: 4096,
  stop: ['Human:', 'AI:']
})

const saveSettings = debounce(() => {
  // 自动添加 http 前缀和 /v1/ 后缀
  if (data.apiUrl && !data.apiUrl.startsWith('http')) {
    data.apiUrl = `http://${data.apiUrl}`
  }
  if (data.apiUrl && !data.apiUrl.endsWith('/v1/')) {
    data.apiUrl = `${data.apiUrl}/v1/`
  }

  // 保存设置到 pinia
  localStorage.setItem('settings', JSON.stringify(data))
  useConfigStore().setLocalData(data)
},2000)

// 监听 data 变化，自动保存
const saveRemoteSettings = debounce(() => {
  // 自动添加 http 前缀和 /v1/ 后缀
  if (remoteData.apiUrl && !remoteData.apiUrl.startsWith('http')) {
    remoteData.apiUrl = `http://${remoteData.apiUrl}`
  }
  if (remoteData.apiUrl && !remoteData.apiUrl.endsWith('/v1/')) {
    remoteData.apiUrl = `${remoteData.apiUrl}/v1/`
  }

  // 保存设置到 pinia
  useConfigStore().setRemoteData(remoteData)
},3000)
const getSettings = () => {
  const settings = useConfigStore().getData()
  if (settings) {
    Object.assign(data, settings)
  }
  const remoteSettings = useConfigStore().getRemoteData()
  if (remoteSettings) {
    Object.assign(remoteData, remoteSettings)
  }
}
getSettings()
watch(data, saveSettings, { deep: true })
watch(remoteData, saveRemoteSettings, { deep: true })
</script>
