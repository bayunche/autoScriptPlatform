const useAppStore = defineStore('app', {
  state: () => ({
    appVersion: ''
  }),
  actions: {
    async fetchAppVersion() {
      window.electronAPI.sendMessage('get-app-version')
      window.electronAPI.onMessage('app-version', (version) => {
        this.appVersion = version
      })
    }
  }
})
export {useAppStore}
