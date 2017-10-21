<template>
  <div class="sub-nav">
    <h3>{{ hotel.name }}</h3>
    <p>{{ hotel.summary }}</p>
    <a :href="hotel.hotel_url">{{hotel.hotel_url}}</a>

    <h4>値段</h4>
    <ul>
      <li v-for="service in services">{{ service.name }}: {{ service.money }}</li>
    </ul>
    <p>未設定箇所は0と表記されます</p>
  </div>
</template>

<script>
import axios from 'axios'
export default{
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData ({ params, error }) {
    try {
      const { data } = await axios.get(`http://localhost:4567/hotel/${+params.id}`)
      return data
    } catch (e) {
      error({ message: 'Hotel not found', statusCode: 404 })
    }
  }
}
</script>
