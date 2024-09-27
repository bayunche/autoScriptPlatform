<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="脚本列表"></PageHeader>
    <!-- 选择脚本路径 -->
    <div class="flex flex-row justify-end items-center">
      <el-button type="primary" plain @click="openDialog">打开文件夹</el-button>
    </div>
    <el-divider></el-divider>
    <el-space size="default" wrap>
      <el-card shadow="hover" v-for="script in data.scriptList" :key="script" class="w-64">
        <div class="text-dark">脚本名称：{{ script.name }}</div>
        <div class="text-dark">脚本路径：{{ script.path }}</div>
        <div class="text-dark">
          脚本状态：
          <el-tag :type="script.status === true ? 'success' : 'danger'">{{
            script.status == true ? '运行中' : '未运行'
          }}</el-tag>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
import { useScriptStore } from '../store'
const scriptStore = useScriptStore()
const data = {
  scriptDirectory: '',
  scriptList: []
}
//传送open-directory-dialog事件获取脚本文件夹路径
const openDialog = () => {
  window.electron.ipcRenderer.invoke('open-directory-dialog').then(async (res) => {
    console.log(res)
    data.scriptDirectory = res
    await getScriptList()
  })
}

//通过ipcRenderer向主进程发送消息，获取脚本列表
const getScriptList = async () => {
  const scriptList = await window.electron.ipcRenderer.invoke(
    'get-script-list',
    data.scriptDirectory
  )

  data.scriptList = scriptList
  scriptStore.updateScripts(scriptList)
  console.log(data.scriptList)
  getScriptStatus(data.scriptList)
}
//获取脚本列表的脚本运行状态并添加至script数组中
const getScriptStatus = async (scriptList) => {
  const scriptListWithStatus = scriptList.map((i) => {
    i.status = scriptStore.getScriptStatus(i.path)
    return i
  })
  data.scriptList = scriptListWithStatus
}
</script>
