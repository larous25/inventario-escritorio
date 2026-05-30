<template>
  <div class="card shadow-sm border-0 rounded-4">

    <div class="card-body p-2 p-md-3">

      <div class="table-responsive">

        <table
          class="table table-hover align-middle mb-0"
        >

          <thead class="table-dark">

            <tr>

              <th class="text-nowrap">
                # ID
              </th>

              <th class="text-center">
                TOTAL
              </th>

              <th class="text-nowrap">
                FECHA
              </th>

              <th
                colspan="2"
                class="text-center"
                style="width: 140px;"
              >

                <router-link
                  to="/newsale"
                  class="btn btn-sm btn-success rounded-circle fw-bold"
                >
                  +
                </router-link>

              </th>

            </tr>

          </thead>

          <tbody>

            <salescomponent
              v-for="(sale, index) in sales"
              :sale="sale"
              :key="sale.id || index"
              @load="loadsales"
            />

          </tbody>

        </table>

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

import salescomponent from './sales.vue'

const props = defineProps({

  from: {
    type: Number,
    default: 0
  },

  quantitytoload: {
    type: Number,
    default: 10
  }
})

const store = useStore()

const sales = computed(
  () => store.state.sales
)

function loadsales() {

  store.dispatch('loadsales', {
    f: props.from,
    q: props.quantitytoload
  })
}

onMounted(() => {
  loadsales()
})

watch(
  () => [
    props.from,
    props.quantitytoload
  ],
  () => loadsales()
)
</script>

<style scoped>
table {
  font-size: 0.95rem;
}

thead th {
  white-space: nowrap;
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