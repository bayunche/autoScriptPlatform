
import { defineStore } from "pinia";

const useScriptStore = defineStore({
    id: "script",
    persist: true,
    state: () => ({
        script:{
            scriptName: "",
            scriptContent: "",
            scriptType: "",
            scriptId: "",
            scriptStatus: "",
            scriptVersion: "",
            scriptDescription: "",
            scriptAuthor: "",
        },
        scripts: [
        
        ],
        runningScripts:[],
        
        
    }),
    actions: {
        // 添加脚本
        addScript(script) {
            this.scripts.push(script);
        },
        // 删除脚本
        deleteScript(scriptId) {
            this.scripts = this.scripts.filter(script => script.scriptId !== scriptId);
        },
        // 更新脚本
        // updateScript(script) {
        //     const index = this.scripts.findIndex(s => s.scriptId === script.scriptId);
        //     if (index !== -1) {
        //         this.scripts.splice(index, 1, script);
        //     }
        // }
        // 获取脚本
        getScript(scriptId) {
            return this.scripts.find(script => script.scriptId === scriptId);
        } ,
        // 获取所有脚本
        getAllScripts() {
            return this.scripts;
        },
        // 更新脚本列表
        updateScripts(scripts) {
            this.scripts = scripts;
        },
        // 获取脚本运行状态)(true,false)
        getScriptStatus(scriptName) {

            return this.runningScripts.includes(scriptName);
        }
    }
})
export {useScriptStore}