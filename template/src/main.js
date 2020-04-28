import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

import plugins from '@/plugins/index'
Vue.use(plugins)

const app = new Vue({
  store,
  ...App
})

app.$mount()
