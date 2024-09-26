//使用ipc调用主进程的runScript方法
import { ipcRenderer } from 'electron'
//传入值为脚本本地路径
export function runScript(scriptPath) {
    const data = {
        message:"",
        error:""
    }
  ipcRenderer.send('runScript', scriptPath)
  // 监听脚本输出
  ipcRenderer.on('script-output', (event, msg) => {
   data.message  = msg // 保存脚本输出到数据
  })

  // 监听脚本错误
  ipcRenderer.on('script-error', (event, err) => {
    data.error= err // 保存错误信息到数据
  })
}
