<template>
  <div class="container">
    <table class="table table-hover table-sm">
      <thead class="table-dark">
        <tr>
          <th scope="col"># Id</th>
          <th scope="col">TOTAL</th>
          <th scope="col">FECHA</th>
          <th scope="col" colspan="2">
            <router-link to="/newsale" class="btn btn-secondary">+</router-link>
          </th>
        </tr>
      </thead>
      <tbody>
        <salescomponent
          v-for="(sale, index) in sales"
          :sale="sale"
          :key="sale.id || index"
          @load="loadsales"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import salescomponent from './sales.vue'

const props = defineProps({
  from: { type: Number, default: 0 },
  quantitytoload: { type: Number, default: 10 }
})

const store = useStore()
const sales = computed(() => store.state.sales)


const loadsales = () => {
  store.dispatch('loadsales', { 
    f: props.from, 
    q: props.quantitytoload 
  })
}

// Ejecutar al montar
onMounted(() => {
  loadsales()
})


watch(() => [props.from, props.quantitytoload], () => {
  loadsales()
})
</script>