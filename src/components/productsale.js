/* globals Vue */

const template = `
<tr>
    <td scope="row">
        <button class="btn btn-segundary" @click="add">
            Agregar 
        </button>
    </td>
    <td> 
        <strong>
            {{ product.amount }} 
        </strong>
    </td>
    <td> 
    	{{ product.name }}
    </td>
	<td>
		{{ product.pricesale }}
	</td>
</tr>
`

module.exports = Vue.component('productsale-component', {
  template,
  props: {
    product: {
      type: Object,
      default: {
        product: 0,
        precio: 0,
        priceSale: 0,
        name: '',
        tipo: '',
        amount: 0,
        sold: 0
      }
    }
  },
  methods: {
    add () {
      this.$store.commit('addproduct', this.product)
    }
  }
})
