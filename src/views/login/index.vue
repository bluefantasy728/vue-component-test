<template>
  <div class="page">
    <p class="title">账户登录</p>
    <p class="sub-title">输入您的真实手机号码，完成验证登录账户</p>
    <el-form>
      <el-form-item class="cell">
        <el-input v-model="formData.userMob" maxlength="11" placeholder="请输入手机号码" type="tel"/>
      </el-form-item>
      <el-form-item class="cell">
        <el-input v-model="formData.verificationCode" maxlength="11" placeholder="请输入验证码"/>
        <el-button
          @click="sendSms"
          class="btn-inline cancel send-sms"
          type="info"
          v-if="!isSend"
        >发送验证码</el-button>
        <el-button class="btn-inline cancel send-grey" disabled type="info" v-else>{{miao}}s</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="agreed" class="clause">
          我已阅读并同意
          <span class="link" @click="$router.push('/xieyi')">《盛达用户协议》</span>
          的全部内容
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button @click="validateNlogin" class="btn-primary">验证并登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';

.send-grey {
  border-radius: 2px;
  line-height: 20px;
  position: absolute;
  right: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

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
    .clause {
      .el-checkbox__input {
        // &.is-checked::before,
        // &.is-checkbox::before {
        //   font-size: 16px;
        // }
        // &:not(.is-checked) {
        //   width: 16px;
        //   height: 16px;
        // }
      }
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

<script>
import { mapMutations } from 'vuex';
import { query } from '@/utils/utils';
import Cookies from 'js-cookie';
import { signInNUp, sendSms } from '@/api/api';
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
        loginTerm: LOGIN_TERM,
        userMob: '',
        // userMob: '15800581117', // 用户
        // userMob: '15216856520', // 师傅
        // userMob: '18601627040', // 担当
        // userMob: '11011111113', // 担当
        verificationCode: '',
      },
      isSend: false,
      miao: 59,
      timer: '',
    };
  },
  components: {},
  beforeRouteEnter(to, from, next) {
    next();
  },
  computed: {},
  mounted() {
    console.log('url:  ' + location.href);
  },
  created() {
    // 如果是微信的，没有登陆
    if (ua.isWeixin && !Cookies.get('token')) {
      const code = query('code') || '';
      this.formData.code = code;

      console.log('%c code is ======= ' + code, 'color:red;');
    } else {
      this.$delete(this.formData, 'code');
    }
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
      } else if (!this.agreed) {
        message = '必须先同意《盛达用户协议》';
      } else {
        return true;
      }
      Message({
        message,
        type: 'error',
      });
    },
    djs() {
      this.timer = setInterval(() => {
        this.miao--;
        if (this.miao == 0) {
          this.isSend = false;
          clearInterval(this.timer);
          this.miao = 59;
        }
      }, 1000);
    },
    validateNlogin() {
      if (!this.validate()) return;
      const openId = this.$route.query.openId;
      if (openId) {
        this.formData.openId = openId;
        this.$delete(this.formData, 'code');
      }
      signInNUp(
        {
          params: this.formData,
        },
        res => {
          console.log(res);
          this.setUserInfo(res.Ssuser);
          Cookies.set('token', res.userToken, { expires: TOKEN_EXPIRES });
          Cookies.set('user', res.Ssuser, { expires: TOKEN_EXPIRES });
          this.$storage.set('STARSERVICE_USERTYPE', res.Ssuser.userType);
          const masterType = res.Ssuser.masterWorkerType;
          this.$storage.set('STARSERVICE_MASTERTYPE', masterType);

          this.$message.success('手机绑定成功！');
          this.$router.go(-1);
          // const from = this.$route.query('from');
          // if (from) {

          // } else {
          //   this.$router.replace({
          //     name: 'book',
          //   });
          // }
        },
        '该手机已绑定公众号，请联系客服解除绑定',
      );
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
          this.isSend = true;
          this.djs();
        },
        '获取短信验证码失败',
      );
    },
  },
};
</script>
