<template>
<tr>
    <td> {{ product.product }} </td>
    <td> {{ product.name }} </td>
    <td> {{ product.amount }} </td>
    <td> {{ product.price }} </td>
    <td>
      <router-link class="btn btn-secondary" :to="{ name: 'editproducts', params: { product } }">
        Actualizar
      </router-link>
    </td>
    <td>
      <button class="btn btn-danger" @click="remove">
        Eliminar
      </button>
    </td>
</tr>
</template>

<script>
const { dialog } = require('electron').remote

export default {
  name: 'ProductListComponent',
  props: {
    product: {
      type: Object,
      default: () => ({
        product: 0,
        precio: 0,
        priceSale: 0,
        name: '',
        tipo: '',
        amount: 0,
        sold: 0
      })
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
          this.$store.dispatch('removeproduct', {
            product: this.product.product
          })
          this.$emit('load')
        }
      })
    },
    update () {
      this.$router.push('/editproduct')
    }
  }
}
</script>

