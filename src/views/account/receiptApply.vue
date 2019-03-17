<template>
  <div class="page">
    <el-form class="cell-list" label-position="left">
      <el-form-item class="cell title" label="发票信息"></el-form-item>
      <el-form-item class="cell" label="发票内容">
        <router-link to="/choose-order" class="choose" :class="orderId ? 'choosed' : ''">
          {{ orderId || '选择开票的订单' }}
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </el-form-item>
      <el-form-item class="cell receipt-type">
        <el-radio class="type-radio" v-model="radio" label="1">个人</el-radio>
        <el-radio class="type-radio" v-model="radio" label="2">公司</el-radio>
      </el-form-item>
      <el-form-item v-show="radio === '2'" class="cell" label="公司名称">
        <el-input v-model="formData.companyName" placeholder="请输入公司名称"/>
      </el-form-item>
      <el-form-item v-show="radio === '2'" class="cell" label="税号">
        <el-input v-model="formData.tfn" placeholder="请输入纳税人识别号"/>
      </el-form-item>
    </el-form>
    <el-form class="cell-list" label-position="left">
      <el-form-item class="cell title" label="邮寄信息"></el-form-item>
      <el-form-item class="cell" label="邮编">
        <el-input v-model="formData.postcode" placeholder="请输入邮编"/>
      </el-form-item>
      <el-form-item class="cell" label="详细地址">
        <el-input v-model="formData.detailAddress" placeholder="请输入详细地址"/>
      </el-form-item>
      <el-form-item class="cell" label="收件人姓名">
        <el-input v-model="formData.recipientsName" placeholder="请输入收件人姓名"/>
      </el-form-item>
      <el-form-item class="cell" label="收件人电话">
        <el-input v-model="formData.recipientsPhone" placeholder="请输入收件人电话"/>
      </el-form-item>
    </el-form>

    <el-form class="cell-list" label-position="left">
      <el-form-item class="cell title" label="邮寄方式"></el-form-item>
      <el-form-item class="cell" label="快递（到付）"></el-form-item>
    </el-form>

    <el-checkbox class="clause" v-model="isAgreed">
      我已阅读并同意
      <span class="link">《开票说明》</span>
      的全部内容
    </el-checkbox>
    <el-button class="btn-primary" @click="submit">提交</el-button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  padding: 14px 16px 30px;
  background-color: #f6f6f6;
  /deep/ .cell-list {
    [class^='el-icon-'] {
      padding-left: 4px;
    }
    .cell {
      height: 57px;
      line-height: 57px;
      .choose {
        color: #9b9b9b;
        &.choosed {
          color: #2b2b2b;
        }
      }
      .el-form-item__label {
        // min-width: 100px;
        padding-right: 0;
      }
    }
    .cell.title {
      color: #b2b2b2;
      height: 33px;
      line-height: 33px;
    }
    .receipt-type {
      .el-form-item__content {
        text-align: left;
      }
      .type-radio .el-radio__input {
        &::before {
          font-size: 20px;
        }
        height: 18px;
        width: 18px;
      }
    }
  }
  // /deep/ .clause {
  //   .el-checkbox__input {
  //     &::before {
  //       font-size: 16px;
  //     }
  //     height: 16px;
  //     width: 16px;
  //   }
  // }
}
</style>

<script>
import { updateInvoiceInfo } from '@/api/api';
import { Message } from 'element-ui';

export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'choose-order') {
      to.params.clear = true;
    }
    next();
  },
  watch: {
    '$route.params'(newVal, oldVal) {
      console.log(newVal);
      if (newVal.clear) {
        this.initData();
      }
      if (newVal.idList.length) {
        this.orderId = newVal.idList[0];
        this.formData.id = newVal.idList[1];
        this.formData.version = newVal.idList[2];
      }
    },
  },
  data() {
    return {
      radio: '1',
      isAgreed: false,
      formData: {
        companyName: '',
        tfn: '',
        postcode: '',
        detailAddress: '',
        recipientsName: '',
        recipientsPhone: '',
        id: '',
        version: '',
      },
      orderId: '',
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let data = this.formData;
      for (let k in data) {
        data[k] = '';
      }
      this.radio = '1';
      this.isAgreed = false;
    },
    validate() {
      let message = '';
      if (!this.orderId) {
        message = '请选择订单';
      } else if (
        this.radio == '2' &&
        (!this.formData.companyName || !this.formData.tfn)
      ) {
        message = '请填写公司信息';
      } else if (
        !this.formData.postcode ||
        !this.formData.detailAddress ||
        !this.formData.recipientsName ||
        !this.formData.recipientsPhone
      ) {
        message = '请填写邮寄信息';
      } else if (!this.isAgreed) {
        message = '必须先同意《盛达用户协议》';
      } else {
        return true;
      }
      Message({
        message,
        type: 'error',
      });
    },
    async submit() {
      if (!this.validate()) return;
      if (this.radio == '1') {
        this.formData.companyName = '';
        this.formData.tfn = '';
      }
      const res = await updateInvoiceInfo({
        urlSuffix: `/${this.formData.id}`,
        params: {
          ...this.formData,
          applyPhone: '18101656358',
          invoiceType: this.radio, //发票类别：1：个人:2：公司
        },
      });
      if (res.status == 200) {
        this.$router.replace({
          name: 'receipt-success',
        });
      }
    },
  },
};
</script>
