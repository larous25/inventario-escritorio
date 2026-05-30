<template>
  <div class="container-fluid py-3 px-2 px-md-4">

    <!-- HEADER -->
    <div class="mb-4">

      <nav aria-label="breadcrumb">

        <ol class="breadcrumb">

          <li class="breadcrumb-item">
            <router-link to="/sales">
              Ventas
            </router-link>
          </li>

          <li class="breadcrumb-item active">
            {{ title }}
          </li>

        </ol>

      </nav>

      <h2 class="fw-bold mb-0">
        {{ title }}
      </h2>

    </div>

    <!-- EMPTY PRODUCTS -->
    <div
      v-if="quantity <= 0"
      class="card shadow-sm border-0 rounded-4"
    >

      <div
        class="card-body text-center py-5"
      >

        <div class="display-3 mb-3">
          📦
        </div>

        <h4 class="fw-bold">
          No existen productos
        </h4>

        <p class="text-muted mb-4">
          Debes crear al menos un producto
          antes de registrar una venta.
        </p>

        <router-link
          to="/newproduct"
          class="btn btn-primary px-4"
        >
          Crear producto
        </router-link>

      </div>

    </div>

    <!-- CONTENT -->
    <div
      v-else
      class="row g-4"
    >

      <!-- LEFT SIDE -->
      <div class="col-12 col-lg-5">

        <!-- CART -->
        <div
          class="card shadow-sm border-0 rounded-4 mb-4"
        >

          <div class="card-body">

            <div
              class="d-flex justify-content-between
                     align-items-center mb-3"
            >

              <h4 class="fw-bold mb-0">
                Carrito
              </h4>

              <span class="badge bg-primary">
                {{ amount }} productos
              </span>

            </div>

            <!-- EMPTY -->
            <div
              v-if="productshassale.length <= 0"
              class="text-center py-5 text-muted"
            >

              Agrega productos al carrito

            </div>

            <!-- PRODUCTS -->
            <ul
              v-else
              class="list-group list-group-flush"
            >

              <li
                v-for="(product, index) in productshassale"
                :key="index"
                class="list-group-item px-0"
              >

                <shopcartproductcomponent
                  :product="product"
                />

              </li>

            </ul>

            <!-- TOTAL -->
            <div
              class="border-top pt-3 mt-3"
            >

              <div
                class="d-flex justify-content-between"
              >

                <span class="fw-semibold">
                  Total:
                </span>

                <span
                  class="fw-bold text-success fs-5"
                >
                  $ {{ total }}
                </span>

              </div>

            </div>

          </div>

        </div>

        <!-- COMMENTS -->
        <div
          class="card shadow-sm border-0 rounded-4"
        >

          <div class="card-body">

            <label
              for="comments"
              class="form-label fw-semibold"
            >
              Comentarios
            </label>

            <textarea
              id="comments"
              class="form-control"
              rows="4"
              placeholder="Comentarios..."
              v-model="localComments"
            />

            <div
              class="d-flex gap-2 justify-content-end mt-4"
            >

              <router-link
                class="btn btn-outline-dark"
                :to="{ name: 'sales' }"
              >
                Atrás
              </router-link>

              <button
                @click="send"
                class="btn btn-primary px-4"
              >
                Guardar venta
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- RIGHT SIDE -->
      <div class="col-12 col-lg-7">

        <productstablecomponent
          :from="from"
          :quantitytoload="quantitytoload"
        />

        <div class="mt-4">

          <paginationcomponent
            :quantity="quantity"
            :quantitytoload="quantitytoload"
            :page="page"
            @setfrom="setfrom"
          />

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useStore } from 'vuex'

import {
  useRoute,
  useRouter
} from 'vue-router'

import productstablecomponent from './productstable.vue'
import paginationcomponent from './pagination.vue'
import shopcartproductcomponent from './shopcartproduct.vue'

const store = useStore()

const route = useRoute()

const router = useRouter()

const saleToEdit = computed(
  () => store.state.saleToEdit
)

const localComments = ref('')

const title = computed(() =>
  route.path === '/newsale'
    ? 'Nueva Venta'
    : 'Actualizar Venta'
)

const productshassale = computed(
  () => store.state.productshassale
)

const amount = computed(
  () => store.state.amount
)

const total = computed(
  () => store.state.total
)

const page = computed(
  () => store.state.page
)

const quantity = computed(
  () => store.state.quantity
)

const from = computed(
  () => store.state.from
)

const quantitytoload = computed(
  () => store.state.quantitytoload
)

function setfrom(f, p) {

  store.commit('setfrom', {
    f,
    p
  })
}

async function send() {

  if (amount.value <= 0) {

    await window.electronAPI.showMessageBox({
      type: 'info',
      buttons: ['Aceptar'],
      title: 'Carrito vacío',
      message:
        'Seleccione productos antes de guardar.'
    })

    return
  }

  const data = {
    comments: localComments.value,
    created_by: 1
  }

  const action =
    route.path === '/newsale'
      ? 'sendsale'
      : 'updatesale'

  if (
    action === 'updatesale' &&
    saleToEdit.value
  ) {

    data.sale = saleToEdit.value.sale
    data.id = saleToEdit.value.id
  }

  const cleanData =
    JSON.parse(JSON.stringify(data))

  store.dispatch(action, {

    data: cleanData,

    cb: (err) => {

      if (err) throw err

      store.commit(
        'setSaleToEdit',
        null
      )

      router.push('/sales')
    }
  })
}

onMounted(() => {

  store.commit('restartcart')

  if (saleToEdit.value) {

    localComments.value =
      saleToEdit.value.comments || ''

    store.dispatch(
      'loadproductshassales',
      saleToEdit.value
    )
  }

  store.dispatch(
    'getquantity',
    'PRODUCTS'
  )
})
</script>

<style scoped>
.list-group-item {
  border-left: 0;
  border-right: 0;
}

textarea {
  resize: none;
}

.badge {
  font-size: 0.85rem;
}

.card {
  overflow: hidden;
}

@media (max-width: 992px) {

  .card-body {
    padding: 1rem;
  }

  h2 {
    font-size: 1.6rem;
  }
}
</style>