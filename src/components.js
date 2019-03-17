import Vue from 'vue';

function load(path) {
  return () => import(`@/components/${path}.vue`);
}

Vue.component('navbar', load('navbar'));
Vue.component('topheader', load('topheader'));
