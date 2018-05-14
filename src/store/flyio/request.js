import Flyio from './interceptors'
import API from './apiUrl'

// 异常情况的错误处理
const errorFunction = (reqConfig, err) => {
  // 如果有异常需要提示
  if (!reqConfig.errorAction && reqConfig.isErrorDefaultTip) {
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
  }
  throw (err)
}

let promises = [] // 接收接口请求的promise数组
let loadingTimer = [] // loading的定时器

// 接口请求封装函数
const handleRequest = (url = '', data = {}) => {
  let _url = API[url] || ''
  return (flyConfig = {}, tipConfig = {}) => {
    let flyio = Flyio.request(_url, data, {
      method: 'post',
      ...flyConfig
    })

    // 开启loading
    clearTimeout(loadingTimer) // 多个接口时需要清除上一个loading
    loadingTimer = setTimeout(() => {
      tipConfig.isLoading && wx.showNavigationBarLoading()
    }, 200)

    // 计算当前的promise是否全部加载完成
    promises.push(flyio.catch(e => {}))
    Promise.all(promises).then(data => {
      if (data.length !== promises.length) return
      promises = [] // 所有请求完后清除promise数组
      clearTimeout(loadingTimer) // 当请求在xxxms内完成则直接清除loading计时器
      tipConfig.isLoading && wx.hideNavigationBarLoading() // 当promise全部加载完成则隐藏loading
    })

    return flyio.then(res => {
      // 成功返回
      if (res.returnCode === '0') {
        return res
      } else {
        errorFunction(tipConfig, res)
      }
    }).catch(err => {
      errorFunction(tipConfig, err)
    })
  }
}

export default handleRequest
