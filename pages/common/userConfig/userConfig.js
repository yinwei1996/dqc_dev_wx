/**
 * 用户配置
 * userConfig
 * -----------------------------------
 * 19/02/21 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: { },
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle('用户配置');

  // 查询会员详情
  this.queryUser();

},
/* ------------------------------
 查询个人详情
------------------------------ */
queryUser(){
  helper.request({ url: 'wx/my/detail', success: this.bindUser });
},
/* ------------------------------
 绑定显示个人详情
------------------------------ */
bindUser(ret){
  // 绑定数据
  helper.setData(this, { user: ret }, false);
},
/* ------------------------------
 跳转到地址管理
------------------------------ */
clickAddress(){
  helper.navigateTo('addressAll');
},
/* ------------------------------
 跳转到关注品类设置
------------------------------ */
clickCategory(){
  helper.navigateTo('userCategoryConfig');
},
/* ------------------------------
 跳转到转发设置
------------------------------ */
clickShareMode(){
  helper.navigateTo('userShareModeConfig');
},
/* ------------------------------
 跳转到默认支付方式
------------------------------ */
clickWxPayType(){
  helper.navigateTo('userWxPayTypeConfig');
}

})
