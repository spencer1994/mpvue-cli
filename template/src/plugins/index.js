import handleRequest from '@/store/flyio/request'

const utilsContext = require.context('@/plugins/utils', true, /\.js$/)
let utils = {}
utilsContext.keys().forEach((modules) => {
  utils[modules.replace(/(^\.\/)|(\.js$)/g, '')] = utilsContext(modules).default
})

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$Douya.validator
   * 全局使用：Vue.Douya.validator
   */
  install (Vue) {
    const Douya = {
      ...utils,
      http: handleRequest
    }

    Vue.Douya = Douya
    Vue.prototype.$Douya = Douya
  }
}
