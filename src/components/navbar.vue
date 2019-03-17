<template>
  <div class="navbar" v-if="!isNotWx">
    <template v-for="(item, index) in navList">
      <router-link :key="index" class="item" :to="item.path">
        <i :class="'iconfont ' + item.icon"></i>
        <span class="text">{{ item.name }}</span>
      </router-link>
    </template>
  </div>
</template>

<script>
import { ua } from '@/utils/utils';
export default {
  data() {
    return {
      navList: [
        {
          name: '预约',
          path: '/book',
          icon: 'icon-icon_yuyue',
        },
        {
          name: '订单',
          icon: 'icon-icon_order',
          path: '/order',
        },
        {
          name: '我的',
          icon: 'icon-icon_my',
          path: '/account',
        },
        {
          name: '关于',
          icon: 'icon-icon_about',
          path: '/about',
        },
      ],
    };
  },
  computed: {
    isNotWx() {
      return ua.isWeixin;
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import '@/scss/variables.scss';
.navbar {
  padding: 0 48px;
  display: flex;
  align-items: center;
  font-weight: bold;
  // font-family: $font-bd;
  justify-content: space-between;
  width: 100%;
  // height: 96px;
  height: 60px;
  // position: fixed;
  // z-index: 99;
  bottom: 0;
  box-shadow: 0px 0px 16px#f0f0f0;
  box-sizing: border-box;
  border-radius: 0px 0px 19px 19px;
  flex-shrink: 0;
  border: 1px solid rgb(214, 214, 214);
  .item {
    text-align: center;
    color: #a9b4c0;
    display: inline-block;
  }
  .iconfont {
    font-size: 30px;
    font-weight: normal;
  }
  i {
    font-size: 36px;
    line-height: 36px;
    display: block;
    margin-top: -4px;
  }
  span {
    display: block;
    font-size: 12px;
    // position: relative;
    // top: -3px;
    // margin-top: -5px;
  }
  .router-link-active {
    color: #33353a;
  }
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .navbar {
    height: 96px;
    padding-bottom: 36px;
  }
}
</style>
