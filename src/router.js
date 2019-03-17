import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import { exitApp } from './utils/utils';
import { ua, query } from '@/utils/utils';
import Cookies from 'js-cookie';
import storage from 'store';
import store from '@/store';
import { authorize } from './utils/authorize';
import { getTokenByCode, wxAuthorizeLink } from '@/api/api';
import { TOKEN_EXPIRES } from '@/config';

Vue.use(VueRouter);

function load(path, type = 0) {
  const dir = type ? 'components' : 'views';
  return () => import(`@/${dir}/${path}.vue`);
}

const Router = new VueRouter({
  mode: 'history',
  base: '/app',
  routes: [
    {
      path: '/',
      redirect: '/book',
    },
    {
      path: '/xieyi',
      name: 'xieyi',
      component: load('xieyi'),
    },
    // 预约
    {
      path: '/book',
      name: 'book',
      component: load('book/index'),
      meta: {
        titleName: '盛达星修',
        isShowNavBar: true,
      },
    },
    {
      path: '/book-items',
      name: 'book-items',
      meta: {
        titleName: '选择条目',
        keepAlive: true,
      },
      component: load('book/items'),
    },
    {
      path: '/book-detail',
      name: 'book-detail',
      meta: {
        titleName: '预约详情',
        keepAlive: true,
      },
      component: load('book/detail'),
    },
    {
      path: '/choose-coupon',
      name: 'choose-coupon',
      meta: {
        titleName: '选择优惠券',
      },
      component: load('book/chooseCoupon'),
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      meta: {
        titleName: '手机快速绑定',
      },
      component: load('login/index'),
    },
    // 注册
    {
      path: '/registe',
      name: 'registe',
      meta: {
        titleName: '手机快速绑定',
      },
      component: load('login/registe'),
    },
    // 订单
    {
      path: '/order',
      name: 'order',
      component: load('order/index'),
      meta: {
        titleName: '订单列表',
        isShowNavBar: true,
        needLogin: true,
      },
    },
    {
      path: '/order/detail/:orderId',
      name: 'order-detail',
      component: load('order/detail'),
      meta: {
        titleName: '订单详情',
      },
    },
    {
      path: '/order/qualify',
      name: 'order-qualify',
      component: load('order/qualify'),
      meta: {
        titleName: '验收评价 ',
      },
    },
    {
      path: '/order/steps/:orderNum',
      name: 'order-steps',
      meta: {
        titleName: '订单进度',
      },
      component: load('order/steps'),
    },
    {
      path: '/order/distribution',
      name: 'order/distribution',
      meta: {
        titleName: '分配订单',
      },
      component: load('order/distribution'),
    },
    {
      path: '/order/finish',
      name: 'order/finish',
      meta: {
        titleName: '完工确认',
      },
      component: load('order/finish'),
    },
    {
      path: '/order-success',
      name: 'order-success',
      meta: {
        titleName: '下单成功',
      },
      component: load('order/success'),
    },
    // 我的
    {
      path: '/account',
      name: 'account',
      component: load('account/index'),
      meta: {
        titleName: '我的',
        isShowNavBar: true,
        needLogin: true,
      },
    },
    {
      path: '/account-info',
      name: 'account-info',
      component: load('account/info'),
      meta: {
        titleName: '个人资料',
        isShowNavBar: true,
      },
    },
    {
      path: '/receipt-apply',
      name: 'receipt-apply',
      component: load('account/receiptApply'),
      meta: {
        titleName: '申请发票',
        keepAlive: true,
      },
    },
    {
      path: '/coupons',
      redirect: '/coupons/list',
      name: 'coupons',
      component: load('coupons/index'),
      children: [
        {
          path: 'list',
          name: 'coupons-list',
          component: load('coupons/list'),
          meta: {
            titleName: '我的卡券',
          },
        },
        {
          path: 'detail',
          name: 'coupons-detail',
          component: load('coupons/detail'),
          meta: {
            titleName: '我的卡券',
          },
        },
      ],
    },
    // 选择订单
    {
      path: '/choose-order',
      name: 'choose-order',
      component: load('account/chooseOrder'),
      meta: {
        titleName: '选择订单',
      },
    },
    // 关于
    {
      path: '/about',
      name: 'about',
      component: load('about/index'),
      meta: {
        isShowNavBar: true,
        titleName: '关于',
      },
    },
  ],
});

