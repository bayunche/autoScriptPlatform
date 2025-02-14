import { defineStore } from 'pinia'
import { persist } from '.'
const useConfigStore = defineStore('config', {
  persist: persist,
  state: () => ({
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
    ]
  }),
  actions: {}
})
export { useConfigStore }
