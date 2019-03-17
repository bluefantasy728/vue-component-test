<template>
  <div class="page">
    <div class="header">
      <span class="name">
        <i class="iconfont icon-icon_my"></i>
        {{ user.userName }}
      </span>
      <span class="tel">{{ user.userMobile }}</span>
    </div>

    <el-form class="cell-list" label-position="left">
      <router-link to="/order">
        <el-form-item class="cell" label="全部订单">
          <span class="iconfont icon-icon_next"></span>
        </el-form-item>
      </router-link>
      <router-link to="/account-info">
        <el-form-item class="cell" label="个人资料">
          <span class="iconfont icon-icon_next"></span>
        </el-form-item>
      </router-link>
      <div @click="receipt">
        <el-form-item class="cell" label="发票管理">
          <span class="iconfont icon-icon_next"></span>
        </el-form-item>
      </div>
      <!-- <router-link to="/receipt-apply">
        
      </router-link>-->
      <a :href="$config.SERVICE_TEL">
        <el-form-item class="cell" label="联系客服">
          <span class="iconfont icon-icon_next"></span>
        </el-form-item>
      </a>
      <router-link to="/coupons">
        <el-form-item class="cell" label="优惠卡券">
          <span class="iconfont icon-icon_next"></span>
        </el-form-item>
      </router-link>
    </el-form>
    <el-dialog title :visible.sync="dialogVisible" width="283px">
      <img class="qrcode" src="~@/assets/qrcode_wx.jpg">

      <p class="tips">
        长按二维码关注
        <span>“盛达星修”</span>公众号
        <br>完成发票申请操作吧！
      </p>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  & > * {
    padding: 0 26px;
  }

  .header {
    height: 187px;
    background: $primary-black;
    display: flex;
    color: #fff;
    font-family: $font-lt;
    flex-direction: column;
    justify-content: center;
    padding-top: 20px;
    box-sizing: border-box;
    line-height: 1.2;
    .name {
      font-size: 12px;
      display: flex;
      align-items: center;
      i {
        font-size: 30px;
      }
    }
    .tel {
      font-size: 30px;
    }
  }

  .cell-list {
    padding-top: 10px;
  }
  .qrcode {
    display: block;
    width: 160px;
    margin: auto auto 26px;
  }
  .tips {
    line-height: 1.5;
    text-align: center;
    span {
      color: $primary;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex';
import { ua } from '@/utils/utils';
export default {
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {
    ...mapState(['userInfo']),
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  mounted() {
    console.log(this);
  },
  methods: {
    receipt() {
      if (!ua.isWeixin) {
        this.dialogVisible = true;
      } else {
        this.$router.push({
          name: 'receipt-apply',
        });
      }
    },
  },
};
</script>
