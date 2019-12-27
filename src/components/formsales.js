/* globals Vue */
const productstablecomponent = require('./productstable')
const paginationcomponent = require('./pagination')
const shopcartproductcomponent = require('./shopcartproduct')

const { dialog } = require('electron').remote

const { mapState } = require('vuex')

const template = `
<div>
    <div>

        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"> 
                    <router-link to="/sales" >ventas</router-link>
                </li>
                <li class="breadcrumb-item active">Editar - Crear</li>
            </ol>
        </nav>


        <h2 v-if="$route.path === '/newsale'">
            Nueva Venta
        </h2>
        <h2 v-if="$route.path === '/editsale'">
            Actualiza Venta
        </h2>

    </div>
	<div v-if="quantity <= 0" class="container">
		<p>
			Es necesario crear al menos un <strong> producto </strong> para poder crear una venta, da click en el botón para ir a crear uno.
		</p>
		
    	<router-link to="/newproduct" tag="button" class="btn btn-secondary">  +  </router-link>
	</div>
    <div v-else="quantity > 0" class="container">

        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="col-sm-12">
                    <div v-if="productshassale.length <= 0">
                        Agrega productos!!!
                    </div>

                    <ul v-else="productshassale.length > 0" class="list-group">
                        <li v-for="(i, index) in productshassale" class="list-group-item">
                            <shopcartproductcomponent :product="i" :key="index" />
                        </li>
                    </ul>

                    <div>
                        Total: 
                        <strong> {{ total }} </strong>
                    
                        Cantidad de Productos: 
                        <strong> {{ amount }} </strong>
                    </div>
                </div>

                <div class="col-sm-12">
                
                    <div class="form-group">
                        <label for="comments">Comentarios</label>
                        <textarea id="comments" class="form-control"  placeholder="comentarios" v-model="shopcart.comments"/>
                    </div>

                    <button @click="send" class="btn btn-segundary">
                        Guardar:
                    </button>

                </div>
            </div>

            <div class="col-md-6 col-sm-12">
                
                <productstablecomponent  :from="from" :quantitytoload="quantitytoload"/>
                <paginationcomponent :quantity="quantity" :quantitytoload="quantitytoload" :page="page" @setfrom="setfrom"/>
                
            </div>

        </div>
    </div>
    
    <div class="container justify-content-end">
        <div class="float-right">
        	<router-link tag="button" class="btn btn-dark btn-sm" :to="{  name: 'sales'  }">
                Atras
			</router-link>
        </div>
    </div>
</div>

`

module.exports = Vue.component('formSales-component', {
  components: {
    productstablecomponent,
    paginationcomponent,
    shopcartproductcomponent
  },
  template,
  props: {
    shopcart: {
      type: Object,
      default: () => ({
        comments: ''
      })
    }
  },
  created () {
    this.$store.commit('restartcart')

    if (this.shopcart.sale) { this.$store.dispatch('loadproductshassales', this.shopcart) }

    this.$store.dispatch('getquantity', 'PRODUCTS')
  },
  methods: {
    send () {
      if (this.amount <= 0) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['Aceptar'],
          title: 'Para guardar seleccione al menos un producto.',
          message: 'Por favor seleccione algún producto ante de guardar.'
        })

        return
      }

      let action = ''
      const data = {}
      if (this.$route.path === '/newsale') {
        action = 'sendsale'
        data.comments = this.shopcart.comments
      } else {
        action = 'updatesale'
        data.sale = this.shopcart.sale
        data.comments = this.shopcart.comments
      }

      this.$store.dispatch(action, {
        data,
        cb: (err) => {
          if (err) throw (err)

          this.$router.push('/sales')
        }
      })
    },
    setfrom (f, p) {
      this.$store.commit('setfrom', { f, p })
    }
  },
  computed: mapState([
    'productshassale',
    'amount',
    'total',
    'page',
    'quantity',
    'from',
    'quantitytoload'
  ])
})
