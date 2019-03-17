// import utils from '@/utils';

let baseUrl;

const host = location.host;
const ua = navigator.userAgent.toLowerCase();

if (
  // 开发环境
  host.startsWith('192.168') ||
  host.startsWith('localhost') ||
  host.startsWith('127')
) {
  console.log('develop env');
  // baseUrl = 'http://192.168.1.84:8080';
  // baseUrl = 'http://192.168.1.56:8080';
  baseUrl = 'https://www.starservice.tech:8080';
  // baseUrl = '/api';
} else if (host.startsWith('116.228.57.158')) {
  // 测试环境ip
  baseUrl = 'http://116.228.57.158:8000/fixit_admin';
} else if (host.includes('starservice.tech')) {
  // baseUrl = 'http://192.168.1.56:8080';
  // baseUrl = 'http://192.168.1.84:8080';
  baseUrl = 'https://www.starservice.tech:8080';
}

const uaMap = [
  {
    // weixin
    ua: 'micromessenger',
    value: '3',
  },
  {
    // 爱包办
    ua: '',
    value: '2',
  },
];

const SERVICE_TEL = 'tel:400-820-8277';

export const ORDER_SOURCE = uaMap.find(u => ua.indexOf(u.ua))
  ? uaMap.find(u => ua.indexOf(u.ua)).value
  : '';

export const TOKEN_EXPIRES = 2;

const config = {
  BASE_URL: baseUrl,
  ORDER_SOURCE,
  SERVICE_TEL,
};

export default config;
