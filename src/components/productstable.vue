<template>
  <table class="table table-hover table-sm">
    <thead class="table-dark">
      <tr v-if="$route.path === '/products'">
        <th scope="col"># Id</th>
        <th scope="col">NOMBRE</th>
        <th scope="col">CANTIDAD</th>
        <th scope="col">PRECIO DE VENTA</th>
        <th scope="col" colspan="2">
          <router-link to="/newproduct" class="btn btn-secondary">+</router-link>
        </th>
      </tr>
      <tr v-else>
        <th scope="row"></th>
        <th scope="col">CANTIDAD</th>
        <th scope="col">NOMBRE</th>
        <th scope="col">PRECIO DE VENTA</th>
      </tr>
    </thead>

    <tbody v-if="$route.path === '/products'">
      <productlistcomponent
        v-for="(i, index) in products"
        :product="i"
        :key="index"
        @load="loadproducts"
      />
    </tbody>

    <tbody v-else>
      <productsalecomponent
        v-for="(i, index) in products"
        :product="i"
        :key="index"
      />
    </tbody>
  </table>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import productlistcomponent from './productlist.vue'
import productsalecomponent from './productsale.vue'

const props = defineProps({
  from: { type: Number, default: 0 },
  quantitytoload: { type: Number, default: 10 }
})

const store = useStore()
const route = useRoute()
const products = computed(() => store.state.products)

const loadproducts = () => store.dispatch('loadproducts')

onMounted(() => loadproducts())
watch(() => props.from, () => loadproducts())
</script>

