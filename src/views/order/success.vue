<template>
  <div class="page">
    <div class="status-wrap">
      <i class="iconfont icon-icon_succeed"></i>
      <span>下单成功</span>
    </div>

    <img class="qrcode" src="~@/assets/qrcode_wx.jpg">

    <p class="tips">长按二维码关注
      <span>“盛达星修”</span>公众号
      <br>就能实时查看维修进度喔！
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  font-family: $font-md;
  text-align: center;
  height: 100%;
  padding-top: 20%;
  font-size: 16px;
}

.status-wrap {
  color: $primary;
  font-family: $font-sb;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;

  .iconfont {
    font-size: 100px;
  }
}

.qrcode {
  width: 160px;
  margin-bottom: 26px;
}

.tips {
  line-height: 1.5;
  span {
    color: $primary;
  }
}
</style>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
