<template>
  <tr class="align-middle">

    <!-- ID -->
    <td class="fw-semibold text-nowrap">
      #{{ sale.sale }}
    </td>

    <!-- TOTAL -->
    <td class="text-success fw-bold text-center">
      $ {{ sale.total }}
    </td>

    <!-- DATE -->
    <td class="text-muted text-nowrap">
      {{ sale.createat }}
    </td>

    <!-- EDIT -->
    <td style="width: 120px;">

      <router-link
        class="btn btn-sm btn-outline-secondary w-100"
        to="/editsale"
        @click="editSale"
      >
        Actualizar
      </router-link>

    </td>

    <!-- REMOVE -->
    <td style="width: 120px;">

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

const props = defineProps({
  sale: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'load'
])

const store = useStore()

async function remove() {

  const response =
    await window.electronAPI.showMessageBox({

      type: 'question',

      buttons: [
        'Cancelar',
        'Aceptar'
      ],

      title: 'Por favor confirmar',

      message:
        '¿Está seguro que desea eliminar esta venta?'
    })

  if (response.response === 1) {

    await store.dispatch(
      'removesale',
      props.sale.sale
    )

    emit('load')
  }
}

function editSale() {

  store.commit(
    'setSaleToEdit',
    props.sale
  )
}
</script>

<style scoped>
td {
  vertical-align: middle;
}

.btn {
  border-radius: 10px;
}

@media (max-width: 768px) {

  td {
    font-size: 0.85rem;
  }

  .btn {
    font-size: 0.75rem;
  }
}
</style>