<template>
  <div>
    <div class="sub-nav">
      <b-alert show dismissible variant="danger" v-if="notice[0]"> {{ notice }}: {{ search }} </b-alert>
      <input v-model="search" placeholder="Search:">
    </div>
    <div class="main">
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
        <select v-model="sort">
          <option disabled value="">Please select one</option>
          <option>人気</option>
          <option>安い</option>
        </select>
        <br>
        <hr>
        <ul>
          <li v-for="(hotel, index) in hotelsList" v-bind:key="hotel.name" v-bind:data-index="index">
            <div class="hotel" v-on:click="hotelShow(hotel.id)">
              {{hotel.name}}<br>
              <a :href="hotel.hotel_url">{{hotel.hotel_url}}</a><br>
              {{hotel.street_address}}<br>
            </div>
            <hr>
          </li>
        </ul>
      </div>
      <div class="map" v-if="searchResults">
        <gmap-map :center="center" :zoom="12" style="width: 100%; height: 500px" >
          <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position" ></gmap-marker>
        </gmap-map>
      </div>
    </div>
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
      search:         "",
      notice:         "",
      originalHotels: [],
      sort:           '',
      hotel:          {},
      searchResults:  true,
      searchResult:   false,
      center:         {lat: 35.68944, lng: 139.69167},
      markers:        [],
    };
  },
  mounted:function(){
    this.getHotels();
  },
  computed: {
    hotelsList: function () {
      var vm = this;
      vm.markers = [];
      vm.notice = "";
      if ( vm.search[0] ){
        return this.originalHotels.filter(function (hotel) {
          if ( hotel.name.match(`${vm.search}`) ) {
            vm.mapConv(hotel.street_address);
            return true
          }
        });
      }
    }
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
      axios.get(`http://localhost:4567/hotels`).then(function(res){
        self.originalHotels = res.data;
      })
      console.log("Loaded");
    },
    mapConv: function(address){
      var self = this;
      new Promise(function (resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK){
            resolve( results[0].geometry.viewport );
          };
        });
      }).then(function (hoge) {
        var data = {position: {lat: hoge.f.b, lng: hoge.b.b}};
        self.markers.push(data);
      });
    }
  },
}
</script>
