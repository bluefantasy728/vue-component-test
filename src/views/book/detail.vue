<template>
  <div class="page">
    <!-- <scroll ref="scroll" class="order-wrapper"> -->
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide>
        <el-form class="cell-list" label-position="left">
          <el-form-item class="cell" label="维修项目">
            <router-link
              :to="`/book-items?repairId=${$route.query.repairId}`"
              tag="span"
              :class="detailForm.maintainPro ? '' : 'unchoosed'"
            >
              {{ maintainDes || '请选择' }}
              <i class="iconfont icon-icon_next"></i>
            </router-link>
          </el-form-item>
          <el-form-item class="cell column" label="维修说明">
            <el-input v-model="detailForm.maintainExplain" placeholder="输入维修说明"/>
          </el-form-item>
          <el-form-item class="cell column">
            <!-- limit="3" -->
            <el-upload
              class="upload-list"
              :with-credentials="true"
              action
              __auto-upload="false"
              list-type="picture-card"
              __:file-list="photos"
              :before-upload="beforeAvatarUpload"
              :on-remove="onRemoveFn"
              __on-change="pictureChange"
              __multiple="true"
              :http-request="startUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form class="cell-list" label-position="left">
          <el-form-item class="cell require" label="联系人">
            <el-input type="text" maxlength="10" v-model="detailForm.linkman"/>
            <!-- <a @click="toLogin" v-else>
              <span class="bind-phone">
                <i class="iconfont icon-icon_mobile"></i>
                手机快速绑定
              </span>
            </a>-->
          </el-form-item>
          <el-form-item class="cell require" label="联系电话">
            <el-input v-model="detailForm.phone" clearable maxlength="11" type="tel"/>
          </el-form-item>
          <el-form-item class="cell require" label="所在地区">
            <!-- <el-input v-model="address" type="text"/> -->
            <el-select v-model="detailForm.address" placeholder="请选择">
              <el-option
                v-for="item in area"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="cell require" label="详细地址">
            <el-input maxlength="30" v-model="detailForm.detailAddress"/>
          </el-form-item>
          <el-form-item class="cell" label="备注说明">
            <el-input v-model="detailForm.custRemark" maxlength="30"/>
          </el-form-item>
        </el-form>
        <el-form class="cell-list">
          <el-form-item class="cell" label="优惠券">
            <div :class="detailForm.userCouponId ? '' : 'gray'" @click="chooseCoupon">
              {{detailForm.userCouponId ? detailForm.couponName: '选择优惠券'}}
              <i
                class="el-icon-error"
                v-if="couponName"
                @click.stop="deleteCoupon"
              ></i>
              <i class="iconfont icon-icon_next"></i>
            </div>
          </el-form-item>
        </el-form>
        <el-button v-if="isLogin" @click="onSubmit" class="btn-primary">提交预约</el-button>
        <el-button v-else @click="showLoginLayer" class="btn-primary">下一步</el-button>
      </swiper-slide>
    </swiper>
    <!-- </scroll> -->
    <el-dialog title="账户登录" :visible.sync="showLogin" width="90%" top="12vh" class="dialog-box">
      <!-- <p class="title">手机快速绑定</p> -->
      <p class="sub-title">输入您的真实手机号码，完成验证登录账户</p>
      <el-form>
        <el-form-item class="cell">
          <el-input v-model="loginForm.userMob" maxlength="11" placeholder="请输入手机号码" type="tel"/>
        </el-form-item>
        <el-form-item class="cell">
          <el-input v-model="loginForm.verificationCode" maxlength="11" placeholder="请输入验证码"/>
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
          <el-button @click="validateNlogin" class="btn-primary">验证并提交预约</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
