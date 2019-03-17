import axios from 'axios';
import Cookies from 'js-cookie';
import { Loading, Message } from 'element-ui';
// import store from 'store';
import router from '../router';
import CONFIG from '../config';
import { wxAuthorizeLink } from '../api/api';
import { ua } from '../utils/utils';
import { getTokenByCode } from '@/api/api';

const http = axios.create({
  baseURL: CONFIG.BASE_URL,
  // withCredentials: true,
  timeout: 20000,
  // crossDomain: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

let loading;
let timeout;
const delay = 200;

http.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    // if (config.isLogin && !token) {
    //   // authorize();
    //   return Promise.reject();
    // } else {
    //   // config.headers['Authorization'] = token;
    //   config.headers.Authorization = token;
    // }
    config.headers.Authorization = token;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      loading = Loading.service({
        fullscreen: true,
        text: '请求中...',
      });
    }, delay);

    return config;
  },
  err => {
    Message({
      message: '请求失败，请稍后再试',
      type: 'error',
    });
    return Promise.reject(err);
  },
);

let a = 1;

http.interceptors.response.use(
  async response => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (loading) {
      loading.close();
    }

    if (response.status === 200) {
      const res = response.data;
      if (res.status === '530') {
        if (ua.isWeixin) {
          Cookies.remove('token');
          window.location.href = wxAuthorizeLink(document.URL);
          return false;
        } else {
          Message({
            message: '登陆已失效，请重新登陆！',
            type: 'error',
          });
          router.push({
            name: 'login',
          });
        }
      }
      return res;
    } else {
      Message({
        message: '响应失败，请稍后再试',
        type: 'error',
      });
    }
  },
  err => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (loading) {
      loading.close();
    }
    Message({
      message: '响应失败，请稍后再试',
      type: 'error',
    });
    return Promise.reject(err);
  },
);

export default http;
