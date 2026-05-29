import { createStore } from 'vuex'

import {
  compareids,
  findproduct
} from './helpers'

const one = 1
const zero = 0

const initstate = {
  page: one,
  quantity: zero,
  from: zero,
  quantitytoload: 10,

  options: [
    { text: 'productos', link: '/products' },
    { text: 'ventas', link: '/sales' },
    { text: 'balance', link: '/balance' }
  ],

  products: [],
  sales: [],

  isActive: true,

  saleToEdit: null,
  productToEdit: null,
  productscarttemp: [],
  pcartupdate: [],
  pcartnoupdate: [],
  productshassale: [],

  amount: zero,
  total: zero
}

export default createStore({
  state: initstate,

  mutations: {
    setfrom(state, payload) {
      state.from = payload.f
      state.page = payload.p
    },

    setquantity(state, payload) {
      state.quantity = payload
    },

    desactive(state) {
      state.isactive = false
    },

    restartcart(state) {
      state.products = []
      state.productscarttemp = []
      state.pcartupdate = []
      state.pcartnoupdate = []
      state.productshassale = []
      state.amount = 0
      state.total = 0
    },

    removeproduct(state, payload) {
      const remove = arr => {
        const i = arr.findIndex(p => compareids(p, payload))
        arr.splice(i, one)
      }

      const productcart = findproduct(state.productscarttemp, payload)

      if (productcart.amount <= one) {
        if (productcart.amount <= zero) {
          const productcart2 = findproduct(state.pcartupdate, payload)

          if (productcart2.amount <= one) {
            remove(state.pcartupdate)
          } else {
            productcart2.amount -= one
          }
        } else {
          remove(state.productscarttemp)
          findproduct(state.products, payload).amount += one
        }
      } else {
        productcart.amount -= one
        findproduct(state.products, payload).amount += one
      }
    }
  },

  actions: {
    async getquantity({ commit }, tableType) {
      try {
        const count = await window.electronAPI.getProductsCount(tableType);
        commit('setquantity', count);
      } catch (error) {
        console.error("Error al obtener la cantidad de " + tableType + ":", error);
      }
    },
    async sendproduct({ commit }, payload) {
      try {

        const productoPlano = JSON.parse(JSON.stringify(payload.product))

        await window.electronAPI.insertProduct(productoPlano)
      } catch (error) {
        console.error("Error al guardar el nuevo producto:", error)
        throw error
      }
    },

    async updateproduct({ commit }, payload) {
      try {

        const productoPlano = JSON.parse(JSON.stringify(payload.product))
        await window.electronAPI.updateProduct(productoPlano)
      } catch (error) {
        console.error("Error al actualizar el producto:", error)
        throw error
      }
    },

    async loadproducts({ commit, state }) {
      try {
        const options = {
          table: 'PRODUCTS',
          id: 'PRODUCT',
          f: state.from,
          q: state.quantitytoload
        }
        const products = await window.electronAPI.getProducts(options)
        commit('setproducts', products)
      } catch (error) { console.error(error) }
    },

    async removeproduct({ dispatch }, payload) {
      try {
        await window.electronAPI.removeProduct(payload.product)
        await dispatch('loadproducts')
      } catch (error) {
        console.error("Error al eliminar el producto:", error)
        throw error
      }
    },

    async loadproductshassales({ commit }, sale) {
      try {

        const products = await window.electronAPI.getProductsBySale(sale.sale);

        commit('setproductshassale', products);

        commit('calculateTotals');
      } catch (error) {
        console.error("Error al cargar productos de la venta:", error);
      }
    },

    async loadsales({ commit, state }, params = {}) {
      try {
        const f = params.f !== undefined ? params.f : state.from;
        const q = params.q !== undefined ? params.q : state.quantitytoload;

        const options = {
          table: 'SALES',
          id: 'SALE',
          f: f,
          q: q
        };

        const sales = await window.electronAPI.getSales(options)
        commit('setsales', sales)
      } catch (error) {
        console.error("Error al cargar las ventas:", error)
      }
    },

    async sendsale({ commit, state }, { data, cb }) {
      try {
        const cleanProducts = JSON.parse(JSON.stringify(state.productshassale));

        const salePayload = {
          products: cleanProducts,
          amount: state.amount,
          total: state.total,
          comments: data.comments,
          created_by: data.created_by
        };
        console.log("Payload de la venta a enviar:", salePayload);
        await window.electronAPI.insertSale(salePayload);

        cb(null);
      } catch (err) {
        console.error("Error al guardar la venta:", err);
        cb(err);
      }
    },

    async updatesale({ commit, state }, { data, cb }) {
      try {
        
        const cleanProducts = JSON.parse(JSON.stringify(state.productshassale));

        const salePayload = {
          sale: data.sale, // ID de la venta a actualizar
          products: cleanProducts,
          amount: state.amount,
          total: state.total,
          comments: data.comments,
          update_by: data.created_by
        };

        const result = await window.electronAPI.updateSale(salePayload);

        commit('restartcart');
        cb(null, result);
      } catch (err) {
        cb(err);
      }
    },

    async removesale({ dispatch }, id) {
        try {
          await window.electronAPI.removeSale(id)
          await dispatch('loadsales')
        } catch (error) {
          console.error("Error al eliminar la venta:", error)
          throw error
        }
      },

    },

    mutations: {
      setfrom(state, payload) {
        state.from = payload.f
        state.page = payload.p
      },

      setquantity(state, payload) {
        state.quantity = payload
      },

      setsales(state, sales) {
        state.sales = sales
      },

      setSaleToEdit(state, sale) {
        state.saleToEdit = sale;
      },

      setproducts(state, products) {
        state.products = products
      },


      setProductToEdit(state, product) {
        state.productToEdit = product
      },

      addproduct(state, product) {
        const existingProduct = state.productshassale.find(
          item => item.name === product.name
        );

        if (existingProduct) {
          existingProduct.amount += 1;
        } else {
          state.productshassale.push({
            ...product,
            amount: 1
          });
        }

        state.amount = state.productshassale.reduce((sum, item) => sum + item.amount, 0);
        state.total = state.productshassale.reduce((sum, item) => sum + (item.amount * item.pricesale), 0);
      },

      restartcart(state) {
        state.productshassale = []
        state.amount = 0
        state.total = 0
      },

      setproductshassale(state, products) {
        state.productshassale = products;
      },

      calculateTotals(state) {
        state.amount = state.productshassale.reduce((sum, item) => sum + item.amount, 0);
        state.total = state.productshassale.reduce((sum, item) => sum + (item.amount * item.pricesale), 0);
      },

      removeproduct(state, product) {
        const index = state.productshassale.findIndex(p => p.products_product === product.products_product);

        if (index !== -1) {
          const item = state.productshassale[index];

          // Si la cantidad es mayor a 1, solo restamos
          if (item.amount > 1) {
            item.amount -= 1;
            state.amount -= 1;
            state.total -= item.pricesale;
          } else {
            // Si la cantidad es 1, eliminamos el producto del array
            state.productshassale.splice(index, 1);
            state.amount -= 1;
            state.total -= item.pricesale;
          }
        }
      }

    }
  })