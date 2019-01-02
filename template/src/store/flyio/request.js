import Flyio from './interceptors'
import API from './apiUrl'
import Config from './config'
// 异常情况的错误处理
const errorFunction = (_tipConfig, err) => {
  // 如果有异常需要提示
  if (!_tipConfig.errorAction && _tipConfig.isErrorDefaultTip) {
    Config.resError.tipShow(err)
  }
  throw (err)
}

let showLoadingTimer = null // 显示loading的定时器
let hideLoadingTimer = null // 隐藏loading的定时器

const hideLoading = (tipConfig) => {
  hideLoadingTimer = setTimeout(() => {
    tipConfig.isLoading && wx.hideLoading() // 请求完成则隐藏loading
  }, Config.loading.limitTime + 50)
  clearTimeout(showLoadingTimer) // 当请求在xxxms内完成则直接清除loading计时器
}

// 接口请求封装函数
const handleRequest = (url = '', data = {}) => {
  return (flyConfig = {}, tipConfig = {}) => {
    let _url = API[url] || ''
    let flyio = Flyio.request(_url, data, {...Config.flyConfig, ...flyConfig})

    let _tipConfig = {...Config.reqConfig, ...tipConfig}
    if (_tipConfig.isLoading) {
      // 开启loading
      clearTimeout(showLoadingTimer) // 多个接口时需要清除上一个的显示loading
      clearTimeout(hideLoadingTimer) // 多个接口时需要清除上一个的隐藏loading
      showLoadingTimer = setTimeout(() => {
        _tipConfig.isLoading && wx.showLoading({
          title: '加载中',
          mask: true
        })
      }, Config.loading.limitTime)
    }
    // 返回请求
    return flyio.then((res) => {
      hideLoading(_tipConfig)
      if (res.returnCode === '0') {
        return res
      } else {
        errorFunction(_tipConfig, res)
      }
    }).catch(err => {
      hideLoading(_tipConfig)
      errorFunction(_tipConfig, err)
    })
  }
}

export default handleRequest
