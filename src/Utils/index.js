import format from 'date-fns/format';
import toastr from './Toast';

const getQueryString = function getQueryString(field, url) {
  const href = url || window.location.href;
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
  const string = reg.exec(href);
  return string ? string[1] : null;
};

export const getSizeForPopup = (function getSizeForPopup() {
  let myWidth = 0;
  let myHeight = 0;
  if (typeof window.innerWidth === 'number') {
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return () => ({ winH: myHeight, winW: myWidth });
}());

export function getMappedIconWithMime(type) {
  switch (type) {
    case 'png':
    case 'jpeg':
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'web':
    case 'svg+xml':
      return 'pciture';
    case 'pdf':
      return 'file-pdf';
    case 'zip':
      return 'file';
    case 'webm':
    case 'ogg':
    case 'mp4':
    case 'flv':
    case 'mkv':
    case '3gp':
    case 'qt':
    case 'avi':
    case 'wmv':
      return 'video-camera';
    case 'midi':
    case 'wav':
    case 'mpeg':
    case 'au':
    case 'snd':
    case 'Linear':
    case 'mid':
    case 'rmi':
    case 'mp3':
    case 'aif':
    case 'aifc':
    case 'aiff':
    case 'm3u':
    case 'ra':
    case 'ram':
    case 'Ogg Vorbis':
    case 'Vorbis':
      return 'file';
    case 'folder':
      return 'folder';
    default:
      return 'file';
  }
}

export function formatDate(date, customFormat = 'YYYY/MM/DD') {
  return format(date, customFormat);
}

export function popupOpener(popupName, targetUrl) {
  const size = getSizeForPopup();
  window.open(
    targetUrl,
    popupName,
    `toolbar=0,location=0,directories=0,status=1,menubar=0,scrollbars=yes,resizable=1,width=599,height=679,left=${size.winH}top=${size.winW}`,
  );
}

export function getUniqKey() {
  return Date.now();
}

export function limitString(string = '', limit = 15) {
  if (string.length < limit) {
    return string;
  }
  return string.substring(0, limit).concat('...');
}

export function firstLetters(string) {
  return String(string)
    .split(' ')
    .map((i) => i.charAt(0).toUpperCase())
    .join('');
}

export function captchaChecker() {
  if (!window.uploadCaptchaCode && process.env.NODE_ENV !== 'development') {
    toastr('Please pass captcha test to proceed.', 'error'); // eslint-disable-line
    return false;
  }
  return true;
}
export { getQueryString };

export function injectFastSpringScript(secureData) {
  if (secureData) {
    window.fscSession = {
      secure: {
        payload: secureData.securePayload, // string of encrypted data passed from the server
        key: secureData.secureKey, // secure key passed from the server
      },
    };
  }
  const script = document.createElement('script');
  script.id = 'fsc-api';
  script.type = 'text/javascript';
  script.src = 'https://d1f8f9xcsvx3ha.cloudfront.net/sbl/0.7.6/fastspring-builder.min.js';
  script.dataset.storefront = 'savetodrive.test.onfastspring.com/popup-test';
  script.dataset.popupClosed = 'onstdpaymentclosed';
  script.dataset.accessKey = 'IOML-BMCQV6OUW6JE0E8KW';
  document.head.appendChild(script);
}
