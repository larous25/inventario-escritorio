<template>
  <nav
    v-if="separator > 0"
    aria-label="Page navigation"
    class="mt-4"
  >

    <ul
      class="pagination justify-content-center flex-wrap gap-2"
    >

      <!-- PREVIOUS -->
      <li
        class="page-item"
        :class="{ disabled: page <= 1 }"
      >

        <button
          class="page-link rounded-pill px-3"
          @click="goTo(page - 1)"
          :disabled="page <= 1"
        >
          ←
        </button>

      </li>

      <!-- PAGES -->
      <li
        v-for="i in separator"
        :key="i"
        class="page-item"
      >

        <button
          class="page-link rounded-pill px-3"
          :class="{
            active: page === i
          }"
          @click="goTo(i)"
        >
          {{ i }}
        </button>

      </li>

      <!-- NEXT -->
      <li
        class="page-item"
        :class="{ disabled: page >= separator }"
      >

        <button
          class="page-link rounded-pill px-3"
          @click="goTo(page + 1)"
          :disabled="page >= separator"
        >
          →
        </button>

      </li>

    </ul>

  </nav>
</template>

<script setup>
import {
  ref,
  watch
} from 'vue'

const props = defineProps({

  quantity: {
    type: Number,
    default: 0
  },

  quantitytoload: {
    type: Number,
    default: 10
  },

  page: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits([
  'setfrom'
])

const separator = ref(0)

function updateSeparator() {

  separator.value =
    props.quantity > 0
      ? Math.ceil(
          props.quantity /
          props.quantitytoload
        )
      : 0
}

function goTo(i) {

  if (
    i < 1 ||
    i > separator.value ||
    props.page === i
  ) return

  const from =
    (i - 1) *
    props.quantitytoload

  emit('setfrom', from, i)
}

watch(
  () => props.quantity,
  updateSeparator,
  { immediate: true }
)
</script>

<style scoped>
.page-link {
  border: none;
  min-width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 500;

  transition: 0.2s ease;
}

.page-link:hover {
  transform: translateY(-1px);
}

.page-link.active {
  background-color: #0d6efd;
  color: white;
}

.page-item.disabled .page-link {
  opacity: 0.5;
}

@media (max-width: 768px) {

  .page-link {
    min-width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
}
</style>