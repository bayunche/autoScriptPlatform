import { contextBridge, clipboard } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    // 暴露安全的 API 到渲染进程
    contextBridge.exposeInMainWorld('electronAPI', {
      copyToClipboard: (text) => {
        console.log('has been copied', text)
        clipboard.writeText(text)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
