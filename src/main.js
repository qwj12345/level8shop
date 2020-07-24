import Vue from 'vue'
import App from './App'
// var mta= require('./utils/mta_analysis.js')

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
// App({
//     onLaunch: function () {
        // mta.App.init({
        //     "appID":"500717591",
        //     "autoReport": true,
        //     "statParam": true,
        //     "ignoreParams": [],
        //     "autoReport": true, //开启自动上报
        //     "statParam": true, //每个页面均加入参数上报
        // });
  
//     }
//   })