import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

import IboxPlugin from '@/plugins/ibox'
Vue.use(IboxPlugin)

Vue.mixin({
  onUnload () {
    if (this.$options.data) {
      Object.assign(this.$data, this.$options.data()) // 重置组件数据状态
    }
  }
})

const app = new Vue({
  store,
  ...App
})

app.$mount()
