<template>
  <div
    class="d-flex
           flex-column
           flex-md-row
           align-items-md-center
           justify-content-between
           gap-3"
  >

    <!-- INFO -->
    <div class="flex-grow-1">

      <div
        class="fw-semibold text-break"
      >
        {{ product.name }}
      </div>

      <small class="text-muted">

        Cantidad:
        <strong>
          {{ product.amount }}
        </strong>

      </small>

    </div>

    <!-- PRICE -->
    <div
      class="text-success fw-bold fs-5 text-md-end"
    >
      $ {{ product.pricesale }}
    </div>

    <!-- ACTIONS -->
    <div
      class="d-flex align-items-center gap-2"
    >

      <button
        class="btn btn-sm btn-outline-success action-btn"
        @click="add"
      >
        +
      </button>

      <button
        class="btn btn-sm btn-outline-danger action-btn"
        @click="remove"
      >
        −
      </button>

    </div>

  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const store = useStore()

function add() {

  store.commit(
    'addproduct',
    props.product
  )
}

function remove() {

  store.commit(
    'removeproduct',
    props.product
  )
}
</script>

<style scoped>
.action-btn {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  font-weight: bold;
}

@media (max-width: 768px) {

  .fs-5 {
    font-size: 1rem !important;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }
}
</style>