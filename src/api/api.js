import http from './http';
import { Message } from 'element-ui';
// import { delUrlParam } from '../utils/utils';

const APPID = 'wx6492f6ccba0a3777';
const REDIRECT_URI = encodeURI(
  'http://' + window.location.host + window.location.pathname,
);

const apis = {
  getTokenByCode: '/sys/user/checkLoginWx', // 用微信授权code换token

  tempUploadPic: '/general/uploadPic', // 临时图片上传
  flowLog: '/star-service/flowLog', // 查询流程日志
  orderFlowLog: '/star-service/orderFlowLog', // 查询流程工人联系方式
  wxConfig: '/wechat/config', // 微信sdk config配置信息
  wxHadAuthorized: '/wxLogin/wxOpenid',
  signInNUp: '/sys/user/login',
  logOut: '/sys/user/unbindMob',
  isLogin: '/sys/user/sys/isLogin',
  sendSms: '/sys/user/verificationCode',
  queryRepairCategoryList: '/star-admin/repairCategoryList',

  workerAppraises: '/star-service/appraises', // 师傅评价相关
  coupons: '/star-service/coupons', // 优惠券相关
  invoices: '/star-service/invoices', // 发票相关
  orderCost: '/star-service/orderCost', // 订单费用相关
  orderInfo: '/star-service/orders', // 订单信息相关
  userCoupons: '/star-service/userCoupons', // 用户优惠券相关
  userInfo: '/sys/user/userInfo', //修改个人信息
  getRegion: '/star-admin/allRegion', //获取所有地区
  getProvince: '/star-admin/provinceAndCity', //获取所有地区

  getAllWorker: '/star-admin/allWorker', //查询所有的师傅
  workerCheckIn: '/sys/user/workerCheckIn', // 师傅二维码签到
};

const generateHttp = config => {
  return async function(conf, cb, errMsg) {
    !conf && (conf = {});
    const suffix = conf.urlSuffix;
    let c = Object.assign(conf, config);
    suffix && (c.url += suffix);
    const res = await http(c);

    if (res.success) {
      cb && cb(res.data);
    } else {
      errMsg &&
        Message({
          message: errMsg,
          type: 'error',
        });
    }
    return res;
  };
};

export const wxAuthorizeLink = (redirect_uri = REDIRECT_URI) => {
  console.log('redirect_uri=' + REDIRECT_URI);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
};

// 通用
export const tempUploadPic = generateHttp({
  method: 'post',
  url: apis.tempUploadPic,
});
export const flowLog = generateHttp({
  method: 'get',
  url: apis.flowLog,
});
export const orderFlowLog = generateHttp({
  method: 'get',
  url: apis.orderFlowLog,
});
// 登录，授权，用户
export const wxConfig = generateHttp({
  method: 'get',
  url: apis.wxConfig,
});
export const wxHadAuthorized = generateHttp({
  method: 'get',
  url: apis.wxHadAuthorized,
});
export const getTokenByCode = generateHttp({
  method: 'get',
  url: apis.getTokenByCode,
});

export const signInNUp = generateHttp({
  method: 'post',
  url: apis.signInNUp,
});

export const logOut = generateHttp({
  method: 'get',
  url: apis.logOut,
});

export const sendSms = generateHttp({
  method: 'get',
  url: apis.sendSms,
});

export const isLogin = generateHttp({
  isLogin: true,
  method: 'post',
  url: apis.isLogin,
});

// 查询维修服务类目
export const queryRepairCategoryList = generateHttp({
  method: 'get',
  url: apis.queryRepairCategoryList,
});

// 工人师傅
export const queryWorkerAppraises = generateHttp({
  method: 'get',
  url: apis.workerAppraises,
});

export const updateWorkerAppraises = generateHttp({
  method: 'put',
  url: apis.workerAppraises,
});

export const getAllWorker = generateHttp({
  method: 'get',
  url: apis.getAllWorker,
});

export const workerCheckIn = generateHttp({
  method: 'get',
  url: apis.workerCheckIn,
});

// 优惠券
export const queryAllCoupons = generateHttp({
  method: 'get',
  url: apis.coupons,
});

export const addCoupons = generateHttp({
  method: 'post',
  url: apis.coupons,
});

export const updateCouponInfo = generateHttp({
  method: 'put',
  url: apis.coupons,
});

export const queryCouponInfo = generateHttp({
  method: 'get',
  url: apis.coupons,
});

export const removeCoupons = generateHttp({
  method: 'delete',
  url: apis.coupons,
});

// 发票
export const queryAllInvoices = generateHttp({
  method: 'get',
  url: apis.invoices,
});

export const queryInvoiceInfo = generateHttp({
  method: 'get',
  url: apis.invoices,
});

export const updateInvoiceInfo = generateHttp({
  method: 'put',
  url: apis.invoices,
});

// 订单费用
export const addOrderCost = generateHttp({
  method: 'pust',
  url: apis.orderCost,
});

export const queryOrderCostInfo = generateHttp({
  method: 'get',
  url: apis.orderCost,
});

// 订单信息
export const queryAllOrders = generateHttp({
  method: 'get',
  url: apis.orderInfo,
});

export const addOrder = generateHttp({
  method: 'post',
  url: apis.orderInfo,
});

export const queryOrderInfo = generateHttp({
  method: 'get',
  url: apis.orderInfo,
});

export const updateOrderInfo = generateHttp({
  method: 'put',
  url: apis.orderInfo,
});

// 用户优惠券
export const queryUserCoupons = generateHttp({
  method: 'get',
  url: apis.userCoupons,
});

export const reciveCoupon = generateHttp({
  method: 'put',
  url: apis.userCoupons,
});

//我的--个人资料
export const userInfo = generateHttp({
  method: 'put',
  url: apis.userInfo,
});
//获取地区/省
export const getRegion = generateHttp({
  method: 'get',
  url: apis.getRegion,
});
export const getProvince = generateHttp({
  method: 'get',
  url: apis.getProvince,
});
