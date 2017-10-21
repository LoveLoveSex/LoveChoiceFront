<template>
  <div>
    <div class="sub-nav">
      <input v-model="search" placeholder="Search:">
    </div>
    <div class="main">
      <div class="searchResults">
        並び替え:<br>
        <ul v-model="sort" class="sort">
          <li v-on:click="sorting('popularity')"   :class="{active: inActivePropularity}">人気</li>
          <li v-on:click="sorting('weekday-rest')" :class="{active: inActiveWeekdayRest}">休憩(平日)</li>
          <li v-on:click="sorting('holiday-rest')" :class="{active: inActiveHolidayRest}">休憩(休日)</li>
          <li v-on:click="sorting('weekday-stay')" :class="{active: inActiveWeekdayStay}">宿泊(平日)</li>
          <li v-on:click="sorting('holiday-stay')" :class="{active: inActiveHolidayStay}">宿泊(休日)</li>
        </ul>
        <hr>
        <ul>
          <li v-for="(hotel, index) in hotelsList" v-bind:key="hotel.name" v-bind:data-index="hotel.id">
            <div class="hotel">
              <nuxt-link :to="'/hotels/'+hotel.hotel.id">{{hotel.hotel.name}}</nuxt-link><br>
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
// import axios from 'axios'
import axios from '~/plugins/axios'
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
      inActivePropularity: false,
      inActiveWeekdayRest: false,
      inActiveHolidayRest: false,
      inActiveWeekdayStay: false,
      inActiveHolidayStay: false,
    };
  },
  mounted:function(){
    this.getHotels();
  },
  computed: {
    hotelsList: function () {
      var vm = this;
      vm.markers = [];
      console.log("DONE");
      if ( vm.search[0] ){
        vm.filteredHotels = this.originalHotels.filter(function (hotel) {
          if ( hotel.hotel.name.match(`${vm.search}`) ) {
            vm.mapConv(hotel.hotel.street_address);
            return true
          }
        });
        vm.inActivePropularity = false;
        vm.inActiveHolidayRest = false;
        vm.inActiveHolidayStay = false;
        vm.inActiveWeekdayRest = false;
        vm.inActiveWeekdayStay = false;
        switch (vm.sort) {
          case "popularity":
            vm.inActivePropularity = true;
            console.log("popularity");
            vm.filteredHotels.sort(function(a,b){
              console.log(a.hotel.access_count);
              if( a.hotel.access_count > b.hotel.access_count ){ return -1 };
              if( a.hotel.access_count < b.hotel.access_count ){ return 1 };
              return 0;
            });
          break;
          case "weekday-rest":
            console.log("weekday-rest");
            vm.inActiveWeekdayRest = true;
            vm.filteredHotels.sort(function(a,b){
              console.log(a.service[0].money);
              if( a.service[0].money < b.service[0].money ){ return -1 };
              if( a.service[0].money > b.service[0].money ){ return 1 };
              return 0;
            });
          break;
          case "weekday-stay":
            vm.inActiveWeekdayStay = true;
            vm.filteredHotels.sort(function(a,b){
              console.log(a.service[1].money);
              if( a.service[1].money < b.service[1].money ){ return -1 };
              if( a.service[1].money > b.service[1].money ){ return 1 };
              return 0;
            });
          break
          case "holiday-rest":
            vm.inActiveHolidayRest = true;
            vm.filteredHotels.sort(function(a,b){
              console.log(a.service[2].money);
              if( a.service[2].money < b.service[2].money ){ return -1 };
              if( a.service[2].money > b.service[2].money ){ return 1 };
              return 0;
            });
          break
          case "holiday-stay":
            vm.inActiveHolidayStay = true;
            vm.filteredHotels.sort(function(a,b){
              console.log(a.service[3].money);
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
      axios.get(`/hotels`).then(function(res){
        self.originalHotels = res.data;
      })
    },
    sorting: function(value) {
      var vm = this;
      console.log(value);
      vm.sort = value;
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
