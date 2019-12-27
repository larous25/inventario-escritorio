/* globals Vue */

const productlistcomponent = require('./productlist')
const productsalecomponent = require('./productsale')
const { mapState, mapActions } = require('vuex')

const template = `
	<table class="table  table-hover table-sm">
		<thead class="thead-dark">
			<tr v-if="$route.path == '/products'">
				<th scope="col"># Id</th>
				<th scope="col">NOMBRE</th>
				<th scope="col">CANTIDAD</th>
				<th scope="col">PRECIO DE VENTA</th>
				<th scope="col" colspan="2">    
                    <router-link  to="/newproduct" tag="button" class="btn btn-secondary">  +  </router-link>
				</th>
			</tr>
			<tr v-else>
                <th scope="row"></th>
                <th scope="col">CANTIDAD</th>
				<th scope="col">NOMBRE</th>
				<th scope="col">PRECIO DE VENTA</th>
			</tr>
        </thead>
        
		<tbody v-if="$route.path == '/products'">
			<productlistcomponent v-for="(i, index) in products"  :product="i" :key="index" @load="loadproducts" />
		</tbody>
		
		<tbody v-else>
			<productsalecomponent v-for="(i, index) in products"  :product="i" :key="index"/>
		</tbody>

	</table>
`

module.exports = Vue.component('producstable-component', {
  components: {
    productlistcomponent,
    productsalecomponent
  },
  template,
  props: {
    from: {
      type: Number,
      default: 0
    },
    quantitytoload: {
      type: Number,
      default: 10
    }
  },
  created () {
    this.$store.dispatch('loadproducts')
  },
  methods: mapActions(['loadproducts']),
  computed: mapState([
    'products'
  ]),
  watch: {
    from: 'loadproducts'
  }
})
