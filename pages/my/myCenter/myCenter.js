/**
 * 个人中心
 * myCenter
 * -----------------------------------
 * 19/02/20 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { },
/* ------------------------------
 页面加载
------------------------------ */
onLoad(){

  // 更新导航
  helper.navTitle('个人中心');

},
/* ------------------------------
 页面显示
------------------------------ */
onShow(){
  // 查询数据
  this.querySummary();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh(){
  // 查询数据
  this.querySummary();
},
/* ------------------------------
 查询摘要
------------------------------ */
querySummary(){
  helper.request({ url: 'wx/my/summary', success: this.bindSummary });
},
/* ------------------------------
 绑定显示摘要
------------------------------ */
bindSummary(ret){

  // 格式化金额
  ret.pointAmountString = helper.fen2str(ret.pointAmount);
  ret.todaySaleAmountString = helper.fen2str(ret.todaySaleAmount);
  ret.weekSaleAmountString = helper.fen2str(ret.weekSaleAmount);
  ret.monthSaleAmountString = helper.fen2str(ret.monthSaleAmount);

  // 绑定数据
  helper.setData(this, ret);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 跳转到用户设置
------------------------------ */
clickConfig(){
  helper.navigateTo('userConfig');
},
/* ------------------------------
 跳转到积分日志列表
------------------------------ */
clickPointLogAll(){
    helper.navigateTo('pointLogAll');
},
/* ------------------------------
 跳转到积分充值
 ------------------------------ */
clickPointRecharge(){
  helper.navigateTo('pointRecharge');
},
/* ------------------------------
 跳转到销售明细
 ------------------------------ */
clickSaleCount(){
  helper.navigateTo('userSaleCountAll');
},
/* ------------------------------
 跳转到全部订单
 ------------------------------ */
clickOrderAll(e){
  helper.navigateFormat('orderAll', { tab: e.currentTarget.dataset.tab });
},
/* ------------------------------
 跳转到购买服务
 ------------------------------ */
clickExService(e){
  helper.navigateTo('userExServiceAll');
}

});