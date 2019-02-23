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
data: { initTimeout: 10 },
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle('支付结果');

  this.setData({ orderId: opts.orderId || '4d5db3b7d3134db6978e90902dffbeaa' });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow(){

  // 查询订单
  this.queryOrder(this.data.orderId);

},
/* ------------------------------
 查询订单
------------------------------ */
queryOrder(orderId){

  helper.request({
    url: 'wx/order/detail',
    data: { orderId },
    success: this.bindOrder
  })

},
/* ------------------------------
 绑定显示订单
------------------------------ */
bindOrder(order){

  // 付款时效
  order.payExpireTimeString = helper.dt2str(order.payExpireTime);
  order.payableAmountString = helper.fen2str(order.payableAmount);
  order.paidAmountString = helper.fen2str(order.paidAmount);

  // 绑定数据
  this.setData({ order });

  // 付款成功的，开始跳转倒计时
  if (order.payTime)
    this.afterPaid(this.data.initTimeout);

},
/* ------------------------------
 跳转到订单列表
------------------------------ */
redirectOrder(){
  helper.redirectTo('orderAll');
},
/* ------------------------------
 订单付款
------------------------------ */
clickPay(){
  helper.preparePay({ orderId: this.data.order.orderId });
},
/* ------------------------------
 刷新付款成功跳转倒计时
------------------------------ */
afterPaid(initTimeout){

  var timeout = ( initTimeout || this.data.timeout ) - 1;

  // 首次计时，确认跳转页
  if (initTimeout) {

    var order = this.data.order;

    if (order.refType === 'ExService' || order.refType === 'Point') {
      // 增值服务、积分充值：个人中心
      this.setData({ timeoutPage: '个人中心', timeoutUrl: 'myCenter' });
    }
    else {
      // 默认：订单详情
      this.setData({ timeoutPage: '订单详情', timeoutUrl: 'orderDetail', timeoutArgs: { orderId: order.orderId } });
    }

  }

  // 刷新倒计时
  this.setData({ timeout });

  // 倒计时结束，跳转到对应页
  if (timeout <= 0) {
    helper.redirectFormat(this.data.timeoutUrl, this.data.timeoutArgs);
    return;
  }

  // 继续下一秒倒计时
  setTimeout( () => this.afterPaid(), 1000);

}


})
