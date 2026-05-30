<template>
  <div class="container-fluid py-3 px-2 px-md-4">

    <!-- HEADER -->
    <header
      class="card shadow-sm border-0 rounded-4 mb-4"
    >

      <div
        class="card-body d-flex flex-column flex-md-row
               align-items-center justify-content-between gap-3"
      >

        <!-- TITLE -->
        <div>
          <h3 class="fw-bold mb-0">
            Sistema de Ventas
          </h3>

          <small class="text-muted">
            Gestión de productos y ventas
          </small>
        </div>

        <!-- NAVIGATION -->
        <nav>

          <ul class="nav nav-pills gap-2">

            <li
              class="nav-item"
              v-for="o in options"
              :key="o.link"
            >

              <router-link
                class="nav-link px-4"
                :to="o.link"
                active-class="active"
              >
                {{ o.text }}
              </router-link>

            </li>

          </ul>

        </nav>

      </div>

    </header>

    <!-- CONTENT -->
    <router-view />

    <!-- EMPTY STATE -->
    <div
      v-if="quantity <= 0"
      class="card shadow-sm border-0 rounded-4"
    >

      <div
        class="card-body text-center py-5"
      >

        <h4 class="fw-bold mb-3">
          No hay registros
        </h4>

        <p class="text-muted mb-4">

          Es necesario crear

          <strong v-if="$route.path === '/sales'">
            una venta
          </strong>

          <strong v-else>
            un producto
          </strong>

          para comenzar.

        </p>

        <router-link
          v-if="$route.path === '/products'"
          to="/newproduct"
          class="btn btn-primary btn-lg px-4"
        >
          Crear producto
        </router-link>

        <router-link
          v-else
          to="/newsale"
          class="btn btn-primary btn-lg px-4"
        >
          Crear venta
        </router-link>

      </div>

    </div>

    <!-- TABLES -->
    <div v-else>

      <productstablecomponent
        v-if="$route.path === '/products'"
        :from="from"
        :quantitytoload="quantitytoload"
      />

      <salestablecomponent
        v-else
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
</template>

<script setup>
import {
  computed,
  watch,
  onMounted
} from 'vue'

import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import productstablecomponent from './productstable.vue'
import salestablecomponent from './salestable.vue'
import paginationcomponent from './pagination.vue'

const store = useStore()
const route = useRoute()

const page = computed(() => store.state.page)

const quantity = computed(
  () => store.state.quantity
)

const from = computed(
  () => store.state.from
)

const quantitytoload = computed(
  () => store.state.quantitytoload
)

const options = computed(
  () => store.state.options
)

function setfrom(f, p) {

  store.commit('setfrom', {
    f,
    p
  })
}

function getquantity() {

  const type =
    route.path === '/products'
      ? 'PRODUCTS'
      : 'SALES'

  store.dispatch('getquantity', type)
}

onMounted(() => getquantity())

watch(
  () => route.path,
  () => getquantity()
)
</script>

<style scoped>
.nav-link {
  border-radius: 12px;
  font-weight: 500;
}

.nav-link.active {
  background-color: #0d6efd;
}

.card {
  overflow: hidden;
}

@media (max-width: 768px) {

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-link {
    text-align: center;
  }

  h3 {
    font-size: 1.5rem;
  }
}
</style>