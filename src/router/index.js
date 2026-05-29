import { createRouter, createWebHashHistory } from 'vue-router'

import homeComponent from '../components/home'
import balanceComponent from '../components/balance'
import formProductComponent from '../components/formproduct'
import formSalesComponent from '../components/formsales'

const routes = [
  {
    path: '/editsale',
    name: 'editsale',
    component: formSalesComponent,
    props: true
  },

  {
    path: '/newsale',
    component: formSalesComponent
  },

  {
    path: '/editproduct',
    name: 'editproducts',
    component: formProductComponent,
    props: false 
  },

  {
    path: '/newproduct',
    component: formProductComponent
  },

  {
    path: '/products',
    name: 'products',
    component: homeComponent
  },

  {
    path: '/sales',
    name: 'sales',
    component: homeComponent
  },

  {
    path: '/balance',
    component: balanceComponent
  },

  {
    path: '/',
    redirect: '/products'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router