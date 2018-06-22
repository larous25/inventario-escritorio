/* globals Vue */

const { mapActions, mapState } = require('vuex');
const salescomponent = require('./sales');

const template = `
<div class="container">

	<table class="table table-hover table-sm">
		<thead class="thead-dark">
			<tr>
				<th scope="col"># Id</th>
				<th scope="col">TOTAL</th>
				<th scope="col">FECCHA</th>
				<th scope="col" colspan="2">
					<router-link to="/newsale" tag="button" class="btn btn-secondary">  +  </router-link>
				</th>
			</tr>
		</thead>

		<tbody>
			<salescomponent v-for="(i, index) in sales"  :sale="i" :key="index"  @load="loadsales"/>	
		</tbody>

	</table>
</div>
`;

module.exports = Vue.component('salestable-component', {
	components: {
		salescomponent
	},
	template,
	props: {
		from: {
			type: Number,
			default: 0
		},
		quantitytoload: {
			type: Number,
			default: 10
		}
	},
	created() {
		this.$store.dispatch('loadsales');
	},
	methods: mapActions(['loadsales']),
	computed: mapState([
		'page',
		'quantity',
		'sales'
	]),
	watch: {
		'from': 'loadsales'
	}
});