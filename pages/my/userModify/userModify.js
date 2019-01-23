/**
 * 用户信息编辑
 * userModify.js
 * -----------------------------------
 * 18/05/04 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  hidden: 'hidden',
  // user 默认留空
  user: { },
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle('会员信息');

  // 查询个人详情
  this.queryUser();

},
/* ------------------------------
 查询个人详情
------------------------------ */
queryUser: function(){

  helper.request({ url: 'wx/my/detail', success: this.bindUser });

},
/* ------------------------------
 绑定显示个人详情
------------------------------ */
bindUser: function(ret){

  // 绑定数据
  helper.setData(this, { user: ret }, false);
},
/* ------------------------------
 录入姓名
------------------------------ */
inputUserName: function(e){
  this.inputProperty(e, 'userName');
},
/* ------------------------------
 录入手机号
------------------------------ */
inputMobile: function(e){
  this.inputProperty(e, 'mobile');
},
/* ------------------------------
 录入短信验证码
------------------------------ */
inputSmsCaptcha: function(e){
  this.inputProperty(e, 'smsCaptcha');
},
/* ------------------------------
 录入密码
------------------------------ */
inputPassword: function(e){
  this.inputProperty(e, 'password');
},
/* ------------------------------
 录入重复密码
------------------------------ */
inputRepeatPassword: function(e){
  this.inputProperty(e, 'repeatPassword');
},
/* ------------------------------
 录入个人属性（私有）
------------------------------ */
inputProperty: function(e, prop){

  // 更新属性为录入值
  var user = this.data.user;
  user[ prop ] = e.detail.value;

  // 绑定数据
  this.setData({ user: user });
  // console.log(user)

},
/* ------------------------------
 发送短信验证码
------------------------------ */
sendCaptcha: function(ret){

  var mobile = this.data.user.mobile;
    console.log(ret)

  helper.request({
    url: [ 'wx/my/smsCaptcha?mobile=', mobile || '' ].join(''),
    success: this.afterSendCaptcha
  });
  console.log(mobile)

},
/* ------------------------------
 刷新验证码倒计时
------------------------------ */
afterSendCaptcha: function(){

  var
  that = this,
  timeout = ( this.data.captchaTimeout || 60 ) - 1;

  // 刷新倒计时
  this.setData({ captchaTimeout: timeout });

  if (timeout <= 0)
    return;

  // 继续下一秒倒计时
  setTimeout(function(){ that.afterSendCaptcha() }, 1000);

},
/* ------------------------------
 保存会员信息
------------------------------ */
save: function(){

  var user = this.data.user;

  helper.request({
    url: 'wx/my/modify',
    data: user,
    success: this.afterSave
  });

},
/* ------------------------------
 保存会员信息之后
------------------------------ */
afterSave: function(user){

  // 更新已登录用户的信息
  helper.setUser(user);

  // 返回上一页面
  this.back();
},
/* ------------------------------
 返回上一页面
------------------------------ */
back: function(){

  wx.navigateBack();
}

})
