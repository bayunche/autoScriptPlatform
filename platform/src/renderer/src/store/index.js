import { useUserStore } from './user'
import { useAppStore } from './app'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useScriptStore } from './script'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

var persist=false
//如果在生产模式则使用持久化
if (process.env.NODE_ENV === 'production') {
    persist=true
}
export  {useUserStore,useAppStore, pinia,useScriptStore,persist}