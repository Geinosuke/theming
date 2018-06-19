import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import 'v-toaster/dist/v-toaster.css'
import Toaster from 'v-toaster'

Vue.use(BootstrapVue);
Vue.use(Toaster, {timeout: 5000});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