.dialog-box {
}
.order-wrapper {
  height: 100%;
  /deep/ .no-more-data {
    display: none;
  }
}
.el-form-item:nth-of-type(1) {
  width: 100%;
  display: flex;
  justify-content: space-between;
  /deep/ .el-form-item__label {
    width: 30%;
    flex-shrink: 0;
    text-align: left;
  }
  /deep/ .el-form-item__content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.page {
  padding: 27px 16px 0;
  background-color: #f6f6f6;
  padding-bottom: 30px;
  // display: block;
  /deep/ .upload-list .el-upload-list__item {
    // width: 200px;
    // height: 200px;
    width: 66px;
    height: 66px;
  }
  /deep/ .el-upload-list__item-status-label {
    display: none;
  }
  /deep/ {
    .el-icon-close,
    .el-icon-close-tip,
    .el-upload-list__item-actions {
      display: none;
    }
  }
  /deep/ .cell-list {
    &:nth-child(2) {
      font-size: 14px;
      .el-form-item__label {
        font-size: 16px;
        color: #d2d2d6;
      }
    }
    &:last-child {
      .el-form-item__label,
      .el-form-item__content {
        height: 58px;
        line-height: 58px;
      }
    }
    .el-form-item__label,
    .el-form-item__content {
      height: 50px;
      font-size: 16px;
      line-height: 50px;
    }
    .el-form-item__label {
      font-size: 14px;
      color: #9b9b9b;
    }
    .el-form-item.require {
      .el-form-item__label::after {
        content: '*';
        color: red;
      }
    }
    .cell span i {
      padding-left: 10px;
    }
    .el-form-item__content span.unchoosed {
      color: #9b9b9b;
    }
    .cell.column {
      height: auto;
      .el-form-item__content {
        height: auto;
      }
      // line-height: auto;
      // padding-bottom: 20px;
      .el-input {
        width: 100%;
      }
    }
    .bind-phone {
      color: $primary;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      padding-right: 30px;
      i {
        padding-right: 4px;
        font-size: 18px;
      }
    }
  }
  .btn-primary {
    margin-top: 30px;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    height: auto;
  }
}
.dialog-box {
  .title {
    font-size: 28px;
  }
  .el-dialog {
    width: 90%;
  }
  .sub-title {
    color: #9b9b9b;
    font-size: 14px;
    padding: 7px 0 40px;
  }
  /deep/ .el-icon-close {
    display: unset;
  }
  /deep/ .el-checkbox__label {
    font-size: 12px;
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
  /deep/ .btn-primary {
    width: 100%;
  }
}
</style>

<script>
import { config, TOKEN_EXPIRES } from '@/config';
import { mapMutations } from 'vuex';
import {
  queryUserCoupons,
  tempUploadPic,
  addOrder,
  signInNUp,
  sendSms,
} from '@/api/api';
import eventBus from '../../eventBus';
import Cookies from 'js-cookie';
import { ua, query } from '@/utils/utils';
import Exif from 'exif-js';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
const acceptedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/bmp',
  'image/JPEG',
  'image/JPG',
  'image/PNG',
  'image/BMP',
];
const LOGIN_TERM = ua.isWeixin
  ? 'wx'
  : ua.isAndroid
  ? 'andriod'
  : ua.isIOS
  ? 'ios'
  : '';
export default {
  components: { swiper, swiperSlide },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.checkLogin(vm);
    });
  },
  computed: {
    custPhoto() {
      return this.photos.join(';');
    },
    maintainDes() {
      return (
        this.$storage.get('STARSERVICE_LEVEL1') +
        ' | ' +
        this.detailForm.maintainPro
      );
    },
  },
  mounted() {},
  watch: {
    $route(newVal, oldVal) {
      this.project = newVal.query.project;
      this.detailForm.maintainProId = newVal.query.repairId;
      this.changeData();
    },
  },
  data() {
    return {
      showLogin: false,
      agreed: false,
      isSend: false,
      smsSent: true,
      miao: 59,
      // isSend: true,
      loginForm: {
        // code: query('code'),
        loginTerm: LOGIN_TERM,
        userMob: '',
        // userMob: '15800581117', // 用户
        // userMob: '15216856520', // 师傅
        // userMob: '18601627040', // 担当
        // userMob: '11011111113', // 担当
        verificationCode: '',
      },
      detailForm: {
        maintainProId: '',
        maintainExplain: '',
        // custPhoto: '',
        linkman: '',
        phone: '',
        address: '上海',
        detailAddress: '',
        custRemark: '',
        userCouponId: '',
        orderSource: this.$config.ORDER_SOURCE,
      },
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar',
        },
        mousewheel: true,
        autoHeight: true,
      },
      openId: '',
      area: [
        {
          value: '上海',
          label: '上海',
        },
      ],
      photos: [],
      project: '',
      isLogin: false,
      couponName: '',
    };
  },
  created() {
    this.changeData();
    document.body.addEventListener('touchmove', this.bodyScroll, {
      passive: false,
    });
  },
  mounted() {
    const self = this;
    const imgList = document.querySelector('.el-upload-list');
    console.log(imgList);
    imgList.addEventListener(
      'click',
      function(ev) {
        const items = imgList.querySelectorAll('li');
        const target = ev.target.parentNode;
        let index = 0;
        console.log(ev.target.parentNode);
        for (let i = 0; i < items.length; i++) {
          if (items[i] === target) {
            index = i;
            break;
          }
        }
        console.log(index);
        target.style = 'opacity:0;';
        setTimeout(() => {
          imgList.removeChild(target);
          self.$nextTick(() => {
            self.photos.splice(index, 1);
          });
        }, 500);
      },
      false,
    );
  },
  destroyed() {
    document.body.removeEventListener('touchmove', this.bodyScroll, {
      passive: false,
    });
  },
  activated() {
    eventBus.$on(
      'selectCoupon',
      function(data) {
        console.log(data);
        this.detailForm.couponName = data.couponName;
        this.detailForm.userCouponId = data.userCouponId;
      }.bind(this),
    );
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    bodyScroll(event) {
      event.preventDefault();
    },
    showLoginLayer() {
      console.log(this.custPhoto);
      if (!this.validateForm()) return;
      this.showLogin = true;
    },
    checkLogin(vm) {
      const code = query('code');
      const token = Cookies.get('token');
      if (ua.isWeixin) {
        if (code && !token) {
          vm.isLogin = false;
          return;
        }
      } else {
        if (!token) {
          vm.isLogin = false;
          return;
        }
      }
      vm.isLogin = true;
    },
    sendSms() {
      const userMob = this.loginForm.userMob;
      if (!userMob || !/1\d{10}$/.test(userMob)) {
        this.$message.error('手机号有误');
        return;
      }
      sendSms(
        {
          params: {
            userMob,
          },
        },
        res => {
          this.$message.success('发送成功');
          this.smsSent = true;
          this.loginForm.verificationCode = res;
          this.isSend = true;
          this.djs();
        },
        '获取短信验证码失败',
      );
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
    validateForm() {
      let message = '';
      if (this.detailForm.linkman.trim() === '') {
        message = '联系人不能为空！';
      } else if (this.detailForm.phone.trim() === '') {
        message = '联系电话不能为空！';
      } else if (this.detailForm.address.trim() === '') {
        message = '所在区域不能为空！';
      } else if (this.detailForm.detailAddress.trim() === '') {
        message = '详细地址不能为空！';
      } else {
        return true;
      }
      this.$message.error(message);
    },
    validate() {
      let message = '';
      if (!this.loginForm.userMob || !/1\d{10}$/.test(this.loginForm.userMob)) {
        message = '手机号有误';
      } else if (!this.smsSent) {
        message = '请先获取短信验证码';
      } else if (!this.loginForm.verificationCode) {
        message = '请输入短信验证码';
      } else if (!this.agreed) {
        message = '必须先同意《盛达用户协议》';
      } else {
        return true;
      }
      this.$message.error(message);
    },

    // 账户登录
    async validateNlogin() {
      // 判断登录信息
      if (!this.validate()) return;
      const openId = this.$storage.get('openId');
      // if (openId) {
      //   this.loginForm.openId = openId;
      //   this.$delete(this.loginForm, 'code');
      // }
      this.loginForm.openId = openId;
      const res = await signInNUp({
        params: this.loginForm,
      });

      if (res.success && res.status === '200') {
        console.log(res);
        // 登录成功
        const userToken = res.data.userToken;
        const user = res.data.Ssuser;
        this.setUserInfo(user);
        Cookies.set('token', userToken, { expires: TOKEN_EXPIRES });
        Cookies.set('user', user, { expires: TOKEN_EXPIRES });
        this.$storage.set('STARSERVICE_USERTYPE', user.userType);
        const masterType = user.masterWorkerType;
        this.$storage.set('STARSERVICE_MASTERTYPE', masterType);
        // 继续提交表单
        this.submitContent();
      } else {
        this.$message.error(res.msg);
        this.showLogin = false;
      }
    },

    // 提交订单表单
    async submitContent() {
      const res = await addOrder({
        params: Object.assign({}, this.detailForm, {
          custPhoto: this.custPhoto,
        }),
      });

      this.showLogin = false;

      if (res.success && res.status === '200') {
        this.detailForm = {
          maintainProId: '',
          maintainExplain: '',
          // custPhoto: '',
          linkman: '',
          phone: '',
          address: '上海',
          detailAddress: '',
          custRemark: '',
          userCouponId: '',
          orderSource: this.$config.ORDER_SOURCE,
        };
        this.$message.success('提交预约成功！');
        setTimeout(() => {
          if (ua.isWeixin) {
            this.$router.push({
              name: 'order',
            });
          } else {
            this.$router.push({
              name: 'order-success',
            });
          }
        }, 1000);
      }
    },

    async onSubmit() {
      // console.log(this.photos);

      // console.log('maintainProId:' + this.detailForm.maintainProId);

      // 验证表单内容
      if (!this.validateForm()) return;
      console.log(this.isLogin);
      // 判断是否登录，如果没有显示弹框
      if (!this.isLogin) {
        this.showLogin = true;
        return;
      }
      this.submitContent();
    },
    changeData() {
      const { project, couponId } = this.$route.query || {};
      project && (this.detailForm.maintainPro = project);
      couponId && (this.detailForm.userCouponId = couponId);
      const user = Cookies.getJSON('user') || {};
      this.detailForm.linkman = user.userName || '';
      this.detailForm.phone = user.userMobile || '';
      this.detailForm.maintainProId = this.$storage.get(
        'STARSERVICE_MAINTAIN_PROJECTID',
      );
    },
    chooseCoupon() {
      this.$router.push({
        name: 'coupons-list',
        query: {
          maintainProId: this.detailForm.maintainProId,
          code: query('code'),
        },
      });
    },
    deleteCoupon() {
      this.detailForm.userCouponId = '';
      this.couponName = '';
    },
    // 删除照片的回调
    onRemoveFn(file, fileList, event) {
      console.log(file, fileList, event);
      // this.photos = fileList.map(item => item.)
    },
    // 检查上传图片的大小和格式
    beforeAvatarUpload(file) {
      const isImg = acceptedImageTypes.includes(file.type);
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG,JPEG,PNG或者BMP 格式!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
        return false;
      }
      return isImg && isLt10M;
    },
    async startUpload(file) {
      var file = file.file;
      var type = file.type;
      var fileName = file.name;

      let orentation;
      Exif.getData(file, function() {
        orentation = Exif.getTag(this, 'Orientation');
        /**
         * 1 正常
         * 3 180度颠倒
         * 6 逆时针90度转
         * 8 顺时针90度转
         *  */

        console.log(orentation);
      });

      var reader = new FileReader(),
        //创建一个img对象
        image = new Image();

      reader.readAsDataURL(file);
      // 文件base64化，以便获知图片原始尺寸
      reader.onload = function(e) {
        image.src = e.target.result;
      };

      // base64地址图片加载完毕后执行
      image.onload = () => {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;

        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        var MAX = 750;
        if (image.height > MAX && image.height >= image.width) {
          image.width *= MAX / image.height;
          image.height = MAX;
        }
        if (image.width > MAX && image.width > image.height) {
          image.height *= MAX / image.width;
          image.width = MAX;
        }

        if (!orentation || orentation === 1) {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height);
        } else {
          switch (orentation) {
            case 3: //需要180度旋转
              console.log('需要180度旋转');
              canvas.width = image.width;
              canvas.height = image.height;
              context.rotate(Math.PI);
              context.drawImage(
                image,
                -image.width,
                -image.height,
                image.width,
                image.height,
              );
              break;
            case 6: //需要顺时针（向左）90度旋转
              console.log('需要顺时针（向左）90度旋转');
              canvas.width = image.height;
              canvas.height = image.width;
              context.rotate(Math.PI / 2);
              context.drawImage(
                image,
                0,
                -image.height,
                image.width,
                image.height,
              );
              break;
            case 8: //需要逆时针（向右）90度旋转
              console.log('需要顺时针（向右）90度旋转');
              canvas.width = image.height;
              canvas.height = image.width;
              context.rotate((3 * Math.PI) / 2);
              context.drawImage(
                image,
                -image.width,
                0,
                image.width,
                image.height,
              );
              break;
          }
        }

        //也可以把压缩后的图片转blob格式用于上传
        canvas.toBlob(
          async blob => {
            let formData = new FormData();
            formData.append('file', blob);
            const res = await tempUploadPic({
              data: formData,
            });
            // console.log(res);
            if (res.success && res.status === '200') {
              this.photos.push(res.data);
              this.$refs.mySwiper.update();
            } else {
              this.$message.error(res.msg);
            }
          },
          'image/jpeg',
          0.9,
        );
      };
    },
  },
};
</script>
