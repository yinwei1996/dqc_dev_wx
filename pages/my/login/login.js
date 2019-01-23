/**
 * 登录
 * login.js
 * -----------------------------------
 * 18/05/04 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  buttonText: '微信登录',
  buttonDisabled: false,
  hiddenAgreementSheet: 'hidden'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(){

  // 更新导航
  helper.navTitle('登录');

},

/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 如果已经登录，返回上一页
  if (helper.getSessionId() && helper.getUser() && helper.getWxUser())
    wx.navigateBack();

},
/* ------------------------------
 点击协议 
------------------------------ */
clickAgreement: function(e){
  this.setData({ disagree: e.currentTarget.dataset.action == 'disagree' });
},
/* ------------------------------
 显示协议
------------------------------ */
showAgreement: function(e){
  this.setData({ hiddenAgreementSheet: '' });
},
/* ------------------------------
 关闭协议
------------------------------ */
closeAgreementSheet: function(e){
  this.setData({ hiddenAgreementSheet: 'hidden' });
},
/* ------------------------------
 绑定微信用户信息 
------------------------------ */
bindUserInfo: function(e){

  this.setData({ buttonText: '登录中', buttonDisabled: true });
  helper.wxBindUserInfo(e);
}

})
