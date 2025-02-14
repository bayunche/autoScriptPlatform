// 创建vuerouter实例
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'
// 路由懒加载
const Home = () => import('../view/Home.vue')
const About = () => import('../view/About.vue')
const Login = () => import('../view/Login.vue')
const ScriptList = () => import('../view/ScriptList.vue')
const scriptView = () => import('../view/ScriptView.vue')
const Log = () => import('../view/Log.vue')
const chatDeepSeek = () => import('../view/DeepSeekChatView.vue')
const chat = () => import('../view/ChatView.vue')
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/scriptList',
    name: 'ScriptList',
    component: ScriptList
  },
  {
    path: '/scriptView',
    name: 'ScriptView',
    component: scriptView
  },
  {
    path: '/Log',
    name: 'Log',
    component: Log
  },
  {
    path: '/chatDeepSeek',
    name: 'chatDeepSeek',
    component: chatDeepSeek
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  console.log(to.path === '/about')
  next()
  if (to.path === '/Login') {
    next('/')
  }
  // if (to.path === '/login' || to.path === '/register'|| to.path === '/about' || to.path === '/') {
  //   next()
  // } else {
  //   if (!user.value.token=='') {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
})
