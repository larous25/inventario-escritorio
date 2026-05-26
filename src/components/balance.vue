<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/products">inicio</router-link>
        </li>
        <li class="breadcrumb-item active">Balance</li>
      </ol>
    </nav>
    <div class="container">
      <h2>Por el momento no hay nada que mostrar</h2>
      <button @click="back" class="btn btn-dark">Atrás</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function back() {
  router.push({ name: 'products' })
}
</script>