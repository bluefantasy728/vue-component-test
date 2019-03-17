import Vue from 'vue';

Vue.directive('onfocus', {
  update(el) {
    el.children[0].focus();
  },
});
