<template>
  <div class="container">
    <header class="navbar navbar-light bg-light">
      <nav class="nav nav-pills nav-fill">
        <ul class="nav justify-content-center">
          <li
            class="nav-item"
            v-for="o in options"
            :key="o.link"
          >
            <router-link
              class="nav-link"
              :to="o.link"
              active-class="active"
            >
              <span>{{ o.text }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <router-view />

    <div v-if="quantity <= 0" class="container">
      <p>
        Es necesario crear

        <strong v-if="$route.path === '/sales'">
          una venta
        </strong>

        <strong v-else>
          un producto
        </strong>

        para comenzar:
        <br />
      </p>

      <router-link
        v-if="$route.path === '/products'"
        to="/newproduct"
        class="btn btn-secondary"
      >
        +
      </router-link>

      <router-link
        v-else
        to="/newsale"
        class="btn btn-secondary"
      >
        +
      </router-link>
    </div>

    <div v-else class="container">
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

      <paginationcomponent
        :quantity="quantity"
        :quantitytoload="quantitytoload"
        :page="page"
        @setfrom="setfrom"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import productstablecomponent from './productstable.vue'
import salestablecomponent from './salestable.vue'
import paginationcomponent from './pagination.vue'

const store = useStore()
const route = useRoute()


const page = computed(() => store.state.page)
const quantity = computed(() => store.state.quantity)
const from = computed(() => store.state.from)
const quantitytoload = computed(() => store.state.quantitytoload)
const options = computed(() => store.state.options)

function setfrom(f, p) {
  store.commit('setfrom', { f, p })
}

function getquantity() {
  const type = route.path === '/products' ? 'PRODUCTS' : 'SALES'
  store.dispatch('getquantity', type)
}

onMounted(() => getquantity())
watch(() => route.path, () => getquantity())
</script>