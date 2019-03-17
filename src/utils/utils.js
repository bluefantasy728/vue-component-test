export const ua = (() => {
  const u = navigator.userAgent;
  const isWeixin = u.indexOf('MicroMessenger') > -1;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const isIpad = u.match(/(iPad).*OS\s([\d_]+)/);
  const isIphone = !isIpad && u.match(/(iPhone\sOS)\s([\d_]+)/);
  const isMobile = isIphone || isAndroid;
  return {
    isIpad,
    isIphone,
    isIOS,
    isAndroid,
    isMobile,
    isWeixin,
  };
})();

/**
 *
 * @param {String} param
 *   location.href
 * @return {String}
 *   An url that has deleted the specified parameter.
 */
export function delUrlParam(param) {
  const r = window.location.search.substr(1);
  if (r) {
    const arr = r.split('&');
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].split('=')[0] === param) {
        arr.splice(i, 1);
        i--;
      }
    }
    if (arr.length) {
      return window.location.href.split('?')[0] + '?' + arr.join('&');
    } else {
      return window.location.href.split('?')[0];
    }
  } else {
    return window.location.href;
  }
}

export function query(param, toLower) {
  const search = window.location.search.substr(1);
  const reg = new RegExp(
    '(^|&)' + (toLower ? param.toLowerCase() : param) + '=([^&]*)(&|$)',
  );
  const r = (toLower ? search.toLowerCase() : search).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function exitApp(window, document) {
  const u = window.navigator.userAgent;
  const wx = u.indexOf('MicroMessenger') !== -1;
  function ready(callback) {
    if (wx) {
      if (window.WeixinJSBridge) {
        callback && callback();
      } else {
        document.addEventListener('WeixinJSBridgeReady', callback, false);
      }
    } else {
      callback && callback();
    }
  }

  window.addEventListener('popstate', function() {
    ready(() => {
      if (wx) {
        WeixinJSBridge.call('closeWindow');
      } else {
        window.opener = null;
        window.open(' ', '_self');
        window.close();
      }
    });
  });
}
