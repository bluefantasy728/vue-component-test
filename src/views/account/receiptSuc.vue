<template>
  <div class="page">
    <div class="status-wrap">
      <i class="iconfont icon-icon_succeed"></i>
      <span>申请成功</span>
    </div>

    <p class="tips">您申请的发票将于7个工作日后寄出</p>
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
