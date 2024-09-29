import { defineStore } from 'pinia'
import { persist } from '.'

const useScriptStore = defineStore({
  id: 'script',
  persist: persist,
  state: () => ({
    script: {
      scriptName: '',
      //   scriptContent: '',
      scriptStatus: '',
      //   scriptVersion: '',
      //   scriptDescription: '',
      //   scriptAuthor: ''
      scriptPath: ''
    },
    scripts: [],
    runningScripts: [],
    scriptDirectory: ''
  }),
  actions: {
    // 添加脚本
    addScript(script) {
      this.script = script
    },
    // 删除脚本
    deleteScript(scriptId) {
      this.scripts = this.scripts.filter((script) => script.scriptId !== scriptId)
    },
    // 运行脚本
    runScript(scriptName) {
      this.runningScripts.push(scriptName)
    },
    // 更新脚本
    // updateScript(script) {
    //     const index = this.scripts.findIndex(s => s.scriptId === script.scriptId);
    //     if (index !== -1) {
    //         this.scripts.splice(index, 1, script);
    //     }
    // }
    // 获取脚本
    // getScript(scriptId) {
    //   return this.scripts.find((script) => script.scriptId === scriptId)
    // },
    // 获取所有脚本
    getAllScripts() {
      return this.scripts
    },
    // 更新脚本列表
    updateScripts(scripts) {
      scripts.forEach((script) => {
        const index = this.scripts.findIndex((s) => s.scriptId === script.scriptId)
        if (index !== -1) {
          this.scripts.splice(index, 1, script)
        } else {
          this.scripts.push(script)
        }
      })
    },
    // 获取脚本运行状态)(true,false)
    getScriptStatus(scriptName) {
      return this.runningScripts.includes(scriptName)
    },
    updateScriptDirectory(scriptPath) {
      this.scriptDirectory = scriptPath
    }
  }
})
export { useScriptStore }
