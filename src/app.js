import { createApp } from 'vue'

import router from './router'
import store from './store'

const app = createApp({
  template: '<router-view />'
})

app.use(store)
app.use(router)

app.mount('#app')