<template>
<tr>
    <td> {{ product.product }} </td>
    <td> {{ product.name }} </td>
    <td> {{ product.amount }} </td>
    <td> {{ product.pricesale }} </td>
    <td>
      <router-link class="btn btn-secondary" to="/editproduct" @click="editProduct">
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

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
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
})

const store = useStore()
const router = useRouter()

async function remove() {
  const response = await window.electronAPI.showMessageBox({
    type: 'question',
    buttons: ['Cancelar', 'Aceptar'],
    title: 'Por favor confirmar',
    message: '¿Está seguro que desea eliminar este producto?'
  })

  if (response.response === 1) {
    await store.dispatch('removeproduct', {
      product: props.product.product
    })
  }
}

function editProduct() {
  // Guardamos el producto en el store
  store.commit('setProductToEdit', props.product)
  // router.push('/editproduct')
}

function update() {
  router.push('/editproduct')
}
</script>