<template>
<div class="container">

  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/products">
          products
        </router-link>
      </li>

      <li class="breadcrumb-item active">
        Editar - Crear
      </li>
    </ol>
  </nav>

  <h3 v-if="$route.path === '/newproduct'">
    Nuevo Producto
  </h3>

  <h3 v-else-if="$route.path === '/editproduct'">
    Actualizar Producto
  </h3>

  <form @submit.prevent="send">

    <div class="form-group">
      <label for="name">
        Nombre:
      </label>

      <input
        name="name"
        type="text"
        class="form-control"
        placeholder="Nombre"
        v-model="product.name"
      />

      <small :class="isActive ? 'd-none' : 'd-block'">
        Es necesario un nombre!
      </small>
    </div>

    <div class="form-group">
      <label for="type">
        tipo:
      </label>

      <input
        name="type"
        type="text"
        class="form-control"
        placeholder="tipo"
        v-model="product.type"
      />
    </div>

    <div class="form-group">
      <label for="amount">
        Cantidad:
      </label>

      <input
        name="amount"
        type="number"
        min="0"
        class="form-control"
        pattern="^[0-9]+"
        @input="checkifnumber($event, 'amount')"
        placeholder="Cantidad"
        v-model="product.amount"
      />
    </div>

    <div class="form-group">
      <label for="price">
        Precio:
      </label>

      <input
        name="price"
        type="number"
        step="50"
        min="0"
        class="form-control"
        pattern="^[0-9]+"
        @blur="checkifnumber($event, 'price')"
        placeholder="precio"
        v-model="product.price"
      />
    </div>

    <div class="form-group">
      <label for="pricesale">
        Precio de venta:
      </label>

      <input
        name="pricesale"
        type="number"
        step="50"
        min="0"
        class="form-control"
        pattern="^[0-9]+"
        @blur="checkifnumber($event, 'pricesale')"
        placeholder="precio de venta"
        v-model="product.pricesale"
      />
    </div>

    <div class="form-group">
      <label for="comments">
        Comentarios:
      </label>

      <textarea
        name="comments"
        class="form-control"
        placeholder="comentarios"
        v-model="product.comments"
      />
    </div>

    <button
      type="submit"
      class="btn btn-secondary"
    >
      Guardar
    </button>

  </form>

  <div class="container justify-content-end">
    <div class="float-end">

      <router-link
        class="btn btn-dark btn-sm"
        :to="{ name: 'products' }"
      >
        Atras
      </router-link>

    </div>
  </div>

</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProductFormComponent',
  props: {
    product: {
      type: Object,
      default: () => ({
        name: '',
        type: '',
        amount: 0,
        price: 0,
        pricesale: 0,
        comments: ''
      })
    }
  },
  computed: {
    ...mapState([
      'isActive'
    ])
  },
  methods: {
    async send () {
      if (!this.product.name) {
        this.$store.commit('desactive')
        return
      }

      const action =
        this.$route.path === '/newproduct'
          ? 'sendproduct'
          : 'updateproduct'

      try {
        await this.$store.dispatch(action, {
          product: this.product
        })

        this.$router.push('/products')
      } catch (err) {
        console.error(err)
      }
    },
    checkifnumber (event, property) {
      const value = event.target.value.replace(/[^\d.]/g, '')
      const number = Number(value)
      let newvalue = 0

      if (isNaN(number)) {
        newvalue = 0
      } else if (/price/.test(property)) {
        newvalue = Math.ceil(number / 50) * 50
      } else {
        newvalue = number
      }

      this.product[property] = newvalue
      event.target.value = newvalue
    }
  }
}
</script>
