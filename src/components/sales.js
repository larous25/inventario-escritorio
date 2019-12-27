/* globals Vue */

const { dialog } = require('electron').remote

const template = `
<tr>
    <td> {{ sale.sale }} </td>
    <td> {{ sale.total }} </td>
    <td> {{ sale.createat }} </td>
	<td> 
		<router-link tag="button" class="btn btn-segundary" :to="{ name: 'editsale', params: { shopcart: sale } }">
			Actualizar 
		</router-link>
	</td>
	<td> 
		<button  class="btn btn-danger" @click="remove">
			Eliminar 
		</button>
	</td>
</tr>
`

module.exports = Vue.component('sales-component', {
  template,
  props: {
    sale: {
      type: Object,
      default: {
        sale: 0,
        total: 0,
        comments: '',
        createat: ''
      }
    }
  },
  methods: {
    remove () {
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Cancelar', 'Aceptar'],
        title: 'Porfavor confirmar',
        message: '¿Esta seguro que desea eliminar?'
      }, response => {
        if (response === 1) {
          this.$store.dispatch('removesale', {
            product: this.sale.sale
          })
          this.$emit('load')
        }
      })
    }
  }
})
