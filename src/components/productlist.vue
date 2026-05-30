<template>
  <tr class="align-middle">
    <td class="fw-semibold">
      {{ product.product }}
    </td>

    <td>
      {{ product.name }}
    </td>

    <td class="text-center">
      {{ product.amount }}
    </td>

    <td class="text-success fw-bold">
      $ {{ product.pricesale }}
    </td>

    <td>
      <router-link
        class="btn btn-sm btn-outline-secondary w-100"
        to="/editproduct"
        @click="editProduct"
      >
        Actualizar
      </router-link>
    </td>

    <td>
      <button
        class="btn btn-sm btn-outline-danger w-100"
        @click="remove"
      >
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

<style scoped>
button {
  border-radius: 10px;
  min-width: 42px;
}

td {
  vertical-align: middle;
}

@media (max-width: 768px) {

  td {
    font-size: 0.85rem;
  }

  button {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>