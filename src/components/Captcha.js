/* global grecaptcha */
import React from 'react';

class Captcha extends React.Component {
  componentDidMount() {
    const holder = document.querySelector('.g-recaptcha');
    if (holder && typeof grecaptcha !== 'undefined') {
      if (!grecaptcha.render) return;
      grecaptcha.render(holder);
      window.uploadCaptchaCode = null;
    }
  }
  render() {
    return (
      <div
        data-expired-callback="handleCaptchaExpired"
        data-callback="handleUploadCaptcha"
        className="g-recaptcha"
        data-sitekey="6LdgeDoUAAAAAHe602P5xTrg9NniKEr_kKrnGywA"
      />
    );
  }
}
export default Captcha;
