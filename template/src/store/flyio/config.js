const LOADING_LIMIT_TIME = 500
export default {
  // 关于接口loading的配置
  loading: {
    limitTime: LOADING_LIMIT_TIME // 接口请求在xxxms内完成则不展示loading
  },
  // 接口请求的默认配置
  reqConfig: {
    isLoading: true, // 是否展示loading，默认为true
    isErrorDefaultTip: true, // 是否展示默认错误提示，默认为true
    errorAction: false // 是否使用自定义的错误处理方法，默认为false，如设置true则需在views层catch错误
  },
  // fly的默认配置
  flyConfig: {
    method: 'post'
  },
  // 异常情况
  resError: {
    // 异常默认提示的方法
    tipShow: (err) => {
      setTimeout(() => {
        let error = ''
        if (err) {
          error = err.errorDesc || err.response.data.errorDesc
        }
        error = error || '请求失败，请稍后重试'
        wx.showToast({
          title: error,
          icon: 'none',
          mask: true
        })
      }, LOADING_LIMIT_TIME + 50)
    }
  }
}
