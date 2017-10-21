module.exports = {
  cache: true,
  modules: [
    '@nuxtjs/bootstrap-vue',
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]
  },
  css: [
    '~/assets/css/base.css',
  ]
}
