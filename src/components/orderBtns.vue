<template>
  <div>
    <div class="operation-btns" v-if="userType==='YH' && orderStatus==='1'">
      <!-- 待接单 -->
      <el-button class="btn-inline" @click="modifyContact">修改联系人</el-button>
      <el-button class="btn-inline cancel" @click="toCancelOrder">取消订单</el-button>
    </div>
    <div class="operation-btns" v-if="userType==='YH' && (orderStatus==='2' ||  orderStatus==='7')">
      <!--  进行中 待结算 -->
      <el-button class="btn-inline">
        <a :href="$config.SERVICE_TEL">联系客服</a>
      </el-button>
    </div>
    <div class="operation-btns" v-if="userType==='YH' && (orderStatus==='3')">
      <!-- 报价待确认 -->
      <el-button class="btn-inline" @click="confirmQuotation">确认报价</el-button>
      <el-button class="btn-inline">
        <a :href="$config.SERVICE_TEL">联系客服</a>
      </el-button>
    </div>
    <div class="operation-btns" v-if="userType==='YH' && (orderStatus==='5')">
      <!-- 派工中 -->
      <el-button class="btn-inline" @click="scanCode">扫码签到</el-button>
      <el-button class="btn-inline">
        <a :href="$config.SERVICE_TEL">联系客服</a>
      </el-button>
      <!-- <el-button class="btn-inline cancel" @click="toCancelOrder">取消订单</el-button> -->
    </div>
    <div class="operation-btns" v-if="userType==='YH' && (orderStatus==='6')">
      <!-- 已完工 -->
      <el-button class="btn-inline" @click="qualify" v-if="isAppraised==='1'">验收评价</el-button>
      <el-button class="btn-inline cancel">
        <a :href="$config.SERVICE_TEL">投诉</a>
      </el-button>
    </div>
    <div class="operation-btns" v-if="userType==='GCB' && masterType==='DD' &&(orderStatus==='4')">
      <!-- 担当的按钮 -->
      <el-button class="btn-inline" @click="allocate">分配订单</el-button>
    </div>
    <div class="operation-btns" v-if="userType==='GCB'&& (orderStatus==='5')">
      <!-- 担当的按钮 -->
      <el-button class="btn-inline" @click="finishQualify">完工验收</el-button>
    </div>
  </div>
