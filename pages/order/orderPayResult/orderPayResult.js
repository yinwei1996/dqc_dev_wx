/**
 * 订单付款结果
 * orderPayResult.js
 * -----------------------------------
 * 18/03/30 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle('支付结果');

  this.setData({ orderId: opts.orderId });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 查询订单
  this.queryOrder(this.data.orderId);

},
/* ------------------------------
 查询订单
------------------------------ */
queryOrder: function(orderId){

  helper.request({
    url: 'wx/order/detail',
    data: { orderId: orderId },
    success: this.bindOrder
  })

},
/* ------------------------------
 绑定显示订单
------------------------------ */
bindOrder: function(order){

  // 付款时效
  order.payExpireTimeString = helper.dt2str(order.payExpireTime);

  // 绑定数据
  helper.setData(this, { order: order }, false);

},
/* ------------------------------
 跳转到订单列表（个人中心的最近订单）
------------------------------ */
redirectOrder: function(){
  helper.redirectTo('orderAll');
},
/* ------------------------------
 订单付款
------------------------------ */
handlePay: function(){
  helper.preparePay({ orderId: this.data.order.orderId });
}


})
