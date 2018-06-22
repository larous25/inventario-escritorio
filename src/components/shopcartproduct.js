/* globals Vue */

const template = `
    <div class="row">

        <div class="col-md-6">
            <div>
                <small>
                Cantidad:
                </small>
                {{ product.amount }}
            </div>
            <div>
                <small> 
                    Nombre:
                </small>
                    {{ product.name }}
                </div>
            </div>
        
        <div class="col-md-3">
            {{ product.pricesale }}
        </div>
        <div class="col-md-3">
            <button class="btn" @click="add">
                <strong>
                +
                </strong>
            </button>
            <button class="btn" @click="remove">
                <strong>
                -
                </strong>
            </button>
        </div>
    </div>

`;


module.exports = Vue.component('shopproduct-component', {
	template,
	props: {
		product: Object
	},
	data : () => ({}),
	methods: {
		add() { 
			this.$store.commit('addproduct', this.product);
		},
		remove() {
			this.$store.commit('removeproduct', this.product);
		}
	}
});

