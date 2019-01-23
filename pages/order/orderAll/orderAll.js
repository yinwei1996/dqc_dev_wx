/**
 * 订单列表
 * orderAll.js
 * -----------------------------------
 * 18/03/27 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'all', text: '全部' },
    { key: 'toPay', text: '待付款' },
    { key: 'toDelivery', text: '待发货' },
    { key: 'toReceive', text: '待收货' },
    //{ key: 'toComment', text: '待评价' }
  ],
  tab: 'all'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts){

  // 更新导航
  helper.navTitle('我的订单');

  // 保存传入的 tab index
  if (opts.tab)
    this.setData({ tab: opts.tab });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 查询订单列表
  this.queryOrders();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryOrders('scrollend');
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.queryOrders( false );
},
/* ------------------------------
 处理Tab导航Click
------------------------------ */
tabNavClick: function(e) {

  var
  tab = e.currentTarget.dataset.navKey,
  isSame = tab == this.data.tab;

  // 切换tab
  this.setData({ tab: tab });

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.queryOrders( !isSame );
},
/* ------------------------------
 查询订单列表
------------------------------ */
queryOrders: function(paging){

  var
  tab = this.data.tab,
  existOrders = this.data[ tab + '_orders' ],
  pageIndex = helper.nextPageIndex( existOrders, paging ),
  status;

  if (pageIndex < 0)
    return;

  if ('toPay' == tab) {
    status = 'ToPay';
  }
  else if ('toDelivery' == tab) {
    status = 'Paid';
  }
  else if ('toReceive' == tab) {
    status = 'Delivered';
  }
  else if ('toComment' == tab) {
    status = 'Done';
  }

  helper.request({
    url: [ 'wx/order/list?pageIndex=', pageIndex || 0, '&status=', status || '' ].join(''),
    success: this.bindOrders
  });

},
/* ------------------------------
 绑定显示订单列表
------------------------------ */
bindOrders: function(ret){

  var
  key = this.data.tab + '_orders',
  skuQuantity,
  orders;

  helper.each(ret.records, function(idx, order){

    // 绑定SKU图片完整URL
    helper.bindFullImgUrl(order.skuMaps);

    // 统计SKU件数
    skuQuantity = 0;

    helper.each(order.skuMaps, function(idx2, map){
      skuQuantity += map.quantity;
    });

    order.skuQuantity = skuQuantity;

  });

  // 拼接分页数据
  orders = helper.concatPaging(this, key, ret);

  // 绑定数据
  helper.setData(this, key, orders);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 处理买家操作
------------------------------ */
orderBuyerOpClick: function(e){

  var
  orderId = e.currentTarget.dataset.orderId,
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

},
/* ------------------------------
 取消订单
------------------------------ */
cancelOrder: function(orderId){

  helper.request({
    confirm: [ '确认取消订单？如已付款，实付款项稍后原路退回。' ].join(''),
    url: 'wx/order/cancel',
    data: { orderId: orderId },
    // 跳转到订单详情
    success: function(){ helper.navigateFormat('orderDetail', { orderId: orderId }) }
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
    // 跳转到订单详情
    success: function(){ helper.navigateFormat('orderDetail', { orderId: orderId }) }
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

}


})
