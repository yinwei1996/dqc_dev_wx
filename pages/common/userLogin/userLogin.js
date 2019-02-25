/**
 * 会员注册/登录
 * userRegister
 * -----------------------------------
 * 19/02/20 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  mobile: '18064871059',
  isRegister: false,
  btnDisabled: true,
  hiddenAgreementSheet: 'hidden'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(){

  // 更新导航
  helper.navTitle( this.data.isRegister ? '注册' : '登录' );

},

/* ------------------------------
 页面显示
------------------------------ */
onShow(){

},
/* ------------------------------
 显示协议
------------------------------ */
showAgreement(e){
  this.setData({ hiddenAgreementSheet: '' });
},
/* ------------------------------
 关闭协议
------------------------------ */
closeAgreementSheet(e){
  this.setData({ hiddenAgreementSheet: 'hidden' });
},
/* ------------------------------
 输入手机号/验证码
------------------------------ */
inputText(e){
  this.setData(e.detail);
  this.setData({ btnDisabled: !helper.isMobile(this.data.mobile) || !/^[0-9a-z]{6}$/ig.test(this.data.captcha) });
},
/* ------------------------------
 切换登录/注册
------------------------------ */
clickSwitch(){
  this.setData({ isRegister: !this.data.isRegister });
},
/* ------------------------------
 点击"登录/注册"按钮
------------------------------ */
clickLogin(){

  var args = {
    mobile: this.data.mobile,
    smsCaptcha: this.data.captcha,
    fromButtonClick: true
  };

  // 登录/注册
  helper[ this.data.isRegister ? 'wxRegister' : 'wxLogin' ](args);

}

})
