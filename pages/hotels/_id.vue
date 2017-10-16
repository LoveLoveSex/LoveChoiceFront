<template>
  <div class="sub-nav">
    <h3>{{ name }}</h3>
    <p>{{ summary }}</p>
    <a :href="hotel_url">{{hotel_url}}</a>
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
