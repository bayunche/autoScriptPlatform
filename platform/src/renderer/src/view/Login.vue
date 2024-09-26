<script setup>
import { useUserStore } from '../store/index'
import { storeToRefs } from 'pinia'
const form = reactive({
  username: '',
  password: ''
})

const userStore = useUserStore()

const { rememberMe } = storeToRefs(userStore)

const onLoading=ref(false)
const forgetPassword = () => {
  console.log('forgetPassword')
  //调用pinia存储邮箱信息
  userStore.setForgetEmail(form.username)
  router.push('/forgetPassword')
}

const login = () => {
  if (rememberMe) {
    userStore.setRememberMe(rememberMe.value)
  }
  console.log('login')
  userStore.login(form)
}
</script>
<template>
  <div class="flex flex-col items-center h-full ">
    <div class="p-10 text-4xl text-slate-500 font-bold">Login</div>
    <el-form label-suffix="：" class="min-w-[250px]" :model="form" label-width="">
      <el-form-item label="邮箱">
        <el-input
          type="email"
          v-model="form.username"
          placeholder="请输入邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <div class="flex w-full justify-between items-center">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <el-link :click="forgetPassword">忘记密码？</el-link>
      </div>
      <el-form-item>
        <el-button class="w-full" type="primary" @click="login" :loading="onLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