</template>
<script>
import { updateOrderInfo, wxConfig, workerCheckIn } from '@/api/api';
import wx from 'weixin-js-sdk';
// 1:待接单、2：报价中、3：报价待确认、4：派工中、5：进行中、6：已完工、7：待结算、8：已结算、9：已取消
export default {
  components: {},
  inject: ['reload', 'refreshPage'],
  props: {
    orderInfo: {
      type: Object,
      default: function() {
        return {
          orderStatus: '',
          linkman: '',
          phone: '',
        };
      },
    },
  },
  mounted() {
    console.log(this.isAppraised);
  },
  watch: {
    orderInfo: function(val, oldVal) {
      this._phone = val.phone;
      this._linkman = val.linkman;
    },
  },
  computed: {
    userType() {
      return this.$storage.get('STARSERVICE_USERTYPE');
    },
    masterType() {
      return this.$storage.get('STARSERVICE_MASTERTYPE');
    },
    orderStatus() {
      return this.orderInfo.orderStatus ? this.orderInfo.orderStatus : '';
    },
    isAppraised() {
      return this.orderInfo.isAppraised; // 1'：未评价、'2'：已评价
    },
  },
  data() {
    return {
      // _linkman: '',
      // _phone: '',
      _linkman: this.orderInfo.linkman,
      _phone: this.orderInfo.phone,
    };
  },
  methods: {
    // 修改联系人
    modifyContact() {
      const self = this;
      console.log(this.$data);
      console.log(this.$data._linkman);
      console.log(this._linkman);
      // return;
      const h = this.$createElement;
      console.log(this.orderInfo);
      // return;
      this.$alert('', {
        confirmButtonText: '确定',
        showCancelButton: false,
        customClass: 'input-box',
        closeOnClickModal: true,
        title: '修改联系人',
        message: h('p', null, [
          h(
            'input',
            {
              style: {
                outline: 'none',
                border: '0px',
              },
              attrs: {
                placeHolder: '输入新联系人',
                type: 'text',
                // value: self._linkman,
                value: this.orderInfo.linkman,
              },
              on: {
                input: function(ev) {
                  self._linkman = ev.target.value;
                },
              },
            },
            '',
          ),
          h('div', { style: 'height: 1px;background:#F1F1F1' }, ''),
          h(
            'input',
            {
              style: {
                outline: 'none',
                border: '0px',
              },
              attrs: {
                class: 'phone',
                placeHolder: '输入要修改的联系电话',
                type: 'text',
                value: this.orderInfo.phone,
              },
              on: {
                input: function(ev) {
                  self._phone = ev.target.value;
                },
              },
            },
            '',
          ),
          h('div', { style: 'height: 1px;background:#F1F1F1' }, ''),
        ]),
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const phone_reg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
            // if (!phone_reg.test(this._phone)) {
            //   this.$message.error('请输入正确的手机号！');
            //   return;
            // }
            const res = await updateOrderInfo({
              urlSuffix: '/' + this.orderInfo.id,
              params: {
                version: this.orderInfo.version,
                linkman: this._linkman,
                phone: this._phone,
              },
            });
            if (res.success && res.status === '200') {
              this.$emit(
                'update:orderInfo',
                Object.assign({}, this.orderInfo, {
                  linkman: this._linkman,
                  phone: this._phone,
                }),
              );
              this.$message.success('修改成功！');
            } else {
              this.$message.success('修改失败！');
            }
          }
          done();
        },
      }).then(action => {}, () => {});
    },
    // 取消订单
    toCancelOrder() {
      this.$showDialog({
        orderId: this.orderInfo.id,
        orderStatus: this.orderInfo.orderStatus,
        version: this.orderInfo.version,
        refreshData: () => {
          // this.$emit('refreshData');
          this.reload();
        },
      });
    },
    // 确认报价
    async confirmQuotation() {
      const res = await updateOrderInfo({
        urlSuffix: '/' + this.orderInfo.id,
        params: {
          orderStatus: '4',
          version: this.orderInfo.version,
        },
      });
      if (res.success && res.status === '200') {
        this.$message.success('确认报价成功！');
        // this.$emit('refreshData');
        // this.$message.success('签到成功！');
        setTimeout(() => {
          this.refreshPage();
        }, 1000);
      }
    },

    // 扫码签到
    async scanCode() {
      // 调wxconfig接口
      const url = encodeURIComponent(location.href.split('#')[0]);
      console.log(url);
      const res = await wxConfig({
        params: {
          url,
        },
      });
      const config = res.data;

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见附录1
        jsApiList: ['scanQRCode'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          success: async res => {
            // alert(JSON.stringify(res));
            console.log(res);
            const workerCode = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            // var result = data.split(',')[1]; //返回的结果是码的类型+‘,’+内容，所以要以数组分割取第二个。
            //处理自己的逻辑
            const result = await workerCheckIn({
              params: {
                orderId: this.orderInfo.id,
                workerCode,
              },
            });

            if (result.success && result.status === '200') {
              this.$message.success('签到成功！');
              setTimeout(() => {
                this.refreshPage();
              }, 1000);
            }
          },
        });
      });
      wx.error(() => {
        this.$message.error('扫码功能调取失败！');
      });
    },
    // 验收评价
    qualify() {
      this.$router.push({
        name: 'order-qualify',
        query: {
          orderId: this.orderInfo.id,
          version: this.orderInfo.version,
        },
      });
    },
    // 分配订单
    allocate() {
      this.$router.push({
        name: 'order/distribution',
        query: {
          orderId: this.orderInfo.id,
          version: this.orderInfo.version,
        },
      });
    },
    // 完工确认
    finishQualify() {
      this.$router.push({
        name: 'order/finish',
        query: {
          orderId: this.orderInfo.id,
          version: this.orderInfo.version,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/scss/variables.scss';
</style>
