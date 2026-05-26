<template>
  <div class="row">
    <div class="col-md-6">
      <div><small>Cantidad:</small> {{ product.amount }}</div>
      <div><small>Nombre:</small> {{ product.name }}</div>
    </div>
    <div class="col-md-3">{{ product.pricesale }}</div>
    <div class="col-md-3">
      <button class="btn" @click="add"><strong>+</strong></button>
      <button class="btn" @click="remove"><strong>-</strong></button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  product: { type: Object, default: () => ({}) }
})

const store = useStore()

function add() {
  store.commit('addproduct', props.product)
}

function remove() {
  store.commit('removeproduct', props.product)
}
</script>