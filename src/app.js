/* globals Vue */

global.Vue = require('vue/dist/vue')

const VueRouter = require('vue-router/dist/vue-router')
const router = require('./router')
const store = require('./store')

Vue.use(VueRouter)

new Vue({
  router,
  store
}).$mount('#app')
