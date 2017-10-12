<template>
	<div>
		<input type="text" v-model="search" v-on:keyup.enter="submit"><br>
		<br>
		検索ヒット数: {{hotels.length}}
		<ul>
			<li v-for="hotel in hotels">{{hotel.name}}</li>
		</ul>

	</div>
</template>

<script>
import axios from 'axios'
export default{
	data(){
		return {
			search: "",
			hotels: []
		}
	},
	methods: {
		submit: function(){
			var self = this
			axios.get(`http://localhost:4567/hotels/${this.search}`).then(function(res){
				console.log(res.data)
				self.hotels = res.data
			})
		}
	}
}
</script>
