/**
 * 拼团列表
 * pintuanAlll.js
 * -----------------------------------
 * 18/04/11 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'all', text: '全部拼团' },
    { key: 'order', text: '我的拼团' }
  ],
  tab: 'all'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function () {

  // 更新导航
  helper.navTitle('精选拼团');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 100);

  // 查询拼团列表
  this.queryPintuans();

},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this[ 'order' == this.data.tab ? 'queryOrders' : 'queryPintuans' ]( false );
},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this[ 'order' == this.data.tab ? 'queryOrders' : 'queryPintuans' ]('scrollend');
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
  this[ 'order' == tab ? 'queryOrders' : 'queryPintuans' ]( !isSame );
},
/* ------------------------------
 查询拼团列表
------------------------------ */
queryPintuans: function(paging){

  var
  existPintuans = this.data.pintuans,
  pageIndex = helper.nextPageIndex( existPintuans, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: ['wx/pin/list?returnLeaders=true&pageIndex=', pageIndex || 0].join(''),
    success: this.bindPintuans
  });

},
/* ------------------------------
 绑定显示拼团列表
------------------------------ */
bindPintuans: function(ret){

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);

  // 绑定数据
  helper.setData(this, { pintuans: helper.concatPaging(this, 'pintuans', ret) }, false);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

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
    url: [ 'wx/order/list?refType=Pintuan&pageIndex=', pageIndex || 0 ].join(''),
    success: this.bindOrders
  });

},
/* ------------------------------
 绑定显示订单列表
------------------------------ */
bindOrders: function(ret){

  var
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

  // 绑定数据
  helper.setData(this, { orders: helper.concatPaging(this, 'orders', ret) }, false);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

}

})
