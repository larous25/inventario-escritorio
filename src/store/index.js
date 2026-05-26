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

  isactive: true,

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
    setfrom (state, payload) {
      state.from = payload.f
      state.page = payload.p
    },

    setquantity (state, payload) {
      state.quantity = payload
    },

    desactive (state) {
      state.isactive = false
    },

    restartcart (state) {
      state.products = []
      state.productscarttemp = []
      state.pcartupdate = []
      state.pcartnoupdate = []
      state.productshassale = []
      state.amount = 0
      state.total = 0
    },

    removeproduct (state, payload) {
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

  }
})