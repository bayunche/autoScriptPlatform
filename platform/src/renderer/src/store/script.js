import { defineStore } from 'pinia'
import { persist } from '.'
import dayjs from 'dayjs'
const useScriptStore = defineStore({
  id: 'script',
  persist: persist,
  state: () => ({
    script: {
      scriptName: '',
      //   scriptContent: '',
      scriptStatus: '',
      startTime: null,
      endTime: null,
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
      //判断script的scriptName是否在scripts中存在，如果存在则更新，如果不存在则添加
      scripts.forEach((script) => {
        const index = this.scripts.findIndex((s) => s.scriptName === script.scriptName)
        if (index !== -1) {
          this.scripts.splice(index, 1, script)
        } else {
          this.scripts.push(script)
        }
      })
      console.log(this.scripts)
    },
    // 获取脚本运行状态)(true,false)
    getScriptStatus(scriptName) {
      return this.runningScripts.includes(scriptName)
    },
    updateScriptDirectory(scriptPath) {
      this.scriptDirectory = scriptPath
    },
    runScript(scriptName) {
      this.runningScripts.push(this.script)
      this.script = {
        ...this.script,
        scriptStatus: true,
        startTime: dayjs(),
        endTime: null
      }
      //将scripts中的脚本状态修改为运行中
      this.scripts = this.scripts.map((script) => {
        if (script.scriptName === scriptName) {
          return {
            ...script,
            scriptStatus: true
          }
        }
        return script
      })
    },
    scriptEnd(scriptName) {
      //从运行列表中删除
      this.runningScripts = this.runningScripts.filter((script) => script.scriptName !== scriptName)
      this.script = {
        ...this.script,
        scriptStatus: false,

        endTime: dayjs()
      }
      this.scripts.push(this.script)
    }
  }
})
export { useScriptStore }
