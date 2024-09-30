<script setup>
import dayjs from '../utils/timeFormat'
import { storeToRefs } from 'pinia'
import { useScriptStore } from '../store'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'vue-router'
const router = useRouter()
const scriptStore = useScriptStore()

const { runningScripts } = storeToRefs(scriptStore)
const scripts = scriptStore.scripts
let stopedScripts = []

if (!scripts.length == 0) {
  stopedScripts = scripts.filter((i) => i.status == false)
}
console.log(scripts)
const handleView = (i) => {
  const scriptData = {
    scriptName: i.name,
    scriptPath: i.path,
    scriptStatus: i.status
  }
  scriptStore.addScript(scriptData)
  router.push('/scriptView')
}
</script>

<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="首页"></PageHeader>
    <div>
      <Title title="运行中脚本"></Title>
      <!-- 缺省展示 -->
      <div class="flex items-center justify-center w-full" v-if="!runningScripts.length">
        <el-empty description="暂无数据"></el-empty>
      </div>
      <el-space wrap>
        <el-card
          v-for="i in runningScripts"
          :key="i"
          shadow="hover"
          class="w-[240px] max-h-[200px] text-black"
          style="cursor: pointer"
        >
          <h6>脚本名称：{{ i.name }}</h6>
          <h6>运行状态：<el-tag type="success">运行中</el-tag></h6>
          <h6>运行持续时间：{{ i.startTime ? dayjs(i.startTime).fromNow(true) : '暂无' }}</h6>
        </el-card>
      </el-space>
    </div>
    <div class="mt-5">
      <Title title="已停止脚本"></Title>
      <!-- 缺省展示 -->
      <div class="flex items-center justify-center w-full" v-if="!stopedScripts.length">
        <el-empty description="暂无数据"></el-empty>
      </div>
      <el-space wrap>
        <el-card
          v-for="i in stopedScripts"
          :key="i"
          shadow="hover"
          class="box-card max-w-[270px] max-h-[250px] text-black"
          body-style="cursor: pointer;"
          @click="handleView(i)"
        >
          <h6>脚本名称：{{ i.name }}</h6>
          <h6>运行状态：<el-tag type="danger">已停止</el-tag></h6>
          <h6>
            停止时间：{{ i.endTime ? dayjs(i.endTime).format('YYYY-MM-DD HH:mm:ss') : '暂无' }}
          </h6>
        </el-card>
      </el-space>
    </div>
  </div>
</template>
