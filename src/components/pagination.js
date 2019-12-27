/* globals Vue */

const ten = 10
const zero = 0

const template = `
<nav v-if="separator > 0" aria-label="Page navigation">
    <ul class="pagination justify-content-center">

        <li v-for="i in separator" v-bind:class="[ { 'disabled' : page == i } , 'page-item']" @click="goTo(i)">
			<a class="page-link" href="#">
				{{i}}
			</a>
        </li>

    </ul>
</nav> 
`

module.exports = Vue.component('pagination-component', {
  template,
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
  created () {
    if (this.quantity > zero) {
      this.separator = Math.ceil(this.quantity / ten)
    }
  },
  methods: {
    goTo (i) {
      if (this.page != i) {
        this.$emit('setfrom', i * ten - ten, i)
      }
    }
  }
})

/*
	<li v-for="i in separator" v-bind:class="[ { 'disabled' : page == 2 } , 'page-item']" @click="goTo(2)">
		<a class="page-link" href="#">
			{{2}}
		</a>
	</li>
	<li v-for="i in separator" v-bind:class="[ { 'disabled' : page == 3 } , 'page-item']" @click="goTo(3)">
		<a class="page-link" href="#">
			{{3}}
		</a>
	</li>

*/
