// iBoxPlugin
import handleRequest from '@/store/flyio/request'

const utilsContext = require.context('@/plugins/ibox/utils', true, /\.js$/)
let utils = {}
utilsContext.keys().forEach((modules) => {
  utils[modules.replace(/(^\.\/)|(\.js$)/g, '')] = utilsContext(modules).default
})

export default {
  /**
   * 自定义方法
   * 组件内使用： this.$iBox.validator
   * 全局使用：Vue.iBox.validator
   */
  install (Vue) {
    const iBox = {
      ...utils,
      http: handleRequest
    }

    Vue.iBox = iBox
    Vue.prototype.$iBox = iBox
  }
}
