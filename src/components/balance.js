/* globals Vue */

let template = `
<div class="container">

    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"> 
            <router-link to="/products" >inicio</router-link>
        </li>
        <li class="breadcrumb-item active">Balance</li>
    </ol>
    </nav>

    <div class="container">
        <h2> Por el momento no hay nada que mostrar </h2>
        <button @click="back" class="btn btn-dark">
            Atras
        </button>
    </div>
 
</div>
`;

module.exports = Vue.component('balance-component', {
	template,
	data : ()  => ({}),
	methods: {
		back() {
			this.$router.push({ name: 'products', list: 'products' });
		}
	}
});