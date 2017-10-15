<template>
  <div>
    <div class="sub-nav">
      <b-alert show dismissible variant="danger" v-if="notice[0]"> {{ notice }}: {{ search }} </b-alert>
      <input type="text" v-model="search" v-on:keyup.enter="searchHotels" placeholder="検索:">
      <button v-on:click="searchHotels">検索</button><br>
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
        検索ヒット数: {{hotels.length}}<br>
        <!-- <select v&#45;model="sort"> -->
        <!--   <option disabled value="">Please select one</option> -->
        <!--   <option>人気</option> -->
        <!--   <option>安い</option> -->
        <!-- </select> -->
        <br>
        <hr>
        <ul>
          <li v-for="hotel in hotels">
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
      hotels:         [],
      sort:           '',
      hotel:          {},
      searchResults:  false,
      searchResult:   false,
      center:         {lat: 35.68944, lng: 139.69167},
      markers:        []
    };
  },
 
  mounted:function(){
    this.getHotels();
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
    },
    searchHotels: function(){
      var vm = this;
      var hotels = JSON.parse(JSON.stringify(vm.originalHotels));
      vm.notice = "";
      vm.hotels = [];
      for ( var i = 0; i < hotels.length; i++  ){
        if ( hotels[i].name.match(`${vm.search}`) ) {
          vm.hotels.push(hotels[i])
          console.log("hit!:" + i);
        } else {
          console.log("no: " + i);
        }
      };
      if ( !vm.hotels[0] ){  
        vm.notice = "検索結果なし" ;
        vm.searchResults = false;
        vm.searchResult  = false;
      } else {
        vm.searchResults = true;
        vm.searchResult  = false;
      };
      vm.mapConv();
    },
    mapConv: function(){
      var self = this;
      self.markers = [];
      for( var i = 0; i < self.hotels.length; i++){
        new Promise(function (resolve, reject) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode( { 'address': self.hotels[i].street_address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK){
              resolve( results[0].geometry.viewport );
            };
          });
        }).then(function (hoge) {
          var data = {position: {lat: hoge.f.b, lng: hoge.b.b}};
          self.markers.push(data);
        });
      };
    }
  },
}
</script>
