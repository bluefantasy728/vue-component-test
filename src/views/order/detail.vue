<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  display: flex;
  flex-direction: column;
}
.top {
  flex-shrink: 0;
  height: 79px;
  background: $primary-black;
  color: #ecf0f5;
  padding: 22px 16px;
  box-sizing: border-box;
  h5 {
    font-size: 18px;
    margin-bottom: 7px;
  }
  p {
    font-size: 10px;
  }
}
.wrapper {
  flex: 1;
  background: #f6f6f6;
  padding: 14px 16px;
  overflow: auto;
}
/deep/ {
  .el-collapse-item__header {
    position: relative;
    height: 30px;
  }
  .collapseTitle {
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: #b2b8c9;
    line-height: 30px;
    font-size: 12px;
    span:nth-child(2) {
      color: #000;
    }
  }
  .el-icon-arrow-right {
    position: absolute;
    right: -22px;
  }
  .el-collapse-item__content {
    color: #b2b8c9;
    line-height: 30px;
    font-size: 12px;
  }
}
</style>
<template>
  <div class="page">
    <router-link :to="{name: 'order-steps', params: { orderNum: orderInfo.orderNum }}">
      <div class="top">
        <div class="status clearfix">
          <h5 class="fl">{{orderStatusDes}}</h5>
          <i class="iconfont icon-icon_next fl"></i>
        </div>
        <p>{{orderStatusAction}}</p>
      </div>
    </router-link>
    <div class="wrapper">
      <div class="content">
        <div class="order-info form-block">
          <div class="title">订单信息</div>
          <el-form label-position="left" label-width="80px">
            <el-form-item label="订单号码">
              <p>{{orderInfo.orderNum}}</p>
            </el-form-item>
            <el-form-item label="联系人">
              <p>{{orderInfo.linkman}}</p>
            </el-form-item>
            <el-form-item label="联系电话">
              <p>{{orderInfo.phone}}</p>
            </el-form-item>
            <el-form-item label="详细地址">
              <p>{{orderInfo.address}}{{orderInfo.detailAddress}}</p>
            </el-form-item>
            <el-form-item label="下单时间">
              <p>{{orderInfo.orderTime}}</p>
            </el-form-item>
          </el-form>
        </div>
        <div class="order-amount form-block" v-if="!isMaster">
          <div class="title clearfix" style="border:none">
            <p class="title-name fl">订单总额</p>
            <div
              class="title-right fr"
            >{{orderCostInfo.settlementCost?orderCostInfo.settlementCost-orderCostInfo.discountsCost +' 元' : '等待报价'}}</div>
          </div>
          <el-collapse>
            <el-collapse-item
              v-for="(item, index) in orderCostInfo.orderCostPro"
              :key="index"
              title="slot"
              :name="index"
            >
              <template slot="title">
                <div class="collapseTitle">
                  <span>{{item.itemType}}</span>
                  <span>{{item.cost}} 元</span>
                </div>
              </template>
              <span>备注:</span>
              <span>{{item.remark}}</span>
            </el-collapse-item>
          </el-collapse>
          <!-- <el-form label-position="left" label-width="80px">
            <el-form-item
              v-for="(item, index) in orderCostInfo.orderCostPro"
              :key="index"
              :label="item.itemType"
            >
              <p>{{item.cost}} 元</p>
            </el-form-item>
          </el-form>-->
          <el-form
            label-position="left"
            label-width="80px"
            v-if="couponData.couponName&&couponData.discountsCost"
          >
            <el-form-item label="优惠券">
              <p>{{couponData.orderNum}} {{couponData.discountsCost}}</p>
            </el-form-item>
          </el-form>
        </div>
        <div class="repair-info form-block">
          <div class="title clearfix">
            <p class="title-name fl">维修信息</p>
            <router-link
              :to="{name: 'order-steps', params: { orderNum: orderInfo.orderNum }}"
              class="title-right fr"
            >
              查看进度
              <i class="iconfont icon-icon_next"></i>
            </router-link>
          </div>
          <el-form label-position="left" label-width="80px">
            <el-form-item label="维修项目">
              <p>{{orderInfo.maintainPro}}</p>
            </el-form-item>
            <el-form-item label="维修说明">
              <p>{{orderInfo.maintainExplain}}</p>
            </el-form-item>
          </el-form>
          <div class="photos">
            <carousel :photos="photos" :thumbnails="thumbnails"/>
          </div>
          <el-form label-position="left" label-width="80px">
            <el-form-item label="备注说明">
              <p>{{orderInfo.custRemark}}</p>
            </el-form-item>
          </el-form>
          <!-- <div class="btns-area fr">
            <order-btns :orderInfo.sync="orderInfo"/>
          </div>-->
        </div>
        <div
          class="repair-info form-block"
          v-if="orderInfo.orderStatus==='6' ||orderInfo.orderStatus==='7'||orderInfo.orderStatus==='8'"
        >
          <div class="title clearfix">
            <p class="title-name fl">完工信息</p>
          </div>
          <el-form label-position="left" label-width="80px">
            <el-form-item label="备注说明">
              <p>{{orderInfo.maintainRemark}}</p>
            </el-form-item>
          </el-form>
          <div class="photos">
            <carousel :photos="photosMaintain" :thumbnails="thumbnailsMaintain"/>
          </div>
        </div>
        <div class="btns-area fr">
          <order-btns :orderInfo.sync="orderInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import carousel from '@/components/carousel';
