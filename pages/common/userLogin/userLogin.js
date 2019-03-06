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
  isRegister: false,
  btnDisabled: true,
  hiddenAgreementSheet: 'hidden'
},
/* ------------------------------
 页面渲染完成
------------------------------ */
onReady(){
  // 更新导航
  helper.navTitle( this.data.isRegister ? '注册' : '登录' );
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
    success: ret => this.afterLogin(ret)
  };

  // 登录/注册
  helper[ this.data.isRegister ? 'wxRegister' : 'wxLogin' ](args);

},
/* ------------------------------
 显示注册协议Sheet
------------------------------ */
showAgreement(){

  if (!this.agreementSheet)
    this.agreementSheet = this.selectComponent('#agreementSheet');

  this.agreementSheet.showSheet();

},
/* ------------------------------
 登录/注册成功回调
------------------------------ */
afterLogin(ret){

  // 显示品类配置Sheet
  if (ret.showCategoryConfig) {

    if (!this.userCategoryConfigSheet)
      this.userCategoryConfigSheet = this.selectComponent('#userCategoryConfigSheet');

    this.userCategoryConfigSheet.showSheet();
    return;
  }

},
/* ------------------------------
 会员关注品类Sheet已关闭（事件处理）
------------------------------ */
categorySheetClosed(){
  // 跳转到上一页
  wx.navigateBack();
  console.log('userLogin.categorySheetClosed invoked');
}

})
