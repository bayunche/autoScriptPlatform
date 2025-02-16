import { defineStore } from 'pinia'
import { persist } from '.'
const useConfigStore = defineStore('config', {
  persist: persist,
  state: () => ({
    data: {
      apiKey: 'http://localhost:11434/v1/',
      apiUrl: 'http://localhost:11434/v1/',
      usingModel: '',
      ableModel: [
        {
          modelName: 'Tifa-Deepsex-14b-CoT-Q8',
          modelDescription: 'Tifa-Deepsex-14b-CoT-Q8',
          modelStatus: true
        },
        {
          modelName: 'DeepSeek-R1-Distill-Qwen-14B-abliterated-v2',
          modelDescription: 'DeepSeek-R1-Distill-Qwen-14B-abliterated-v2',
          modelStatus: false
        }
      ],
      temperature: 0.4,
      top_p: 0.6,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 4096,
      stop: ['Human:', 'AI:']
    },
    // 远程调用api配置（以deepseek）
    remoteApiConfig: {
      apiKey: '',
      apiUrl: '',
      model: '',
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 4096,
      stop: ['Human:', 'AI:']
    }
  }),
  actions: {
    setLocalData(data) {
      this.data = data
    },
    setRemoteData(data) {
      this.remoteApiConfig = data
    },
    getData() {
      return this.data
    },
    getRemoteData() {
      return this.remoteApiConfig
    },
    setLocalModelList(modelList) {
      this.data.ableModel = modelList
    },
    setLocalUsingModel(modelName) {
      this.data.usingModel = modelName
    },
    setRemoteModelList(modelList) {
      this.remoteApiConfig.ableModel = modelList
    },
    setRemoteUsingModel(modelName) {
      this.remoteApiConfig.usingModel = modelName
    }
  }
})
export { useConfigStore }
