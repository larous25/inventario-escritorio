<template>
  <div class="container py-3 py-md-4">

    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/products">
            Productos
          </router-link>
        </li>

        <li class="breadcrumb-item active">
          {{ title }}
        </li>
      </ol>
    </nav>

    <!-- Card -->
    <div class="card shadow-sm border-0 rounded-4">

      <div class="card-body p-3 p-md-4">

        <!-- Title -->
        <div class="mb-4">
          <h3 class="fw-bold mb-1">
            {{ title }}
          </h3>

          <small class="text-muted">
            Complete la información del producto
          </small>
        </div>

        <!-- Form -->
        <form @submit.prevent="send">

          <div class="row g-3">

            <!-- Nombre -->
            <div class="col-12">
              <label for="name" class="form-label fw-semibold">
                Nombre
              </label>

              <input
                id="name"
                type="text"
                class="form-control form-control-lg"
                placeholder="Nombre del producto"
                v-model="localProduct.name"
              />

              <small
                class="text-danger"
                :class="isActive ? 'd-none' : 'd-block'"
              >
                Es necesario un nombre
              </small>
            </div>

            <!-- Tipo -->
            <div class="col-12 col-md-6">
              <label for="type" class="form-label fw-semibold">
                Tipo
              </label>

              <input
                id="type"
                type="text"
                class="form-control"
                placeholder="Tipo de producto"
                v-model="localProduct.type"
              />
            </div>

            <!-- Cantidad -->
            <div class="col-12 col-md-6">
              <label for="amount" class="form-label fw-semibold">
                Cantidad
              </label>

              <input
                id="amount"
                type="number"
                min="0"
                class="form-control"
                placeholder="0"
                v-model="localProduct.amount"
                @input="checkifnumber($event, 'amount')"
              />
            </div>

            <!-- Precio -->
            <div class="col-12 col-md-6">
              <label for="price" class="form-label fw-semibold">
                Precio
              </label>

              <input
                id="price"
                type="number"
                min="0"
                step="50"
                class="form-control"
                placeholder="0"
                v-model="localProduct.price"
                @blur="checkifnumber($event, 'price')"
              />
            </div>

            <!-- Precio Venta -->
            <div class="col-12 col-md-6">
              <label for="pricesale" class="form-label fw-semibold">
                Precio de venta
              </label>

              <input
                id="pricesale"
                type="number"
                min="0"
                step="50"
                class="form-control"
                placeholder="0"
                v-model="localProduct.pricesale"
                @blur="checkifnumber($event, 'pricesale')"
              />
            </div>

            <!-- Comentarios -->
            <div class="col-12">
              <label for="comments" class="form-label fw-semibold">
                Comentarios
              </label>

              <textarea
                id="comments"
                rows="4"
                class="form-control"
                placeholder="Comentarios adicionales..."
                v-model="localProduct.comments"
              />
            </div>

          </div>

          <!-- Buttons -->
          <div class="d-flex flex-column flex-md-row gap-2 justify-content-end mt-4">

            <router-link
              class="btn btn-outline-dark"
              :to="{ name: 'products' }"
            >
              Atrás
            </router-link>

            <button
              type="submit"
              class="btn btn-primary px-4"
            >
              Guardar
            </button>

          </div>

        </form>

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

<style scoped>
.card {
  max-width: 900px;
  margin: auto;
}

.form-control,
.btn {
  border-radius: 12px;
}

textarea {
  resize: none;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem !important;
  }

  h3 {
    font-size: 1.4rem;
  }
}
</style>