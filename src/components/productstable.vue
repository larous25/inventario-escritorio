<template>
  <div class="card shadow-sm border-0 rounded-4">
    <div class="card-body p-2 p-md-3">

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">

          <thead class="table-dark">
            <tr v-if="$route.path === '/products'">

              <th class="text-nowrap">
                # ID
              </th>

              <th>
                NOMBRE
              </th>

              <th class="text-center">
                CANTIDAD
              </th>

              <th class="text-end">
                PRECIO
              </th>

              <th colspan="2" class="text-center" style="width: 140px;">

                <router-link
                  to="/newproduct"
                  class="btn btn-sm btn-success rounded-circle fw-bold"
                >
                  +
                </router-link>

              </th>
            </tr>

            <tr v-else>

              <th style="width: 50px;"></th>

              <th class="text-center">
                CANTIDAD
              </th>

              <th>
                NOMBRE
              </th>

              <th class="text-end">
                PRECIO
              </th>

            </tr>
          </thead>

          <tbody v-if="$route.path === '/products'">

            <productlistcomponent
              v-for="(i, index) in products"
              :product="i"
              :key="index"
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
      </div>

    </div>
  </div>
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

<style scoped>
table {
  font-size: 0.95rem;
}

thead th {
  white-space: nowrap;
}

tbody tr:hover {
  transition: 0.2s;
}

.btn.rounded-circle {
  width: 32px;
  height: 32px;
  padding: 0;
}

@media (max-width: 768px) {
  table {
    font-size: 0.82rem;
  }

  .btn {
    font-size: 0.75rem;
  }
}
</style>