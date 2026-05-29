<template>
  <tr>
    <td>{{ sale.sale }}</td>
    <td>{{ sale.total }}</td>
    <td>{{ sale.createat }}</td>
    <td>
      <router-link class="btn btn-secondary" to="/editsale" @click="editSale">
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

const props = defineProps({
  sale: { type: Object, required: true }
})

const emit = defineEmits(['load'])
const store = useStore()

async function remove() {
  const response = await window.electronAPI.showMessageBox({
    type: 'question',
    buttons: ['Cancelar', 'Aceptar'],
    title: 'Por favor confirmar',
    message: '¿Está seguro que desea eliminar esta venta?'
  })

  if (response.response === 1) {
    await store.dispatch('removesale', props.sale.sale)
    emit('load')
  }
}

function editSale(sale) {
 
  store.commit('setSaleToEdit', props.sale) 
 
  // router.push('/editsale')
}
</script>