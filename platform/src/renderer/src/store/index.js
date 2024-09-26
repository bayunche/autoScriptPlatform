import { useUserStore } from './user'
import { useAppStore } from './app'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useScriptStore } from './script'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export  {useUserStore,useAppStore, pinia,useScriptStore}