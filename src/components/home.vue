<template>
  <div class="container">
    <header class="navbar navbar-dark bg-light">
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
              <span>
                {{ o.text }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <router-view />

    <div v-if="quantity <= 0" class="container">
      <p>
        Es necesario crear un

        <strong v-if="$route.path === '/sales'">
          ventas
        </strong>

        <strong v-else>
          producto
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

<script>
import { mapState } from 'vuex'

import productstablecomponent from './productstable.vue'
import salestablecomponent from './salestable.vue'
import paginationcomponent from './pagination.vue'

export default {
  name: 'HomeComponent',
  components: {
    productstablecomponent,
    salestablecomponent,
    paginationcomponent
  },
  computed: {
    ...mapState([
      'page',
      'quantity',
      'from',
      'quantitytoload',
      'options'
    ])
  },
  mounted () {
    this.getquantity()
  },
  methods: {
    setfrom (f, p) {
      this.$store.commit('setfrom', { f, p })
    },
    getquantity () {
      const type =
        this.$route.path === '/products'
          ? 'PRODUCTS'
          : 'SALES'

      this.$store.dispatch('getquantity', type)
    }
  },
  watch: {
    $route () {
      this.getquantity()
    }
  }
}
</script>
