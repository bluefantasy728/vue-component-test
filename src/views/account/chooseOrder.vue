<template>
  <div class="page">
    <div v-if="orderList.length">
      <ul class="order-list">
        <li
          v-for="item in orderList"
          :key="item.invoiceId"
          :value="item.invoiceId"
          class="order-item"
        >
          <div class="order-id">
            <span>{{item.ssOrder.orderNum}}</span>
            <el-radio class="type-radio" :label="item.ssOrder.orderNum" v-model="radio"></el-radio>
          </div>
          <div class="order-intro">
            <div class="intro-clause">
              <span>维修项目</span>
              <span>{{item.ssOrder.maintainPro}}</span>
            </div>
            <div class="intro-clause">
              <span>备注说明</span>
              <span>{{item.ssOrder.maintainExplain}}</span>
            </div>
            <div class="intro-clause">
              <span>详细地址</span>
              <span>{{item.ssOrder.address}}</span>
            </div>
            <div class="intro-clause">
              <span>下单时间</span>
              <span>{{item.ssOrder.orderTime}}</span>
            </div>
          </div>
          <div class="order-price">订单金额：{{item.ssOrderCostVo.settlementCost}}元</div>
        </li>
      </ul>

      <el-button @click="back2receipt" class="btn-primary">确认</el-button>
    </div>
    <div v-else style="text-align:center;margin-top:80px">暂无数据</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  background: rgba(246, 246, 246, 1);
  padding: 12px 16px 50px;
  font-family: $font-md;
  .order-list {
    .order-item {
      color: #2b2b2b;
      display: flex;
      flex-direction: column;
      height: 214px;
      border-radius: 6px;
      background-color: #fff;
      padding: 14px 14px 0;
      box-shadow: 0px 2px 14px 0px rgba(240, 240, 240, 0.5);
      &:not(:first-child) {
        margin-top: 14px;
      }
      .order-id {
        height: 43px;
        display: flex;
        font-size: 16px;
        line-height: 43px;
        align-items: center;
        font-family: $font-sb;
        justify-content: space-between;
        /deep/ .el-radio__label {
          display: none;
        }
      }
      .order-intro {
        height: 110px;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        font-family: $font-md;
        justify-content: center;
        @include border-1px(#dedede, top);
        @include border-1px(#dedede, bottom);
        .intro-clause {
          height: 22px;
          line-height: 22px;
          display: flex;
          justify-content: space-between;
          span:first-child {
            color: #9b9b9b;
          }
        }
      }
      .order-price {
        font-size: 16px;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .btn-primary {
    margin-top: 36px;
  }
}
</style>
<script>
import Scroll from '@/components/scroll';
import { queryAllInvoices } from '@/api/api';

export default {
  components: {
    Scroll,
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'receipt-apply') {
      let invoiceId;
      let version;
      this.orderList.map(item => {
        if (item.ssOrder.orderNum == this.radio) {
          invoiceId = item.invoiceId;
          version = item.ssOrder.version;
          return;
        }
      });
      to.params.idList = [this.radio, invoiceId, version];
    }
    next();
  },
  computed: {},
  data() {
    return {
      pageSize: 5,
      pageNum: 1,
      pullUpLoad: true,
      noMoreData: false,
      radio: '',
      orderList: [],
    };
  },
  mounted() {},
  created() {
    this.queryInvoices();
  },
  methods: {
    back2receipt() {
      this.$router.back();
    },
    async queryInvoices() {
      // type: 1:全部；2：进行中，3:已完成完成订单
      const res = await queryAllInvoices({
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      });
      if (res.success) {
        console.log(res);
        this.orderList = res.data;
      }
    },
  },
};
</script>
