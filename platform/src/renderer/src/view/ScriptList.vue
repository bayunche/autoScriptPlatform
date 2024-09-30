<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="脚本列表"></PageHeader>
    <!-- 选择脚本路径 -->
    <div class="flex flex-row justify-between items-center">
      <el-tag
        >当前文件夹地址:{{
          scriptStore.scriptDirectory == '' ? '未选择' : scriptStore.scriptDirectory
        }}</el-tag
      >
      <el-button type="primary" plain @click="openDialog">打开文件夹</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 脚本列表 -->
    <!-- 缺省展示 -->
    <div v-if="data.scriptList.length === 0" class="flex flex-col justify-center items-center">
      <el-empty description="暂无脚本"></el-empty>
    </div>
    <el-space size="default" wrap>
      <el-card
        @click="handleView(script)"
        shadow="hover"
        v-for="script in data.scriptList"
        :key="script"
        class="rounded-lg"
        body-style="max-width:220px; max-height:px;  overflow:hidden; border-radius:10px; cursor:pointer"
      >
        <div class="text-dark">
          <h6 class="font-bold" style="color: #8c98a4">脚本名称：{{ script.name }}</h6>
        </div>
        <div class="text-dark">
          <h6 class="font-bold">脚本路径：{{ script.path }}</h6>
        </div>
        <div>
          <span class="font-bold">脚本状态：</span>
          <el-tag :type="script.status === true ? 'success' : 'danger'">{{
            script.status == true ? '运行中' : '未运行'
          }}</el-tag>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useScriptStore } from '../store'
import { useRouter } from 'vue-router'
const scriptStore = useScriptStore()
const router = useRouter()
const data = reactive({
  scriptDirectory: '',
  scriptList: []
})

//传送open-directory-dialog事件获取脚本文件夹路径
const openDialog = () => {
  window.electron.ipcRenderer.invoke('open-directory-dialog').then(async (res) => {
    console.log(res)
    if (res == '') {
      return
    }
    data.scriptDirectory = res
    scriptStore.updateScriptDirectory(res)
    await getScriptList()
  })
}

//通过ipcRenderer向主进程发送消息，获取脚本列表
const getScriptList = async () => {
  if (scriptStore.scriptDirectory === '') return
  const scriptList = await window.electron.ipcRenderer.invoke(
    'get-script-list',
    scriptStore.scriptDirectory
  )

  scriptStore.updateScripts(scriptList)
  console.log(scriptList)
  await getScriptStatus(scriptList)
}
//获取脚本列表的脚本运行状态并添加至script数组中
const getScriptStatus = async (scriptList) => {
  if (scriptStore.scriptDirectory === '') return
  const scriptListWithStatus = scriptList.map((i) => {
    i.status = scriptStore.getScriptStatus(i.path)
    return i
  })
  data.scriptList = scriptListWithStatus
}
getScriptList()
const handleView = (script) => {
  const scriptData = {
    scriptName: script.name,
    scriptPath: script.path,
    scriptStatus: script.status
  }
  scriptStore.addScript(scriptData)
  router.push('/scriptView')
}
</script>

<script></script>
<style scoped></style>
