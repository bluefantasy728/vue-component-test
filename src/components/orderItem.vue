<template>
  <div class="order-item">
    <div class="top" @click="toDetail(orderInfo.id)">
      <p class="id">{{orderInfo.orderNum}}</p>
      <div>
        <span class="status">{{orderStatusDes}}</span>
        <i class="iconfont icon-icon_next"></i>
      </div>
    </div>
    <div class="middle clearfix" @click="toDetail(orderInfo.id)">
      <div class="pic fl" :style="photoBackgrounStyle"></div>
      <div class="detail fr">
        <dl>
          <dt>维修项目</dt>
          <dd class="line1">{{orderInfo.maintainPro}}</dd>
        </dl>
        <dl>
          <dt>维修说明</dt>
          <dd class="line1">{{orderInfo.maintainExplain}}</dd>
        </dl>
      </div>
    </div>
    <div class="bottom">
      <div class="date">
        <p>{{date[0]}}</p>
        <p>{{date[1]}}</p>
      </div>
      <order-btns :orderInfo="orderInfo" @refreshData="refreshDataFn"/>
    </div>
  </div>
</template>
<script>
import orderBtns from '@/components/orderBtns';
export default {
  props: {
    isShowSelect: {
      type: Boolean,
      default: false,
    },
    orderInfo: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },

  data() {
    return {};
  },
  components: {
    orderBtns,
  },
  mounted() {},
  computed: {
    date() {
      if (this.orderInfo.orderTime) {
        return [
          this.orderInfo.orderTime.split(' ')[0],
          this.orderInfo.orderTime.split(' ')[1],
        ];
      }
      return ['', ''];
    },
    photo() {
      return this.orderInfo.custThumbnail
        ? this.orderInfo.custThumbnail.split(';')[0]
        : '';
    },
    photoBackgrounStyle() {
      if (this.photo) {
        return `backgroundImage:url(${this.photo})`;
      } else {
        return 'background:#ccc';
      }
    },
    orderStatusDes() {
      // 1:待接单、2：报价中、3：报价待确认、4：派工中、5：进行中、6：已完工、7：待结算、8：已结算、9：已取消
      switch (this.orderInfo.orderStatus) {
        case '1':
          return '待接单';
        case '2':
          return '勘查与报价';
        case '3':
          return '报价待确认';
        case '4':
          return '派工中';
        case '5':
          return '进行中';
        case '6':
          return '已完工';
        case '7':
          return '待结算';
        case '8':
          return '已结算';
        case '9':
          return '已取消';
        default:
          return '';
      }
    },
  },
  methods: {
    toDetail(orderId) {
      this.$router.push({
        name: 'order-detail',
        params: {
          orderId,
        },
      });
    },
    toQualify(orderId) {
      this.$router.push({
        name: 'order-qualify',
        params: {
          orderId,
        },
      });
    },
    toAllocate(orderId) {
      this.$router.push({
        name: 'order/distribution',
        params: {
          orderId,
        },
      });
    },
    refreshDataFn() {
      this.$emit('refreshData');
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/scss/variables.scss';
.order-item {
  width: 343px;
  height: 214px;
  box-sizing: border-box;
  padding: 14px;
  box-shadow: 0px 2px 14px 0px rgba(240, 240, 240, 0.5);
  // border: 1px solid black;
  margin-top: 14px;
  background: #fff;
  .top {
    height: 22px;
    line-height: 22px;
    margin-bottom: 17px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    .id {
      color: #2b2b2b;
      font-size: 16px;
    }
    .status {
      font-size: 13px;
      color: $primary;
    }
  }
  .middle {
    height: 86px;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 17px;
    .pic {
      height: 100%;
      width: 118px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      margin-right: 12px;
    }
    .detail {
      width: calc(100% - 12px - 118px);
    }
    dl {
      margin-bottom: 5px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }

    dt {
      color: #9b9b9b;
      flex-shrink: 0;
    }
    dd {
      color: #2b2b2b;
      text-align: right;
    }
  }

  .bottom {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      color: #9b9b9b;
      font-size: 12px;
    }
    /deep/ .operation-btns {
      .el-button {
        vertical-align: top;
      }
      .el-button + .el-button {
        margin-left: 4px;
      }
    }
  }
}
</style>
