// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './config/router.js'
import store from './config/store.js'
import wxsdk from './config/wxsdk.js'
import util from './assets/js/util.js'
import vuePlugin from './assets/js/vue-plugin.js'
import QRCode from 'qrcode'
import scroll from 'vue-seamless-scroll'

import { ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(vuePlugin)
Vue.use(scroll)


// Vue.prototype.host = "http://47.105.59.207:29090/zt-wx";
Vue.prototype.http = util.http;
Vue.prototype.getUrlParam = util.getUrlParam;
Vue.prototype.wxsdk = wxsdk;


wxsdk.initConfig(location.href.split('#')[0]);


FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
