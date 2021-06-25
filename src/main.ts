import '@/styles/main.scss'

import { createApp } from 'vue'
import Root from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { setupAuth } from '@/auth'
import authConfig from '@/config/auth0'
import loadPlugings from '@/helpers/loadPlugins'

export const app = createApp(Root).use(store).use(router)

function callbackRedirect(appState: any) {
  router.push(appState && appState.targetUrl ? appState.targetUrl : '/')
}

loadPlugings(['primevue'])

setupAuth(
  {
    client_id: authConfig.clientId,
    domain: authConfig.domain,
    redirect_uri: authConfig.redirectUri,
  },
  callbackRedirect
).then((auth) => {
  app.use(auth).mount('#app')
})

// app.mount('#app')
