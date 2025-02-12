import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 注册插件
// vuerouter
import router from './router/router'

// 注册pinia
import { pinia } from './store/index'

const app = createApp(App)
app.use(router).use(pinia).use(ElementPlus, { locale: zhCn }).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
