import './styles/main.scss'

import { createApp } from 'vue'
import Root from './App.vue'
import router from './router'
import store from './store'
import loadPlugings from '@/helpers/loadPlugins'

export const app = createApp(Root)

loadPlugings(['primevue'])

app.use(store)
app.use(router)
app.mount('#app')
