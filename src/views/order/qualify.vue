<style lang="scss" scoped>
@import '@/scss/variables.scss';
.page {
  background: #f6f6f6;
  padding: 14px 16px;
}
.form-block {
  .title {
    color: #2b2b2b;
    font-size: 16px;
  }
  .qualify-remark {
    color: #9b9b9b;
    margin: 17px 0 14px 0;
  }
  li {
    margin-bottom: 15px;
    color: #2b2b2b;
  }
  .qualify-icon {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    margin-right: 16px;
    float: left;
  }
  .top {
    margin: 20px 0;
    border-bottom: 1px solid #f1f1f1;
  }
  .master-name {
    font-size: 16px;
  }
  .id {
    font-size: 10px;
    color: #9b9b9b;
  }
  /deep/ .el-textarea__inner {
    height: 66px;
    border: 0;
    padding: 0;
    &::-webkit-input-placeholder {
      font-size: 12px;
    }
  }
}
.el-button--primary {
  width: 315px;
  height: 48px;
  background: $primary;
  border-radius: 9px;
  margin-top: 36px;
}
.el-checkbox {
  margin: 0;
  color: #2b2b2b;
}
</style>
<template>
  <div class="page">
    <div class="content">
      <div class="form-block">
        <div class="title">项目验收</div>
        <p class="qualify-remark">请确认师傅是否符合以下工作标准：</p>
        <el-checkbox v-for="(item,index) in standard" :key="index" v-model="item.data">{{item.des}}</el-checkbox>
      </div>
      <div class="form-block">
        <div class="top clearfix">
          <div class="top-left fl avatar-item">
            <div class="fl">
              <p class="bold">工人评分</p>
            </div>
          </div>
          <div class="top-right fr">
            <el-rate v-model="appraiseWorkerScore"></el-rate>
          </div>
        </div>
        <el-input
          type="textarea"
          resize="none"
          placeholder="说说您对工人的评价"
          v-model="appraiseWorkerContent"
        ></el-input>
      </div>
      <div class="form-block">
        <div class="top clearfix">
          <div class="top-left fl avatar-item">
            <div class="fl">
              <p class="bold">平台评分</p>
            </div>
          </div>
          <div class="top-right fr">
            <el-rate v-model="appraisePlatformScore"></el-rate>
          </div>
        </div>
        <el-input
          type="textarea"
          resize="none"
          placeholder="说说盛达星修的优点和美中不足的地方吧"
          v-model="appraisePlatformContent"
        ></el-input>
        <!-- <div class="title">平台评分</div>
        <el-input type="textarea" resize="none" placeholder="说说盛达星修的优点和美中不足的地方吧"></el-input>-->
      </div>
      <!-- <div class="confirm-qualify">确认验收</div> -->
      <el-button type="primary" @click="toQualify">确认验收</el-button>
    </div>
  </div>
</template> 
<script>
import { updateWorkerAppraises, queryWorkerAppraises } from '@/api/api';
export default {
  components: {},
  computed: {
    workingStandard() {
      let arr = [];
      for (let i = 0; i < this.standard.length; i++) {
        if (this.standard[i].data) {
          arr.push(i + 1);
        }
      }
      return arr.join(';');
    },
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      version: '',
      appraiseWorkerScore: 0, // 评价工人评分：1-5
      appraiseWorkerContent: '', // 评价工人内容
      appraisePlatformScore: 0, // 评价平台评分：1-5
      appraisePlatformContent: '', // 评价平台内容
      standard: [
        {
          data: false,
          des: '准时到达维修现场',
        },
        {
          data: false,
          des: '身穿工作服、自带鞋套',
        },
        {
          data: false,
          des: '维修开始前再次确认维修内容及报价',
        },
        {
          data: false,
          des: '维修完毕后清洁现场垃圾',
        },
        {
          data: false,
          des: '维修完毕后说明其他注意事项',
        },
      ],
    };
  },
  mounted() {
    this.queryWorkerAppraises();
  },
  methods: {
    async queryWorkerAppraises() {
      const res = await queryWorkerAppraises({
        urlSuffix: '/' + this.orderId,
      });
      if (res.success && res.status === '200') {
        this.version = res.data.version;
      } else {
        this.$message.error('获取评价信息失败！');
      }
    },
    async toQualify() {
      const res = await updateWorkerAppraises({
        urlSuffix: '/' + this.orderId,
        params: {
          version: this.version,
          appraiseWorkerScore: this.appraiseWorkerScore,
          appraiseWorkerContent: this.appraiseWorkerContent,
          appraisePlatformScore: this.appraisePlatformScore,
          appraisePlatformContent: this.appraisePlatformContent,
          workingStandard: this.workingStandard,
        },
      });
      if (res.success && res.status === '200') {
        this.$message.success('验收成功！');
        setTimeout(() => {
          this.$router.push({
            name: 'order-detail',
            params: {
              orderId: this.orderId,
            },
          });
        }, 1000);
      }
    },
  },
};
</script>
