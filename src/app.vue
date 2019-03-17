<template>
  <div id="app">
    <transition name="slide">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive && needRefresh"></router-view>
      </keep-alive>
    </transition>

    <transition name="slide">
      <router-view v-if="!$route.meta.keepAlive && needRefresh"></router-view>
    </transition>

    <navbar v-if="$route.meta.isShowNavBar"></navbar>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { wxHadAuthorized } from './api/api';
import { Message } from 'element-ui';

export default {
  data() {
    return {
      needRefresh: true,
    };
  },
  provide() {
    return {
      refreshPage: this.refreshPage,
    };
  },
  methods: {
    ...mapMutations(['changeLoginState']),
    refreshPage() {
      this.needRefresh = false;
      this.$nextTick(() => {
        this.needRefresh = true;
      });
    },
  },
  async mounted() {},
};
</script>

<style lang="scss">
</style>
