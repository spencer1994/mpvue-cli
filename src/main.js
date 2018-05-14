import Vue from 'vue'
import App from '@/App'
import store from '@/store'
Vue.config.productionTip = false

const app = new Vue({
  store,
  ...App
})

app.$mount()

export default {
  config: {
    pages: [],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}
