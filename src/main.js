import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client';



Vue.config.productionTip = false


// Vue.use(new VueSocketIO({
//   debug: true, //设置true可以让你的控制台文字变颜色，更好的调试阅读
//   connection: 'http://localhost:3000',
// }))

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:3000'), //options object is Optional
})
)

new Vue({
  render: h => h(App),
}).$mount('#app')
