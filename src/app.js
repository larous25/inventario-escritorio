/* globals Vue */

global.Vue = require('vue/dist/vue');

let VueRouter = require('vue-router/dist/vue-router');
let router = require('./router');
let store = require('./store');

Vue.use(VueRouter);

new Vue({
	router,
	store
}).$mount('#app');

