import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isShowNavbar: true, // 是否显示底部导航栏
    isLogin: true,
    userInfo: {},
    itemList: [],
  },
  mutations: {
    changeLoginState(state, payload) {
      state.isLogin = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setItemList(state, payload) {
      state.itemList = payload;
    },
    setShowPage(state, payload) {
      state.isShowPage = payload;
    },
  },
  actions: {},
});
