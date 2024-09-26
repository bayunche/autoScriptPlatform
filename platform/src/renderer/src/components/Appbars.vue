<script setup>
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { More } from '@element-plus/icons-vue'
import { getLocalStorage } from '../utils/dataStroge'
import { useUserStore } from '../store'
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const ipcHandle = () => window.electron.ipcRenderer.send('changeLanguage')
const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
  ipcHandle()
}
//获取用户缓存数据
const user = useUserStore()
let loginStatus = false
if (user.user.token) {
  console.log(user.user.token)
  loginStatus = true
}

// 注销
const logout = () => {
  window.electron.ipcRenderer.send('logout')
}
</script>

<template>
  <!-- header组件 -->
  <el-header class="sticky w-screen z-10">
    <div
      class="border-1 rounded-lg flex items-center bg-white flex-row shadow flex-end justify-end"
    >
      <!-- icon -->
      <div class="p-5 flex items-center">
        <h1 class="text-2xl font-bold">Platform</h1>
      </div>
      <div class="relative ml-auto lg:flex flex items-center">
        <!-- i18n切换按钮 -->
        <div class="flex items-center">
          <el-button mb-2 @click="toggle">切换语言</el-button>
        </div>
        <!-- 功能下拉菜单 -->
        <div class="flex items-center">
          <el-dropdown>
            <span class="el-dropdown-link mr-5 ml-5"
              ><el-icon><More /></el-icon
            ></span>
            <template v-if="loginStatus" #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  ><router-link :to="/addScript/">添加脚本</router-link></el-dropdown-item
                >
                <el-dropdown-item><router-link :to="/about/">关于</router-link></el-dropdown-item>
                <el-dropdown-item><router-link :to="/setting/">设置</router-link></el-dropdown-item>
                <el-dropdown-item
                  ><el-link :click="logout" :underline="false">退出登录</el-link></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
            <template v-else #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><router-link to="/about">关于</router-link></el-dropdown-item>
                <!-- <el-dropdown-item><router-link :to="/setting/">设置</router-link></el-dropdown-item> -->
                <el-dropdown-item><router-link to="/login">登录</router-link></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </el-header>
</template>
