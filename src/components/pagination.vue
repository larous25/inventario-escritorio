<template>
<nav v-if="separator > 0" aria-label="Page navigation">
    <ul class="pagination justify-content-center">
        <li v-for="i in separator" :class="[{ 'disabled': page === i }, 'page-item']" @click="goTo(i)" :key="i">
            <a class="page-link" href="#">
                {{ i }}
            </a>
        </li>
    </ul>
</nav>
</template>

<script>
const ten = 10
const zero = 0

export default {
  name: 'PaginationComponent',
  props: {
    quantity: {
      type: Number,
      default: zero
    },
    quantitytoload: {
      type: Number,
      default: ten
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      separator: zero
    }
  },
  watch: {
    quantity: {
      immediate: true,
      handler () {
        this.updateSeparator()
      }
    }
  },
  methods: {
    updateSeparator () {
      this.separator = this.quantity > zero
        ? Math.ceil(this.quantity / ten)
        : zero
    },
    goTo (i) {
      if (this.page !== i) {
        this.$emit('setfrom', i * ten - ten, i)
      }
    }
  }
}
</script>

