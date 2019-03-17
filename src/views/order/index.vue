<style lang="scss" scoped>
@import '@/scss/variables.scss';
.el-tabs /deep/ {
  .el-tabs__header {
    height: 50px;
    background: $primary-black;
    margin: 0;
  }
  .el-tabs__nav-wrap,
  .el-tabs__nav-scroll,
  .el-tabs__nav,
  .el-tabs__item {
    height: 50px;
  }
  .el-tabs__nav {
    width: 100%;
  }
  .el-tabs__item {
    line-height: 50px;
    color: #ecf0f5;
    width: 33%;
    text-align: center;
  }
  .el-tabs__active-bar {
    background: #fcec0c;
    height: 3px;
  }
  .el-tabs__nav-wrap::after {
    background-color: $primary-black;
  }
  .el-tabs__content {
    background: #f4f4f4 !important;
  }
  .el-tab-pane {
    height: 100%;
  }
}
.order-wrapper {
  // padding: 14px 16px;
  height: 100%;
}
.no-data {
  line-height: 50px;
  text-align: center;
}
</style>
<template>
  <div class="page">
    <el-tabs class="tab-bar" v-model="activeName" :stretch="true" @tab-click="handleClickTab">
      <el-tab-pane label="全部" name="all">
        <scroll
          ref="scrollAll"
          class="order-wrapper"
          :data="orders"
          :pullUpLoad="pullUpLoad"
          :noMoreData="noMoreData"
          @scrollToEndFn="onScrollEnd"
          v-if="orders.length"
        >
          <div>
            <orderItem
              v-for="(order,index) in orders"
              :key="index"
              :orderInfo="order"
              @refreshData="refreshData"
            />
          </div>
          <div class="loading-container" v-show="!orders.length"></div>
        </scroll>
        <div v-else class="no-data">暂无数据</div>
      </el-tab-pane>
      <el-tab-pane label="进行中" name="progress">
        <scroll
          ref="scrollOnProgress"
          class="order-wrapper"
          :data="ordersOnProgress"
          :pullUpLoad="pullUpLoad"
          :noMoreData="noMoreData"
          @scrollToEndFn="onScrollEnd"
          v-if="ordersOnProgress.length"
        >
          <div>
            <orderItem v-for="(order,index) in ordersOnProgress" :key="index" :orderInfo="order"/>
          </div>
        </scroll>
        <div v-else class="no-data">暂无数据</div>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="finised">
        <scroll
          ref="scrollFinished"
          class="order-wrapper"
          :data="ordersFinished"
          :pullUpLoad="pullUpLoad"
          :noMoreData="noMoreData"
          @scrollToEndFn="onScrollEnd"
          v-if="ordersFinished.length"
        >
          <div>
            <orderItem v-for="(order,index) in ordersFinished" :key="index" :orderInfo="order"/>
          </div>
        </scroll>
        <div v-else class="no-data">暂无数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import orderItem from '@/components/orderItem';
import Scroll from '@/components/scroll';
import loading from '@/components/loading';
import { queryAllOrders } from '@/api/api';
import wx from 'weixin-js-sdk';
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.doconfig();
    });
  },
  components: {
    orderItem,
    Scroll,
    loading,
  },
  computed: {
    ordersSource() {
      if (this.orderType === '1') {
        return 'orders';
      } else if (this.orderType === '2') {
        return 'ordersOnProgress';
      } else if (this.orderType === '3') {
        return 'ordersFinished';
      }
    },
  },
  data() {
    return {
      oldTabname: 'all',
      activeName: 'all',
      orderType: '1', //1:全部；2：进行中，3:已完成完成订单
      orders: [],
      ordersOnProgress: [],
      ordersFinished: [],
      pageCount: 10,
      pageSize: 10,
      pageNum: 1,
      pullUpLoad: true,
      noMoreData: false,
    };
  },
  created() {
    this.queryOrders();
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    onPullingUp() {},
    // 滚动到底部要执行的函数，需要传到scroll组件中
    onScrollEnd() {
      // 更新数据
      if (this.pageNum >= this.pageCount) {
        this.noMoreData = true;
        return;
      }
      this.pageNum++;
      this.queryOrders();
    },
    async queryOrders() {
      // type: 1:全部；2：进行中，3:已完成完成订单
      let ordersSource = '';
      const res = await queryAllOrders({
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          type: this.orderType,
        },
      });
      if (res.success && res.status === '200') {
        console.log(res);
        this.pageCount = res.data.pages;
        this[this.ordersSource] = this[this.ordersSource].concat(res.data.list);
      } else {
        this.pageNum--;
      }
    },
    refreshData() {
      this.pageNum = 1;
      let orderData = '';

      switch (this.orderType) {
        case '1':
          orderData = 'orders';
          break;
        case '2':
          orderData = 'ordersOnProgress';
          break;
        case '3':
          orderData = 'ordersFinished';
          break;
        default:
          orderData = 'orders';
          break;
      }
      this[orderData] = JSON.parse(JSON.stringify([]));
      this.noMoreData = false;
      console.log(orderData);
      this.queryOrders();
    },
    handleClickTab(tab, event) {
      if (this.oldTabname === tab.name) {
        return; // 如果切换的新tab就是当前tab，那就return，不会刷新当前数据
      }
      this.oldTabname = tab.name;
      this.orderType = Number(tab.index) + 1 + '';
      this.refreshData();
    },
    reload() {
      // 切换的时候需要重置
      this.pageNum = 1;
      let orderData = '';
      switch (this.orderType) {
        case '1':
          orderData = 'orders';
          break;
        case '2':
          orderData = 'ordersOnProgress';
          break;
        case '3':
          orderData = 'ordersFinished';
          break;
        default:
          orderData = 'orders';
          break;
      }
      this[orderData] = JSON.parse(JSON.stringify([]));
      console.log(orderData);
      this.queryOrders();
    },
  },
};
</script>
