
import Vue from 'vue'
import App from './App.vue'

//import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSimpleAlert from "vue-simple-alert";
import Unicon from 'vue-unicons'
import { uniEdit } from 'vue-unicons/src/icons'
import vuetify from './plugins/vuetify';

import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VueCharts from 'vue-chartjs'
Vue.use(require('vue-moment'));
Vue.use(PerfectScrollbar)
Unicon.add([uniEdit])
Vue.use(Unicon)
Vue.use(VueCharts)
Vue.use(VueSimpleAlert);

Vue.use(VueAxios, axios)
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
export const bus = new Vue();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
