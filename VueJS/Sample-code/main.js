import Vue from 'vue';
import Vuelidate from "vuelidate";

import store from './app/store';
import router from './app/app.routes';

import App from './app/app.vue';

import './main.scss';

Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
