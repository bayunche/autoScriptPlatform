import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 注册插件
// vuerouter
import router from './router/router'

// 注册pinia
import { pinia} from './store/index'



createApp(App)
.use(router)
.use(pinia)
.mount('#app')

