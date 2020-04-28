感谢[@blackjack0v0](https://github.com/blackjack0v0)贡献的vue init的使用方式～

> 本项目基于mpvue@1.0.13 + mpvue-loader@1.1.4 + mpvue-entry@1.5.0 + flyio@0.6.1 构建。

> mpvue1.0.13以上的版本暂有一些未解决的bug，mpvue1.0.13比较稳定，建议等官方更新了稳定版本再进行升级。
## 基本用法
``` bash
$ npm install -g vue-cli
$ vue init spencer1994/mpvue-cli mpvuesimple
$ cd mpvuesimple
$ npm install
$ npm run dev
```

# 目录结构
```
|____build              webpack打包的环境代码
|____config             webpack打包的配置文件
|____node_modules       项目运行依赖的npm包
|____src                项目代码文件夹
 |__components          自定义公用组件
 |__pages               页面组件
 |__plugins             vue插件
   |__index.js          vue插件的注册，包含接口请求及工具utils
   |__utils             工具类及共用方法
 |__router              小程序的page.json的配置
  |__flyio          
   |__apiUrl            接口请求地址管理
   |__config            接口请求配置管理
   |__interceptors.js   接口请求拦截器
   |__request           接口请求封装（包括loading及toast，接口的定制化配置及默认配置)
  |__modules            store的管理文件
  |__index.js           实现store对modules文件下的自动注册
 |__store               vuex状态管理
 |__App.vue             小程序的App页面
 |__main.js             小程序插App入口的配置
 |__template.js         小程序插页面入口的配置
 |__app.json            小程序app.json的配置
|____static             静态资源文件夹
|____.babelrc           es6语法转换配置文件
|____.editorconfig      编辑器配置
|____.eslintignore      eslint的忽略配置
|____.eslintrc.js       eslint配置
|____.gitignore         git push忽略配置
|____.postcssrc.js      postcss插件的配置文件
|____index.html         SPA的index页面
|____package.json       npm包配置文件
|____README.md          readme文档

```

# 根据官方的cli封装了一系列的开发基础。

主要的开发便利包含如下：

> 1. 使用了[mpvue-entry](https://github.com/F-loat/mpvue-entry)

优点：去除了各个子页面的main.js，创建了router文件夹，使开发更贴近vue风格。

[2018-05-24] 更新了mpvue-entry的版本=>1.5.0，支持热更新，不需要重启。

缺陷：~~每新增一个页面都需要重新npm run dev，[官方文档](http://mpvue.com/qa/#_2)有说明原因。~~

【在2018-05-24通过更新mpvue-entry的版本解决了此缺陷】

> 2. 自动注册store

优点：多人协作开发不需要担心代码冲突，不需要每个store.js都要import引入。

> 3. 使用[flyio](https://wendux.github.io/dist/#/doc/flyio-en/readme)并封装了请求，

优点：根据[vuex官方推荐](https://vuex.vuejs.org/zh-cn/intro.html)，将background API封装到actions中，具体用法可在代码里查看。

> 4. 在package.json中增加了npm run build:dev、npm run build:test、npm run build:prod的命令

优点：可以通过process.env.PROJECT_ENV => 'dev' || 'test' || 'prod' 来判断打的是开发环境、测试环境、还是生产环境的包，在webpack.prod.conf.js的line 39已增加配置，
在打prod环境包的时候会把代码console去除，如需在生产包中显示console，需要手动改一下这个配置。

以下是关于第二点的说明：
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
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false

import plugins from '@/plugins/index'
Vue.use(plugins)

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


```

> 在页面中使用如下

在单独的页面store.js中增加了namespaced:true。需要根据文件名来区分state及commit，这样子不同的store中的方法重名也不需要担心出错了。具体使用可以加actions，使用vuex的mapState、mapActions辅助函数方便使用。

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

# 坑

1.[vue文件中不能缺少script标签](https://github.com/Meituan-Dianping/mpvue/issues/562)，否则会导致编译不了。
注：在新版本的mpvue-loader已经不会出现这个问题。

2.每个页面都要适配iphoneX，padding-bottom: 34px。可参考其他页面实现方式。注：底部无操作的话就不用将页面顶上去。

3.slot插槽数据渲染有问题 https://github.com/Meituan-Dianping/mpvue/issues/427

4.页面需要初始化data方式 Object.assign(this.$data, this.$options.data())，这个已在main.js中的全局混合中加入。如不需要则可以去除。

5.小程序所有的点击事件尽量加上nf-get-form-id组件，该组件会遇到插槽数据渲染问题，具体参照“踩坑攻略”第3条

6.需要使用'cover-view'标签在视频播放时保持显示，最外层一定要使用fixed定位

7.使用'cover-view'标签内嵌入'button'按钮, 'button'内一定要再嵌入一个'cover-view'或者'cover-image'

## release/1.0.0的更新

+ 增加了一个插件[mpvue-page-factory](https://www.npmjs.com/package/mpvue-page-factory)。具体改动可以看我项目里面fork的mpvue-page-factory。

+ 修改了mpvue1.0.13的源码，具体改动可以看我项目里面的mpvue-1.0.13。