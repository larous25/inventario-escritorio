<template>
  <div>
    <div>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/sales">ventas</router-link>
          </li>
          <li class="breadcrumb-item active">Editar - Crear</li>
        </ol>
      </nav>

      <h2 v-if="$route.path === '/newsale'">
        Nueva Venta
      </h2>
      <h2 v-else-if="$route.path === '/editsale'">
        Actualiza Venta
      </h2>
    </div>

    <div v-if="quantity <= 0" class="container">
      <p>
        Es necesario crear al menos un <strong>producto</strong> para poder crear una venta. Da click en el botón para ir a crear uno.
      </p>
      <router-link to="/newproduct" class="btn btn-secondary"> + </router-link>
    </div>

    <div v-else class="container">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="col-sm-12">
            <div v-if="productshassale.length <= 0">
              Agrega productos!!!
            </div>

            <ul v-else class="list-group">
              <li v-for="(product, index) in productshassale" :key="index" class="list-group-item">
                <shopcartproductcomponent :product="product" />
              </li>
            </ul>

            <div>
              Total:
              <strong>{{ total }}</strong>
              Cantidad de Productos:
              <strong>{{ amount }}</strong>
            </div>
          </div>

          <div class="col-sm-12">
            <div class="mb-3">
              <label for="comments" class="form-label">Comentarios</label>
              <textarea
                id="comments"
                class="form-control"
                placeholder="comentarios"
                v-model="localComments"
              ></textarea>
            </div>

            <button @click="send" class="btn btn-secondary">
              Guardar
            </button>
          </div>
        </div>

        <div class="col-md-6 col-sm-12">
          <productstablecomponent :from="from" :quantitytoload="quantitytoload" />
          <paginationcomponent :quantity="quantity" :quantitytoload="quantitytoload" :page="page" @setfrom="setfrom" />
        </div>
      </div>
    </div>

    <div class="container justify-content-end">
      <div class="float-end">
        <router-link class="btn btn-dark btn-sm" :to="{ name: 'sales' }">
          Atrás
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import productstablecomponent from './productstable.vue'
import paginationcomponent from './pagination.vue'
import shopcartproductcomponent from './shopcartproduct.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()


const saleToEdit = computed(() => store.state.saleToEdit)


const localComments = ref('')

// Estados del store
const productshassale = computed(() => store.state.productshassale)
const amount = computed(() => store.state.amount)
const total = computed(() => store.state.total)
const page = computed(() => store.state.page)
const quantity = computed(() => store.state.quantity)
const from = computed(() => store.state.from)
const quantitytoload = computed(() => store.state.quantitytoload)

function setfrom(f, p) {
  store.commit('setfrom', { f, p })
}

async function send() {
  if (amount.value <= 0) {
    await window.electronAPI.showMessageBox({
      type: 'info',
      buttons: ['Aceptar'],
      title: 'Para guardar seleccione al menos un producto.',
      message: 'Por favor seleccione algún producto antes de guardar.'
    })
    return
  }

  const data = { 
    comments: localComments.value,
    created_by: 1,
  }
  const action = route.path === '/newsale' ? 'sendsale' : 'updatesale'
  

  if (action === 'updatesale' && saleToEdit.value) {
    data.sale = saleToEdit.value.sale // nota arreglar
    data.id = saleToEdit.id
  }

  const cleanData = JSON.parse(JSON.stringify(data))
  
  store.dispatch(action, {
    data: cleanData,
    cb: (err) => { 
      if (err) throw err
      store.commit('setSaleToEdit', null) 
      router.push('/sales')
    }
  })
}

onMounted(() => {
  store.commit('restartcart')
  if (saleToEdit.value) {
    localComments.value = saleToEdit.value.comments || ''
    store.dispatch('loadproductshassales', saleToEdit.value)
  }
  store.dispatch('getquantity', 'PRODUCTS')
})
</script>