import orderBtns from '@/components/orderBtns';
import { queryOrderInfo, queryOrderCostInfo } from '@/api/api';
export default {
  components: { carousel, orderBtns },
  computed: {
    photos() {
      return this.orderInfo.custPhoto
        ? this.orderInfo.custPhoto.split(';')
        : [];
    },
    thumbnails() {
      return this.orderInfo.custThumbnail
        ? this.orderInfo.custThumbnail.split(';')
        : [];
    },
    photosMaintain() {
      return this.orderInfo.maintainExplain
        ? this.orderInfo.maintainExplain.split(';')
        : [];
    },
    thumbnailsMaintain() {
      return this.orderInfo.maintainThumbnail
        ? this.orderInfo.maintainThumbnail.split(';')
        : [];
    },
    couponData() {
      return {
        couponName: this.orderCostInfo.couponName,
        discountsCost: this.orderCostInfo.discountsCost
          ? '-' + this.orderCostInfo.discountsCost + ' 元'
          : '',
      };
    },
    isMaster() {
      const masterType = this.$storage.get('STARSERVICE_MASTERTYPE');
      return masterType === 'SF';
    },
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      orderId: '',
      orderInfo: {
        id: '',
        linkman: '',
        phone: '',
        address: '',
        orderTime: '',
        orderNum: '',
        custPhoto: '',
        custThumbnail: '',
        maintainExplain: '',
        custRemark: '',
        orderStatus: '',
        maintainPhoto: '',
        maintainThumbnail: '',
      },
      orderCostInfo: {},
      orderStatusDes: '',
      orderStatusAction: '',
    };
  },
  mounted() {
    this.orderId = this.$route.params.orderId;
    this.getOrderDetail();
    this.getOrderCost();
  },
  methods: {
    reload() {
      this.getOrderDetail();
    },
    async getOrderDetail() {
      const res = await queryOrderInfo({
        urlSuffix: '/' + this.orderId,
      });
      if (res.success) {
        this.orderInfo = res.data;
        this.saveLocalOrderInfo();
        this.orderStatusInfo();
      }
    },
    async getOrderCost() {
      const res = await queryOrderCostInfo({
        urlSuffix: '/' + this.orderId,
      });
      if (res.success) {
        this.orderCostInfo = res.data;
        this.CostInfo();
      }
    },
    //修改相应订单金额
    CostInfo() {
      //收费项目类别：1：上门费用、2：人工费用、3：维修费用、4：物料费用、5：管理费用、6：其他费用
      function sort_array(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
          for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j]['itemType'] >= arr[j + 1]['itemType']) {
              var temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
        return arr;
      }
      sort_array(this.orderCostInfo.orderCostPro);
      this.orderCostInfo.orderCostPro.map(item => {
        switch (item.itemType) {
          case '1':
            item.itemType = '上门费用';
            break;
          case '2':
            item.itemType = '人工费用';
            break;
          case '3':
            item.itemType = '维修费用';
            break;
          case '4':
            item.itemType = '物料费用';
            break;
          case '5':
            item.itemType = '管理费用';
            break;
          case '6':
            item.itemType = '其他费用';
            break;
        }
      });
    },
    // 存储该订单的维修项目名称和维修说明到localstorage
    saveLocalOrderInfo() {
      this.$storage.set('STARSERVICE_MAINTAIN_PRO', this.orderInfo.maintainPro);
      this.$storage.set(
        'STARSERVICE_MAINTAIN_EXPLAIN',
        this.orderInfo.maintainExplain,
      );
    },
    // 根据不同订单的状态，分配顶部订单状态和下面的动作
    orderStatusInfo() {
      // 1:待接单、2：报价中、3：报价待确认、4：派工中、5：进行中、6：已完工、7：待结算、8：已结算、9：已取消
      console.log(this.orderInfo);
      switch (this.orderInfo.orderStatus) {
        case '1':
          this.orderStatusDes = '待接单';
          this.orderStatusAction = '等待接单，请耐心等待';
          break;
        case '2':
          this.orderStatusDes = '勘查与报价';
          this.orderStatusAction = '订单正在报价，请耐心等待';
          break;
        case '3':
          this.orderStatusDes = '报价待确认';
          this.orderStatusAction = '您的订单报价已出，请尽快确认';
          break;
        case '4':
          this.orderStatusDes = '派工中';
          this.orderStatusAction = '正在安排师傅上门维修，请耐心等待';
          break;
        case '5':
          this.orderStatusDes = '进行中';
          this.orderStatusAction = '正在维修中';
          break;
        case '6':
          this.orderStatusDes = '已完工';
          this.orderStatusAction = '维修已完工，请对我们的服务进行评价';
          break;
        case '7':
          this.orderStatusDes = '待结算';
          this.orderStatusAction = '您的订单等待结算，请尽快处理';
          break;
        case '8':
          this.orderStatusDes = '已结算';
          this.orderStatusAction = '您的订单已完成';
          break;
        case '9':
          this.orderStatusDes = '已取消';
          this.orderStatusAction = '您的订单已取消';
          break;
        default:
          this.orderStatusDes = '';
          this.orderStatusAction = '';
          break;
      }
    },
  },
};
</script>
