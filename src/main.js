import Vue from 'vue';
import storage from 'store';
import ElementUI from 'element-ui';
import Cookies from 'js-cookie';
import VConsole from 'vconsole';

import App from './app.vue';
import router from './router';
import store from './store';
import http from './api/http';
// import utils from './utils';
import config from './config';
import './directive';
import './components';
import './mixins';
import './scss/global.scss';

import showSwiper from './components/showSwiper/showSwiper';
import showDialog from './components/showDialog/showDialog';

Vue.config.productionTip = false;
Vue.prototype.$storage = storage;
Vue.prototype.$http = http;
// Vue.prototype.$utils = utils;
Vue.prototype.$config = config;
Vue.prototype.$showSwiper = showSwiper;
Vue.prototype.$showDialog = showDialog;

Vue.use(ElementUI);

// var vConsole = new VConsole();

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
