import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'


import Blob from './api/iguard/excel/Blob'
import Export2Excel from './api/iguard/excel/Export2Excel.js'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import './common/filters'
// Vue.use(Element, {
//   size: store.getters.size // set element-ui default size
// })
Vue.use(Element)
    // register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})