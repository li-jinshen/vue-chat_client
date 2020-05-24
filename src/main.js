import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false


Vue.use(new VueSocketIO({
  debug: true, //设置true可以让你的控制台文字变颜色，更好的调试阅读
  connection: 'http://localhost:3000',
}))


new Vue({
  render: h => h(App),
}).$mount('#app')
