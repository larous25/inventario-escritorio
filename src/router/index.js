let VueRouter = require('vue-router/dist/vue-router');
let homeComponent  = require('../components/home');
let balanceComponent  = require('../components/balance');
let formProductComponent  = require('../components/formproduct');
let formSalesComponent  = require('../components/formsales');

const routes = [
	{ path: '/editsale', name: 'editsale', component: formSalesComponent, props: true },
	{ path: '/newsale', component: formSalesComponent },
	{ path: '/editproduct', name: 'editproducts', component: formProductComponent, props: true },
	{ path: '/newproduct', component: formProductComponent },
	{ path: '/products', name: 'products', component: homeComponent },
	{ path: '/sales', name: 'sales' , component: homeComponent },
	{ path: '/balance', component: balanceComponent },
	{ path: '/', redirect: '/products' }
];

const router = new VueRouter({
	routes
});

module.exports = router;