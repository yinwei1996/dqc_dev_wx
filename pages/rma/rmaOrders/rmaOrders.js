/**
 * RMA备选订单
 * rmaOrders.js
 * -----------------------------------
 * 18/04/23 Jerry 新增
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
onLoad: function (opts){

  // 更新导航
  helper.navTitle('申请退换货');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 查询订单列表
  this.queryOrders();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
handleScrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryOrders('scrollend');
},
/* ------------------------------
 查询订单列表
------------------------------ */
queryOrders: function(paging){

  var
  existOrders = this.data.orders,
  pageIndex = helper.nextPageIndex( existOrders, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: [ 'wx/order/list?pageIndex=', pageIndex || 0, '&rmaCandidate=true' ].join(''),
    success: this.bindOrders
  });

},
/* ------------------------------
 绑定显示订单列表
------------------------------ */
bindOrders: function(ret){

  var skuQuantity;

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

  // 绑定数据
  helper.setData(this, { orders: helper.concatPaging(this, 'orders', ret) }, false);

},
/* ------------------------------
 处理订单操作
------------------------------ */
orderRmaOpClick: function(e){

  var
  orderId = e.currentTarget.dataset.orderId,
  action = e.target.dataset.action;

  // 申请退换货
  if ('rma' == action){
    this.requestRMA(orderId);
    return;
  }

},
/* ------------------------------
 申请退换货
------------------------------ */
requestRMA: function(orderId){
  // 跳转到退换货申请页
  helper.navigateFormat('rmaModify', { orderId: orderId });
},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}


})
