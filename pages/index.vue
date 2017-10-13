<template>
	<div>
		<input type="text" v-model="search" v-on:keyup.enter="getHotels"><br>
		<br>
		<div class="searchResult" v-if="searchResult">
			<h3>{{ hotel.name }}</h3><br>
			<p>{{ hotel.summary }}</p><br>
			<a :href="hotel.hotel_url">{{ hotel.hotel_url }}</a><br>
			{{ hotel.phone_number }}<br>
			{{ hotel.street_address }}<br>
			<br>
			<span v-on:click="searchResults = true; searchResult = false">戻る</span><br>
		</div>
		<div class="searchResults" v-if="searchResults">
			検索ヒット数: {{hotels.length}}
			<ul>
				<li v-for="hotel in hotels">
					<div class="hotel" v-on:click="hotelShow(hotel.id)">
						{{hotel.name}}<br>
						<a :href="hotel.hotel_url">{{hotel.hotel_url}}</a><br>
						{{hotel.street_address}}<br>
					</div>
				</li>
			</ul>
		</div>
		<p>↓GoogleMap</p>
		<gmap-map :center="center" :zoom="7" style="width: 500px; height: 300px" >
			<gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position" ></gmap-marker>
		</gmap-map>
	</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBvWE_sIwKbWkiuJQOf8gSk9qzpO96fhfY',
		libraries: 'places', // This is required if you use the Autocomplete plugin
		}
})
export default{
	data(){
		return {
			search: "",
			hotels: [],
			hotel: {},
			searchResults: false,
			searchResult: false,
			center: {lat: 35.68944, lng: 139.69167},
			markers: [ { position: {lat: 10.0, lng: 10.0} }, ]
		};
	},
	mounted:function(){
		// this.initMap(); //initMap will execute at pageload
	},
	methods: {
		hotelShow: function(id){
			var self = this;
			self.searchResults = false;
			self.searchResult  = true;
			axios.get(`http://localhost:4567/hotel/${id}`).then(function(res){
				self.hotel = res.data;
			});
		},
		getHotels: function(){
			var self = this;
			self.searchResults = true;
			self.searchResult  = false;
			axios.get(`http://localhost:4567/hotels/${this.search}`).then(function(res){
				console.log(res.data);
				self.hotels = res.data;
				self.mapConv();
			})
		},
		mapConv: function(){
			var self = this;
			for( var i = 0; i < self.hotels.length; i++){
				new Promise(function (resolve, reject) {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode( { 'address': self.hotels[i].street_address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK){
							resolve( results[0].geometry.viewport)
						};
					});
				}).then(function (hoge) {
					var data = {position: {lat: hoge.f.b, lng: hoge.b.b}};
					self.markers.push(data);
				})
			}
			console.log(self.markers);
		}
	},
}
</script>
