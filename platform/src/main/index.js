import { app, shell, BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.svg'
import { dir } from 'console'
const fs = require('fs')
const path = require('path')
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  //启动新的子线程来运行本地js脚本（捕获脚本的log或者错误）
  // const { ipcMain } = require('electron')
  ipcMain.handle('run-script', (event, scriptPath) => {
    const { fork } = require('child_process')
    const child = fork(scriptPath)
    //将运行状态和log返回给渲染进程
    mainWindow.webContents.send('script-running', true)
    console.log('成功将运行状态返回给渲染进程')
    child.on('message', (message) => {
      mainWindow.webContents.send('script-log', message)
    })
    child.on('error', (error) => {
      mainWindow.webContents.send('script-error', error)
      console.error(error)
    })
    child.on('exit', (code) => {
      mainWindow.webContents.send('script-exit', false)
      console.log(`子进程退出，退出码 ${code}`)
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//监听渲染进程的事件，调用dialog获取文件夹信息
ipcMain.handle('open-directory-dialog', async (event) => {
  console.log('open-directory-dialog')
  const { dialog } = require('electron')
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.filePaths[0]
  } catch (error) {
    console.log(error)
  }
})

//监听渲染进程的事件,从渲染进程中获取到本地文件夹路径，遍历获取文件夹中的js文件名称(过滤node_modules、.git文件夹)
//组成文件名称,文件路径对象数组 ，返回给渲染进程

ipcMain.handle('get-script-list', async (event, dirPath) => {
  console.log('get-script-list')

  const getJSFiles = (dirPath) => {
    let jsFiles = []

    // 读取目录内容
    const files = fs.readdirSync(dirPath)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // 如果是目录，递归调用
        if (file !== 'node_modules' && file !== '.git') {
          if (file !== 'dist') {
            jsFiles = jsFiles.concat(getJSFiles(filePath))
          }
        }
      } else if (path.extname(file).toLowerCase() === '.js') {
        // 如果是 JS 文件，添加包含路径和名称的对象到结果数组
        jsFiles.push({
          path: filePath,
          name: file
        })
      }
    }

    return jsFiles
  }
  try {
    // const files = fs.readdirSync(dirPath)
    // 深度查找所有的js文件
    const scriptList = getJSFiles(dirPath)
    return scriptList
  } catch (error) {
    console.log(error)
  }
})
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    let fs = require('fs').promises // 确保使用 fs.promises
    const bufferContent = await fs.readFile(filePath, () => {}, { encoding: 'utf8' })
    const content = bufferContent.toString('utf-8')
    return content
  } catch (error) {
    console.error('Error reading file:', error)
    throw error // 处理错误
  }
})
//修改后的脚本内容保存到本地

ipcMain.handle('save-script', async (event, filePath, content) => {
  try {
    let fs = require('fs').promises // 确保使用 fs.promises
    await fs.writeFile(filePath, content, 'utf8')
    return true
  } catch (error) {
    console.error('Error writing file:', error)
    throw error // 处理错误 
  }
})