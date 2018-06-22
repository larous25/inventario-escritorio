/* globals Vue */

const { mapState } = require('vuex');

const productstablecomponent = require('./productstable');
const salestablecomponent = require('./salestable');
const paginationcomponent = require('./pagination');

let template = `
<div class="container">
    <header class="navbar navbar-dark bg-light">
    <nav class="nav nav-pills nav-fill  ">
        <ul class="nav   justify-content-center">
            <li class="nav-item " v-for="o in options">
            <router-link class="nav-link" :to=o.link active-class='active'>
            <span>
            	{{ o.text }}
            </span>
            </router-link>    
            </li>
        </ul>
    </nav>
    </header>

    <router-view>
    </router-view>

    <div v-if="quantity <= 0" class="container">
		<p>
			Es necesario crear un 

			<strong v-if="$route.path == '/sales'"> ventas </strong> 
			<strong v-else> producto </strong>    
			
			para comenzar: </br>
		</p>
		
    	<router-link v-if="$route.path == '/products'" to="/newproduct" tag="button" class="btn btn-secondary">  +  </router-link>
    	<router-link v-else to="/newsale" tag="button" class="btn btn-secondary">  +  </router-link>
    </div>
	
    <div v-else-if="quantity > 0" class="container">
		<productstablecomponent v-if="$route.path == '/products'"  :from="from" :quantitytoload="quantitytoload" />
		<salestablecomponent v-else :quantitytoload="quantitytoload"  :from="from" />
		
		<paginationcomponent :quantity="quantity" :quantitytoload="quantitytoload" :page="page" @setfrom="setfrom"  />
	</div>
	</div>
`;


module.exports = Vue.component('home-component', {
	components: {
		productstablecomponent,
		salestablecomponent,
		paginationcomponent
	},
	template,
	created() {
		this.getquantity();
	},
	methods:{ 
		setfrom(f,p) {
			this.$store.commit('setfrom', { f, p });
		},
		getquantity() {
			this.$store.dispatch('getquantity', (this.$route.path == '/products') ? 'PRODUCTS' : 'SALES' );
		}
	},
	computed: mapState([
		'page',
		'quantity',
		'from',
		'quantitytoload',
		'options'
	]),
	watch: {
		'$route': 'getquantity'
	}
});

// nota: buscar que coinsidan las propiedades
// que no se descuenten productos al actualizar