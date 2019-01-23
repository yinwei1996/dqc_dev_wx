/**
 * 订单详情
 * orderDetail.js
 * -----------------------------------
 * 18/03/27 Jerry 新增
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
onLoad: function(opts) {

  // 绑定订单编号
  this.setData({ orderId: opts.orderId || '40fc5b006e4f4cbab1d21265eeec2b93' });
},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function() {

  // 查询订单
  this.queryOrder();
},
/* ------------------------------
 查询订单
------------------------------ */
queryOrder: function() {

  helper.request({
    url: 'wx/order/detail',
    data: { orderId: this.data.orderId },
    success: this.bindOrder
  });

},
/* ------------------------------
 绑定显示订单
------------------------------ */
bindOrder: function(order){

  // 格式化实付时间
  order.payTimeString = helper.dt2str(order.payTime);

  // 绑定SKU缩略图的完整URL
  helper.each(order.skuGroups, function(idx, grp){
    helper.bindFullImgUrl(grp.skuMaps);
  });

  // 绑定订单
  helper.setData(this, { order: order }, false);

},
/*
 * 跳转到快商通客服
 * */
handleKSTClick: function (){

  helper.navigateTo({
    url:"/pages/concatService/concatService"
  })
},
/* ------------------------------
 处理买家操作
------------------------------ */
orderBuyerOpClick: function(e){

  var
  orderId = this.data.order.orderId,
  action = e.target.dataset.action;

  // 取消订单
  if ('cancel' == action){
    this.cancelOrder(orderId);
    return;
  }

  // 确认订单
  if ('pay' == action){
    this.preparePay(orderId);
    return;
  }

  // 跟踪订单
  if ('trace' == action){
    this.traceOrder(orderId);
    return;
  }

  // 确认收货
  if ('done' == action){
    this.doneOrder(orderId);
    return;
  }

  // 评价晒单
  if ('comment' == action){
    this.commentOrder(orderId);
    return;
  }

  // 再次购买
  if ('buyAgain' == action){
    this.buyAgain(orderId);
    return;
  }

  // 返回个人中心
  if ('myCenter' == action){
    this.redirectMyCenter();
    return;
  }

},
/* ------------------------------
 取消订单
------------------------------ */
cancelOrder: function(orderId){

  helper.request({
    confirm: [ '确认取消订单？如已付款，实付款项稍后原路退回。' ].join(''),
    url: 'wx/order/cancel',
    data: { orderId: orderId },
    // 刷新订单详情
    success: this.queryOrder
  });

},
/* ------------------------------
 订单付款
------------------------------ */
preparePay: function(orderId){
  helper.preparePay({ orderId: orderId });
},
/* ------------------------------
 跟踪订单
------------------------------ */
traceOrder: function(orderId){
  // 跳转到订单跟踪页
  helper.navigateFormat('orderTrace', { orderId: orderId });
},
/* ------------------------------
 确认收货
------------------------------ */
doneOrder: function(orderId){

  helper.request({
    url: 'wx/order/done',
    data: { orderId: orderId },
    // 刷新订单详情
    success: this.queryOrder
  });

},
/* ------------------------------
 评价晒单
------------------------------ */
commentOrder: function(orderId){
  // 跳转到订单评价页
  helper.navigateFormat('orderComment', { orderId: orderId });
},
/* ------------------------------
 再次购买
------------------------------ */
buyAgain: function(orderId){

  helper.request({
    url: 'wx/order/buyAgain',
    data: { orderId: orderId },
    // 跳转到采购单页
    success: function(){ helper.switchTab('myCart') }
  });

},
/* ------------------------------
 跳转到拼团Item页
------------------------------ */
redirectPintuanItem: function(){
  helper.navigateFormat('pintuanItem', { itemId: this.data.order.refId });
},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
},
/* ------------------------------
 处理SKUClick
------------------------------ */
orderSkuClick: function(e){
  var skuId = e.currentTarget.dataset.skuId;
  helper.navigateFormat('skuDetail', { skuId: skuId });
}

})
