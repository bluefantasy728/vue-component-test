<template>
  <div class="page">
    <div class="form-block">
      <div class="orderid">订单号{{orderNum}}</div>
      <el-form label-position="left" label-width="80px">
        <el-form-item label="维修项目">
          <p>{{maintainPro}}</p>
        </el-form-item>
        <el-form-item label="维修说明">
          <p>{{maintainExplain}}</p>
        </el-form-item>
      </el-form>
    </div>

    <div class="steps form-block">
      <steps :stepsList="statusList"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  padding: 14px 16px;
  background-color: #f6f6f6;
  .orderid {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    @include border-1px(#dedede, bottom);
  }
}
</style>

<script>
import steps from '@/components/steps.vue';
import { flowLog, orderFlowLog } from '@/api/api';
export default {
  components: { steps },
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {
    statusList() {
      return this.progressList.map((item, index) => {
        // description是5的时候，代表进行中，需要显示师傅头像
        if (item.description === '5') {
          return Object.assign({}, item, {
            operationDate: this.moment(item.operationDate),
            showAvatar: true,
          });
        } else {
          return Object.assign({}, item, {
            operationDate: this.moment(item.operationDate),
          });
        }
      });
    },
  },
  data() {
    return {
      progressList: [
        // {
        //   descriptionDetail: 'hahhhh',
        //   operationDate: 1551239419000,
        // },
        // {
        //   descriptionDetail: 'hahhhh',
        //   showAvatar: true,
        //   operationDate: 1551239419000,
        // },
        // {
        //   descriptionDetail: 'hahhhh',
        //   operationDate: 1551239419000,
        // },
      ],
      orderNum: this.$route.params.orderNum,
      maintainPro: '',
      maintainExplain: '',
      worker: [],
    };
  },
  mounted() {
    // this.getFlowLog();
    this.getLocalOrderInfo();
    this.getWorker();
  },
  methods: {
    // async getFlowLog() {
    //   const res = await flowLog({
    //     urlSuffix: '/' + this.orderNum,
    //   });
    //   if (res.success) {
    //     this.progressList = res.data;
    //   }
    // },
    // 获取localstorage里的维修项目名称和维修说明
    getLocalOrderInfo() {
      this.maintainPro = this.$storage.get('STARSERVICE_MAINTAIN_PRO');
      this.maintainExplain = this.$storage.get('STARSERVICE_MAINTAIN_EXPLAIN');
    },
    async getWorker() {
      const res = await orderFlowLog({
        urlSuffix: '/' + this.orderNum,
      });
      if (res.success) {
        this.progressList = res.data;
      }
    },
  },
};
</script>
