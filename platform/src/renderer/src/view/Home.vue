<script setup>
import { storeToRefs } from 'pinia'
import { useScriptStore } from '../store'

const scriptStore = useScriptStore()

const { scriptList, runningScripts } = storeToRefs(scriptStore)
const stopedScripts = []

if (!scriptList == []) {
  stopedScripts = scriptList.filter((i) => !runningScripts.includes(i))
}
</script>

<template>
  <div class="h-full p-5 flex flex-col">
    <PageHeader header="首页"></PageHeader>
    <div>
      <Title title="运行中脚本"></Title>
      <!-- 缺省展示 -->
      <div class="flex items-center justify-center w-full" v-if="!runningScripts.length">
        <el-empty description="暂无数据" :image-size="100"></el-empty>
      </div>
      <el-space wrap>
        <el-card v-for="i in scriptList" :key="i" class="max-w-[240px] max-h-[200px] text-black">
          <template #header>
            <div class="card-header">
              <span>Card name</span>
            </div>
          </template>
          <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
          <template #footer>Footer content</template>
        </el-card>
      </el-space>
    </div>
    <div class="mt-5">
      <Title title="已停止脚本"></Title>
      <!-- 缺省展示 -->
      <div class="flex items-center justify-center w-full" v-if="!stopedScripts.length">
        <el-empty description="暂无数据" :image-size="100"></el-empty>
      </div>
      <el-space wrap>
        <el-card
          v-for="i in stopedScripts"
          :key="i"
          class="box-card max-w-[240px] max-h-[200px] text-black"
        >
          <template #header>
            <div class="card-header">
              <span>Card name</span>
              <el-button class="button" text>Operation button</el-button>
            </div>
          </template>
          <div v-for="o in 4" :key="o" class="text item">
            {{ 'List item ' + o }}
          </div>
        </el-card>
      </el-space>
    </div>
  </div>
</template>
