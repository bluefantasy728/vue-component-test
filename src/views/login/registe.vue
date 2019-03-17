<style lang="scss" scoped>
@import '@/scss/variables.scss';

.page {
  padding: 40px 30px 0;
  color: #2b2b2b;
  font-family: $font-md;
  .title {
    font-size: 28px;
  }
  .sub-title {
    color: #9b9b9b;
    font-size: 14px;
    padding: 7px 0 40px;
  }
  /deep/ .el-form-item__content {
    text-align: left;
    position: relative;
    .el-input__inner {
      font-size: 16px;
      height: 100%;
    }
    .send-sms {
      border-radius: 2px;
      border-color: $primary;
      color: $primary;
      line-height: 20px;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>

<template>
  <div class="page">
    <p class="title">注册账号</p>
    <p class="sub-title">为了方便进行联系，请输入您的常用手机号码</p>
    <el-form>
      <el-form-item class="cell">
        <el-input v-model="formData.userName" placeholder="请输入您的真实姓名"/>
      </el-form-item>
      <el-form-item class="cell">
        <el-input v-model="formData.userMob" maxlength="11" placeholder="请输入手机号码" type="tel"/>
        <el-button @click="sendSms" class="btn-inline cancel send-sms">发送验证码</el-button>
      </el-form-item>
      <el-form-item class="cell">
        <el-input v-model="formData.verificationCode" maxlength="11" placeholder="请输入验证码"/>
      </el-form-item>
      <el-form-item class="mt70">
        <el-button v-if="!isSuccess" @click="validateNlogin" class="btn-primary">注册</el-button>
        <el-button v-else class="btn-primary" style="background:#04BE02;">注册成功！</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
import { mapMutations } from 'vuex';
import { query } from '@/utils/utils';
import Cookies from 'js-cookie';
import { signInNUp, sendSms, wxAuthorizeLink } from '@/api/api';
import { TOKEN_EXPIRES } from '@/config';
import { Message } from 'element-ui';
import { ua } from '@/utils/utils';

const LOGIN_TERM = ua.isWeixin
  ? 'wx'
  : ua.isAndroid
  ? 'andriod'
  : ua.isIOS
  ? 'ios'
  : '';

export default {
  data() {
    return {
      smsSent: true,
      agreed: false,
      formData: {
        code: '',
        userName: '',
        loginTerm: LOGIN_TERM,
        userMob: '',
        verificationCode: '',
        // userMob: '15216856520',
        // verificationCode: '123',
      },
      isSuccess: false,
    };
  },
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {},
  mounted() {
    const code = query('code');
    if (!code) {
      //getcode
      window.location.href = wxAuthorizeLink(
        location.protocol +
          '//' +
          location.host +
          '/app' +
          this.$route.fullPath,
      );
      return;
    }
    this.formData.code = code;
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    validate() {
      let message = '';
      if (!this.formData.userMob || !/1\d{10}$/.test(this.formData.userMob)) {
        message = '手机号有误';
      } else if (!this.smsSent) {
        message = '请先获取短信验证码';
      } else if (!this.formData.verificationCode) {
        message = '请输入短信验证码';
      } else {
        return true;
      }
      Message({
        message,
        type: 'error',
      });
    },
    async validateNlogin() {
      if (!this.validate()) return;

      const res = await this.$http.post('/sys/user/masterRegister', '', {
        params: {
          ...this.formData,
        },
      });
      this.isSuccess = true;
      // this.$message.success('注册成功');
      // this.$router.push('/login');
    },
    sendSms() {
      sendSms(
        {
          params: {
            userMob: this.formData.userMob,
          },
        },
        res => {
          Message({
            message: '发送成功',
            type: 'success',
          });
          this.smsSent = true;
          this.formData.verificationCode = res;
        },
        '获取短信验证码失败',
      );
    },
  },
};
</script>
