// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css

import store from './store'
import '@/permission' // permission control
import '@/icons'
import '@/utils/excelUtil'
import '@/excel/Blob.js'
import '@/excel/Export2Excel.js'

Vue.config.productionTip = false // icon

Vue.use(ElementUI, { locale })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
