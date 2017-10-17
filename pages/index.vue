<template>
  <div>
    <div class="sub-nav">
      <input v-model="search" placeholder="Search:">
    </div>
    <div class="main">
      <div class="searchResults">
        <select v-model="sort">
          <option disabled value="">Please select one</option>
          <option value="popularity">人気</option>
          <option value="weekday-rest">平日休憩(安い)</option>
          <option value="holiday-rest">休日休憩(安い)</option>
          <option value="weekday-stay">平日宿泊(安い)</option>
          <option value="holiday-stay">休日宿泊(安い)</option>
        </select>
        <br>
        <hr>
        <ul>
          <li v-for="(hotel, index) in hotelsList" v-bind:key="hotel.name" v-bind:data-index="hotel.id">
            <div class="hotel">
              <nuxt-link :to="'/hotels/'+hotel.hotel.id">{{hotel.hotel.name}}</nuxt-link><br>
              {{ hotel.hotel.access_count }}<br>
              {{ hotel.hotel.street_address }}<br>
            </div>
            <hr>
          </li>
        </ul>
      </div>
      <div class="map">
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
      originalHotels: [],
      filteredHotels: [],
      sort:           '',
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
      if ( vm.search[0] ){
        vm.filteredHotels = this.originalHotels.filter(function (hotel) {
          if ( hotel.hotel.name.match(`${vm.search}`) ) {
            vm.mapConv(hotel.hotel.street_address);
            return true
          }
        });
        switch (vm.sort) {
          case "popularity":
            console.log("popularity");
            vm.filteredHotels.sort(function(a,b){
              if( a.hotel.access_count > b.hotel.access_count ){ return -1 };
              if( a.hotel.access_count < b.hotel.access_count ){ return 1 };
              return 0;
            });
          break;
          case "weekday-rest":
            console.log("weekday-rest");
            vm.filteredHotels.sort(function(a,b){
              if( a.service[0].money < b.service[0].money ){ return -1 };
              if( a.service[0].money > b.service[0].money ){ return 1 };
              return 0;
            });
          break;
          case "weekday-stay":
            vm.filteredHotels.sort(function(a,b){
              if( a.service[1].money < b.service[1].money ){ return -1 };
              if( a.service[1].money > b.service[1].money ){ return 1 };
              return 0;
            });
          break
          case "holiday-rest":
            vm.filteredHotels.sort(function(a,b){
              if( a.service[3].money < b.service[2].money ){ return -1 };
              if( a.service[3].money > b.service[2].money ){ return 1 };
              return 0;
            });
          break
          case "holiday-stay":
            vm.filteredHotels.sort(function(a,b){
              if( a.service[3].money < b.service[3].money ){ return -1 };
              if( a.service[3].money > b.service[3].money ){ return 1 };
              return 0;
            });
          break
        }
        return vm.filteredHotels
      }
    }
  },
  methods: {
    getHotels: function(){
      var self = this;
      axios.get(`http://localhost:4567/hotels`).then(function(res){
        self.originalHotels = res.data;
      })
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
