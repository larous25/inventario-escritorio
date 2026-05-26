<template>
<tr>
    <td scope="row">
        <button class="btn btn-secondary" @click="add">
            Agregar
        </button>
    </td>
    <td>
        <strong>
            {{ product.amount }}
        </strong>
    </td>
    <td>
        {{ product.name }}
    </td>
    <td>
        {{ product.pricesale }}
    </td>
</tr>
</template>

<script>
export default {
  name: 'ProductSaleComponent',
  props: {
    product: {
      type: Object,
      default: () => ({
        product: 0,
        precio: 0,
        priceSale: 0,
        name: '',
        tipo: '',
        amount: 0,
        sold: 0
      })
    }
  },
  methods: {
    add () {
      this.$store.commit('addproduct', this.product)
    }
  }
}
</script>

