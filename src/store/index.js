/* globals Vue */

const Vuex = require('vuex');
const Stock = require('../../models/stocktaking');
const {
	compareids,
	findproduct
} = require('./helpers');

Vue.use(Vuex);

const one = 1;
const zero = 0;



const initstate = {
	// this for pagniation component comunication
	page: one,
	quantity: zero,
	from: zero,
	quantitytoload: 10,
	// home
	options: [
		{ text: 'productos', link: '/products' },
		{ text: 'ventas', link: '/sales' },
		{ text: 'balance', link: '/balance' }
	],
	// this are products of table component
	products: [],
	sales: [],
	// i forget =S
	isactive: true,
	// these are for create and update sale	
	// then arrays are for calculate to amount for each product when create and update
	productscarttemp: [],
	pcartupdate: [],
	pcartnoupdate: [],
	productshassale: [],
	amount: zero,
	total: zero,
};






module.exports = new Vuex.Store({
	state: initstate,
	mutations: {
		setfrom(state, payload) {
			state.from = payload.f;
			state.page = payload.p;
		}, 
		setquantity(state, payload) {
			state.quantity = payload;
		},
		desactive(state) {
			state.isactive = false;
		},
		restartcart(state) {
			state.products = [];			
			state.productscarttemp = [];
			state.pcartupdate = [];
			state.pcartnoupdate = [];
			state.productshassale = [];
			state.amount = 0;
			state.total = 0;
		},
		removeproduct(state, payload) {			

			let remove = arr => {
				let i = arr.findIndex(p => compareids(p, payload));
				arr.splice(i, one);
			};

			let productcart = findproduct(state.productscarttemp, payload);
			if (productcart.amount <= one) {
				if (productcart.amount <= zero) {
					let productcart2 = findproduct(state.pcartupdate, payload);
					if (productcart2.amount <= one) {
						remove(state.pcartupdate);
					} else {
						productcart2.amount -= one;
					}
				} else {
					remove(state.productscarttemp);
					findproduct(state.products, payload).amount += one;
				}
			} else {
				productcart.amount -= one;
				findproduct(state.products, payload).amount += one;
			}
		
			this.commit('settotal');
		},
		addproduct(state, payload) {

			let create = () => {
				let product = Object.assign({}, payload);
				product.amount = one;
				return product;
			};

			let producttable = findproduct(state.products, payload);

			if (producttable.amount <= zero) return;

			let productnoupdates = findproduct(state.pcartnoupdate, payload);
			let productupdates = findproduct(state.pcartupdate, payload);
			let productcarttemp = findproduct(state.productscarttemp, payload);

			if (productcarttemp) {
				productcarttemp.amount += one;
				producttable.amount -= one;
			} else if (!productnoupdates || (productupdates.amount > productnoupdates.amount)) {
				state.productscarttemp.push(create());
				producttable.amount -= one;
			} else if (productnoupdates) {

				if (!productupdates) {
					state.pcartupdate.push(create());
				} else if (productupdates.amount < productnoupdates.amount) {
					productupdates.amount = + one;
				}
			}
			
			this.commit('settotal');
		},
		settotal(state) {
			this.commit('setproductshassale');
			state.amount = state.productshassale.reduce((a, p) => a += p.amount, zero);
			state.total = state.productshassale.reduce((a, p) => a += p.amount * p.pricesale, zero);
		},
		setproductshassale(state) {
			
			let a = state.productscarttemp.map(a => a);
			let b = state.pcartupdate.map(a => a);
			
			// state.productshassale = a.concat(b);
			state.productshassale = [...a, ...b];
		},
		settablequantities(state, payload) {

			let a = payload.map(e => {
				state.productscarttemp.forEach(p => {
					if (e.product == p.product) e.amount -= p.amount;
				});
				return e;
			});
			state.products = a;
		}
	},
	actions: {
		getquantity(context, payload) {	
			Stock.getcounttable(payload, (err, quantity) => {
				if (err) console.log('algun error', err);
				context.commit('setquantity', quantity);
			});
		},
		loadproducts({ commit, state }) {
			
			let options = {
				table: 'PRODUCTS',
				q: state.quantitytoload,
				f: state.from,
				id: 'PRODUCT'
			};
			
			Stock.gettable(options, (err, rows) => {
				if (err) console.log('algun error', err);
				
				commit('settablequantities', rows);
			});

		},
		loadsales({ state }) {
			
			let options = {
				table: 'SALES',
				q: state.quantitytoload,
				f: state.from,
				id: 'SALE'
			};
			
			Stock.gettable(options, (err, rows) => {
				if (err) console.log('algun error', err);
	
				state.sales = rows;
			});

		},
		loadproductshassales({ state },  payload) {
			
			let sql = `
				SELECT 
					PS.AMOUNT,
					P.PRODUCT,
					P.NAME,
					P.PRICE,
					P.PRICESALE
				FROM PRODUCTS_HAS_SALES AS PS
				JOIN PRODUCTS AS P ON 
					PS.PRODUCTS_PRODUCT = P.PRODUCT 
					WHERE SALES_SALE = ${ payload.sale }
				ORDER BY SALES_SALE 
			`;


			Stock.custom(sql, (err, products) => {
				if (err) console.log('algun error', err);
				// console.log(products);
				state.pcartupdate = products;
				state.pcartnoupdate = products;
				this.commit('settotal');
			});

		},
		sendproduct(context, { product, cb }) {
			Stock.insertproduct(product, err => {
				if (err)  cb(err);

				cb();
			});
		},
		sendsale({ state }, { data, cb }) {

			data.amount = state.amount;
			data.total = state.total;
			Stock.insertsale(data, err => {
				if (err) cb(err);
				
				Stock.updateproduct(state.productscarttemp.map(p => findproduct.find(state.products, p)), err => {
					if (err) cb(err);

					cb();
				});
			});
		},
		updateproduct(context, { product, cb }) {
			Stock.updateproduct(product, err => {
				if (err) cb(err);

				cb();
			});
		},
		updatesale({ state }, { data, cb }) {

			data.amount = state.amount;
			data.total = state.total;
			data.products = state.productshassale;
			Stock.updatesale(data, err => {
				if (err) cb(err);

				cb();
			});
		},
		removeproduct(context, payload) {
			Stock.removeproduct(payload.product, err => {
				if (err) throw err;

			});
		},
		removesale(context, payload) {
			Stock.removesale(payload.product, err => {
				if (err) throw err;

			});
		}
	}
    
});