// 返回直接退出app
const exitAppList = ['order', 'account'];
// 需要登录的路由
const needLoginRoutes = ['order', 'account'];

Router.beforeEach(async (to, from, next) => {
  console.log(store.state);
  const currentName = to.name;
  const currentTitleName = to.meta.titleName;
  const needLogin = needLoginRoutes.some(name => name === currentName);
  const { isLogin } = Router.app.$options.store.state;

  // 修改title
  if (currentTitleName) {
    document.title = currentTitleName;
  }

  // console.log(to);
  // console.log(location.href);

  if (
    to.name === 'login' ||
    to.name === 'book' ||
    to.name === 'book-items' ||
    to.name === 'registe' ||
    to.name === 'about'
  ) {
    next();
    return;
  }

  const openId = query('openId');
  // bookdetail这个页面，获取到在code换token的时候，给了openId,但是不要跳登陆页
  if (to.name === 'book-detail' && openId) {
    next();
    return;
  }

  if (ua.isWeixin) {
    const code = query('code');
    let token = Cookies.get('token');
    if (token) {
      // auth
    } else {
      if (!code) {
        console.log(1);
        //getcode
        window.location.href = wxAuthorizeLink(
          location.protocol + '//' + location.host + '/app' + to.fullPath,
        );
      } else {
        console.log(2);
        //get token
        const res = await getTokenByCode({
          params: {
            code,
          },
        });
        const openId = res.data;
        const restoken = res.data.userToken;
        const Ssuser = res.data.Ssuser;

        console.log(openId);
        console.log(restoken);
        console.log(Ssuser);

        if (restoken) {
          console.log(3);
          Cookies.set('token', restoken, { expires: TOKEN_EXPIRES });
          Cookies.set('user', Ssuser, { expires: TOKEN_EXPIRES });
          const userType = Ssuser.userType;
          storage.set('STARSERVICE_USERTYPE', userType);
          const masterType = res.data.Ssuser.masterWorkerType;
          storage.set('STARSERVICE_MASTERTYPE', masterType);
          next();
        } else {
          console.log(4);
          if (to.name === 'book-detail') {
            storage.set('openId', openId);
            next();
            return;
          }
          console.log(5);
          console.log(storage.get('openId'));
          next({
            name: 'login',
            query: {
              openId: storage.get('openId'),
              from: '/app' + to.fullPath,
            },
          });
        }
      }
    }
  }

  next();

  // if (ua.isWeixin) {
  //   const codeAuth = query('code');
  //   let token = Cookies.get('token');
  //   console.log('code= ' + codeAuth);
  //   console.log('token= ' + token);

  //   if (!token && !codeAuth) {
  //     console.log('要授权啊，当前页面是：' + to.name);
  //     // 没有token，也没有授权code，去授权
  //     window.location.href = wxAuthorizeLink(document.URL);
  //     // next();
  //     return;
  //   } else if (!token && !!codeAuth) {
  //     // 没有token，但是有授权code，调获取code换token接口
  //     console.log('有授权code，要换取token登陆，当前页面是：' + to.name);
  //     const res = await getTokenByCode({
  //       params: {
  //         code: codeAuth,
  //       },
  //     });
  //     if (res.success) {
  //       if (res.status === '530') {
  //         console.log('返回503');
  //         const openId = res.data;
  //         console.log('openId:' + openId);
  //         if (to.name === 'book-detail') {
  //           storage.set('STARSERVICE_ISAUTH', false);
  //           next();
  //         } else {
  //           // 未登陆
  //           Message({
  //             message: '未登陆！',
  //             type: 'error',
  //           });
  //           next({
  //             name: 'login',
  //             query: {
  //               openId,
  //             },
  //           });
  //         }
  //       } else {
  //         // 登陆成功，设置token;
  //         Cookies.set('token', res.data.userToken, { expires: TOKEN_EXPIRES });
  //         next();
  //       }
  //     } else {
  //     }
  //   } else {
  //     // console.log('有token了');
  //     next();
  //   }
  // } else {
  //   // 非微信登录处理
  //   if (needLogin && !isLogin && currentName !== 'login') {
  //     next({
  //       name: 'login',
  //     });
  //     Message({
  //       message: '请先登录',
  //       type: 'info',
  //     });
  //   }
  // }
  // next();

  // name满足list直接退出app
  // if (exitAppList.includes(to.name)) {
  //   exitApp(window, document);
  // }
});

export default Router;
