<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/products">products</router-link>
        </li>
        <li class="breadcrumb-item active">Editar - Crear</li>
      </ol>
    </nav>

    <h3 v-if="$route.path === '/newproduct'">Nuevo Producto</h3>
    <h3 v-else-if="$route.path === '/editproduct'">Actualizar Producto</h3>

    <form @submit.prevent="send">
      <div class="mb-3">
        <label for="name" class="form-label">Nombre:</label>
        <input
          id="name"
          name="name"
          type="text"
          class="form-control"
          placeholder="Nombre"
          v-model="localProduct.name"
        />
        <small :class="isActive ? 'd-none' : 'd-block'">
          Es necesario un nombre
        </small>
      </div>

      <div class="mb-3">
        <label for="type" class="form-label">Tipo:</label>
        <input
          id="type"
          name="type"
          type="text"
          class="form-control"
          placeholder="tipo"
          v-model="localProduct.type"
        />
      </div>

      <div class="mb-3">
        <label for="amount" class="form-label">Cantidad:</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          class="form-control"
          placeholder="Cantidad"
          v-model="localProduct.amount"
          @input="checkifnumber($event, 'amount')"
        />
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Precio:</label>
        <input
          id="price"
          name="price"
          type="number"
          step="50"
          min="0"
          class="form-control"
          placeholder="precio"
          v-model="localProduct.price"
          @blur="checkifnumber($event, 'price')"
        />
      </div>

      <div class="mb-3">
        <label for="pricesale" class="form-label">Precio de venta:</label>
        <input
          id="pricesale"
          name="pricesale"
          type="number"
          step="50"
          min="0"
          class="form-control"
          placeholder="precio de venta"
          v-model="localProduct.pricesale"
          @blur="checkifnumber($event, 'pricesale')"
        />
      </div>

      <div class="mb-3">
        <label for="comments" class="form-label">Comentarios:</label>
        <textarea
          id="comments"
          name="comments"
          class="form-control"
          placeholder="comentarios"
          v-model="localProduct.comments"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-secondary">Guardar</button>
    </form>

    <div class="container justify-content-end">
      <div class="float-end">
        <router-link class="btn btn-dark btn-sm" :to="{ name: 'products' }">
          Atrás
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const isActive = computed(() => store.state.isActive)
const productToEdit = computed(() => store.state.productToEdit)

const localProduct = ref({
  name: '', type: '', amount: 0, price: 0, pricesale: 0, comments: ''
})


watch(productToEdit, (newVal) => {
  console.log("Datos recibidos en formulario:", newVal);
  if (newVal) {
    localProduct.value = { ...newVal }
  }
}, { immediate: true })

function checkifnumber(event, property) {
  let value = event.target.value.replace(/[^\d.]/g, '')
  const number = Number(value)
  let newvalue = isNaN(number) ? 0 : number
  
  if (/price/.test(property)) {
    newvalue = Math.ceil(newvalue / 50) * 50
  }
  
  localProduct.value[property] = newvalue
  event.target.value = newvalue
}

async function send() {
  if (!localProduct.value.name) {
    store.commit('desactive')
    return
  }
  
  const action = route.path === '/newproduct' ? 'sendproduct' : 'updateproduct'
  
  try {
    await store.dispatch(action, { product: localProduct.value })
    store.commit('setProductToEdit', null) 
    router.push('/products')
  } catch (err) { console.error(err) }
}
</script>