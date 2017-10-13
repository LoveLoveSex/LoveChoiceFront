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
		<div id="map" class="hotel-map"></div>
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDevZb3YA0sepQxginWdFI4inbIGjqh5bo&callback=initMap" async defer></script>
	</div>
</template>

<script>
import axios from 'axios'
export default{
	head: {
		// script: [
		// 	{ src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDevZb3YA0sepQxginWdFI4inbIGjqh5bo&callback=initMap' }
		// ]
	},
	data(){
		return {
			search: "",
			hotels: [],
			hotel: {},
			searchResults: false,
			searchResult: false,
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
				self.initMap()
			})
		},
		initMap: function(){
			console.log("initMap!!")
			var map;
			var marker = [];
			var infoWindow = [];
			var markerData = this.hotels;
			var self = this;

			// 地図の作成
			var mapLatLng = new google.maps.LatLng({lat: 35.68944, lng: 139.69167}); // 緯度経度のデータ作成
				map = new google.maps.Map(document.getElementById('map'), { // #sampleに地図を埋め込む
					center: mapLatLng, // 地図の中心を指定
					zoom: 9 // 地図のズームを指定
				});

				// マーカー毎の処理
				for (var i = 0; i < markerData.length; i++) {
					var geometry;
					var address = markerData[i].street_address;
					var promise = new Promise(function(resolve, reject){
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode( { 'address': address}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK){
								geometry = results[0].geometry.viewport;
								console.log(results);
								resolve(geometry);
							};
						});
					});
					promise.then(function(geometry){
						var markerLatLng = new google.maps.LatLng({lat: geometry.f.b, lng: geometry.b.b}); // 緯度経度のデータ作成
							marker[i] = new google.maps.Marker({ // マーカーの追加
								position: markerLatLng, // マーカーを立てる位置を指定
								map: map // マーカーを立てる地図を指定
							});
							infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
								content: '<div class="sample">' + markerData[i-1]['name'] + '</div>' // 吹き出しに表示する内容
							});
							marker[i].addListener('click', function() { // マーカーをクリックしたとき
								infoWindow[i].open(map, marker[i]); // 吹き出しの表示
							});
					});
				}
		}
	},

}
</script>
