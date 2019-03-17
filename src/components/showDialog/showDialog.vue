<style lang="scss" scoped>
@import '@/scss/variables.scss';
.modal-layer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.dialog-wrapper {
  width: 100%;
  height: 246px;
  background: white;
  position: absolute;
  bottom: -246px;
  left: 0;
  transition: 0.2s transform;
  &.up {
    transform: translateY(-246px);
  }
  .top {
    height: 48px;
    position: relative;
    color: #2b2b2b;
    p {
      height: 100%;
      line-height: 48px;
      text-align: center;
    }
    .icon-icon_sclose {
      position: absolute;
      font-size: 20px;
      right: 12px;
      top: 12px;
      color: #9b9b9b;
    }
  }
  .dialog-body {
    height: 151px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;

    .icon-icon_warning {
      color: #d8d8d8;
      display: inline-block;
      font-size: 36px;
    }
  }
  .dialog-bottom {
    height: 47px;
    line-height: 47px;
    text-align: center;
    background: $primary;
    color: #ecf0f5;
  }
}
</style>

<template>
  <div class="modal-layer" @click.self="closeLayer">
    <div class="dialog-wrapper" ref="dialogWrapper">
      <div class="top">
        <p>取消订单</p>
        <i class="close fr iconfont icon-icon_sclose" @click="closeLayer"></i>
      </div>
      <div class="dialog-body">
        <i class="iconfont icon-icon_warning mr10"></i>
        <p>确认取消当前订单吗？</p>
      </div>
      <div class="dialog-bottom" @click="cancelOrder">确认取消</div>
    </div>
  </div>
</template>
<script>
import { updateOrderInfo } from '@/api/api';
export default {
  components: {},
  props: {},
  computed: {},
  mounted() {
    setTimeout(() => {
      this.$refs.dialogWrapper.classList.add('up');
    }, 0);
  },
  watch: {},
  methods: {
    async cancelOrder() {
      const res = await updateOrderInfo({
        urlSuffix: '/' + this.orderId,
        params: {
          version: this.version,
          orderStatus: '9',
        },
      });
      if (res.success) {
        this.$message('已取消该订单！');
      }
      this.closeLayer();
      this.refreshData();
      // this.reload();
    },
  },
};
</script>
