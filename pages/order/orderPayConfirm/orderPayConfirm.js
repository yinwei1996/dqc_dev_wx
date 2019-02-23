/**
 * 订单支付确认
 * orderPayConfirm
 * -----------------------------------
 * 19/02/23 Jerry 新增
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
  helper.navTitle('支付确认');

  // 查询订单详情
  this.queryOrder(opts.orderId || 'c91799193ec54b8384924d14519c7494');

},
/* ------------------------------
 查询订单详情
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

  // 格式化金额
  order.payableAmountString = helper.fen2str(order.payableAmount);

  // 绑定数据（如果是积分充值订单，"积分支付"不可用）
  this.setData({ order, disablePayTypePoint: order.refType === 'Point' });

},
/* ------------------------------
 支付方式变更
------------------------------ */
changePayType(e){

  var order = this.data.order;

  // 更新支付方式
  order.payType = e.detail.key;

  // 绑定数据
  this.setData({ order });
  console.log('orderPayConfirm.changePayType => payType: ' + order.payType);

},
/* ------------------------------
 准备支付
------------------------------ */
preparePay(){

  var order = this.data.order;

  // 发起支付请求
  helper.preparePay({ orderId: order.orderId, payType: order.payType });

}

})
