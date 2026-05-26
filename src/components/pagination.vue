<template>
  <nav v-if="separator > 0" aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li
        v-for="i in separator"
        :key="i"
        :class="[{ 'disabled': page === i }, 'page-item']"
      >
        <a
          class="page-link"
          href="javascript:void(0)"
          @click.prevent="goTo(i)"
        >
          {{ i }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  quantity: { type: Number, default: 0 },
  quantitytoload: { type: Number, default: 10 },
  page: { type: Number, default: 1 }
})

const emit = defineEmits(['setfrom'])
const separator = ref(0)

function updateSeparator() {
  separator.value = props.quantity > 0
    ? Math.ceil(props.quantity / props.quantitytoload)
    : 0
}

function goTo(i) {
  if (props.page !== i) {
    const from = (i - 1) * props.quantitytoload
    emit('setfrom', from, i)
  }
}

watch(() => props.quantity, updateSeparator, { immediate: true })
</script>