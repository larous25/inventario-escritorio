<template>
  <tr class="align-middle">

    <!-- Acción -->
    <td class="text-center">

      <button
        class="btn btn-sm btn-success px-3"
        @click="add"
      >
        +
      </button>

    </td>

    <!-- Cantidad -->
    <td class="text-center fw-bold">
      {{ product.amount }}
    </td>

    <!-- Nombre -->
    <td class="text-nowrap">
      {{ product.name }}
    </td>

    <!-- Precio -->
    <td class="text-end text-success fw-semibold">
      $ {{ product.pricesale }}
    </td>

  </tr>
</template>

<script setup>
import { useStore } from 'vuex'

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

function add() {
  store.commit('addproduct', props.product)
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