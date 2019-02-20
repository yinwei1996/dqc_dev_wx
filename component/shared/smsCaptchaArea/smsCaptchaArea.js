/*
 * 组件 - 短信验证码区域
 * smsCaptchaArea
 * -----------------------------------
 * 19/02/20 Jerry 新增
*/

var
helper = require('../../../utils/helper.js');

Component({
options: {
  addGlobalClass: true
},
/* ------------------------------
 组件的属性列表
------------------------------ */
properties: {

type: { type: String, observer(newVal) { this.initType( newVal ) } }

}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {

}, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化验证码类型
  ------------------------------ */
  initType(type) {

    var url;

    if (type === 'login') {
      url = 'wx/captcha/smsLogin';
    }
    else if (type === 'register') {
      url = 'wx/captcha/smsRegister';
    }
    else if (type === 'bind') {
      url = 'wx/captcha/smsBind';
    }
    else {
      throw '未支持的短信验证码类型, type: ' + type;
    }

    this.setData({ url: url });
    console.log(['smsCaptchaArea.initType => type: ', type, ', url: ', url].join(''));

  },
  /* ------------------------------
   输入手机号
  ------------------------------ */
  inputMobile(e){

    var args = { mobile: e.detail.value };

    this.setData(args);
    this.triggerEvent('inputMobile', args);

  },
  /* ------------------------------
   输入验证码
  ------------------------------ */
  inputCaptcha(e){

    var args = { captcha: e.detail.value };

    this.setData(args);
    this.triggerEvent('inputCaptcha', args);
  },
  /* ------------------------------
   发送短信验证码
  ------------------------------ */
  sendCaptcha(ret){

    var
      that = this,
      url = this.data.url,
      mobile = this.data.mobile;

    // 简单检查
    if (!helper.isMobile(mobile)) {
      helper.showToast('请输入有效手机号', 'none');
      return;
    }

    // 显示提示
    helper.showLoading();

    helper.request({
      url: url,
      data: { mobile: mobile },
      success: (ret) => {
        // 隐藏提示
        helper.hideLoading();
        // 开始倒计时
        that.afterSendCaptcha(ret.timeout);
      }
    });

  },
  /* ------------------------------
   刷新验证码倒计时
  ------------------------------ */
  afterSendCaptcha(initTimeout){

    // 隐藏提示
    helper.hideLoading();

    var
    that = this,
    timeout = ( initTimeout || this.data.timeout ) - 1;

    // 刷新倒计时
    this.setData({ timeout: timeout });

    if (timeout <= 0)
      return;

    // 继续下一秒倒计时
    setTimeout(function(){ that.afterSendCaptcha() }, 1000);

  }

}

});
