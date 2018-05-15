# 根据官方的cli封装了一系列的开发基础。

主要的开发便利包含如下：

> 1. 使用了[mpvue-entry](https://github.com/F-loat/mpvue-entry)

优点：去除了各个子页面的main.js，创建了router文件夹，使开发更贴近vue风格。

缺陷：每新增一个页面都需要重新npm run dev，[官方文档](http://mpvue.com/qa/#_2)有说明原因。

> 2. 自动注册store

优点：多人协作开发不需要担心代码冲突，不需要每个store.js都要import引入。

> 3. 使用[flyio](https://wendux.github.io/dist/#/doc/flyio-en/readme)并封装了请求，

优点：根据[vuex官方推荐](https://vuex.vuejs.org/zh-cn/intro.html)，将background API封装到actions中，具体用法可在代码里查看。

以下使关于第二点的说明：
# 根据webpack的require.context及store的registerModule方法来自动注册store的modules

>在src下增加store文件夹。具体目录如下
``` js
  |__src
    |__store
      |__modlues
        |__counter.js
        |__demo.js
      |__index.js
```

>index.js的代码如下：
``` js
// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({})

const storeContext = require.context('@/store/modules', true, /\.js$/)

storeContext.keys().forEach((modules) => {
  store.registerModule(modules.replace(/(^\.\/)|(\.js$)/g, ''), storeContext(modules).default)
})

Vue.prototype.$store = store
export default store

```

>src/main.js代码如下：
``` js
import Vue from 'vue'
import App from './App'
import store from '@/store'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  store,
  App
})
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/logs/main',
      '^pages/index/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}

```

> 在页面中使用如下

在单独的页面store.js中增加了namespaced:true。需要根据文件名来区分state及commit，这样子不同的store中的方法重名也不需要担心出错了。下面的例子只是简单根据官方demo写了一下，具体使用可以加actions，使用vuex的mapState、mapActions辅助函数方便使用。

``` js
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      count: state => state.counter.count
    })
  },
  methods: {
   ...mapActions('counter', [
      'increment',
      'decrement'
    ])
  }
}
```
