/**
 * 优惠券列表
 * couponAll.js
 * -----------------------------------
 * 18/04/12 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'available', text: '未使用' },
    { key: 'used', text: '已使用' },
    { key: 'expired', text: '已失效' }
  ],
  tab: 'available'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts){

  var
  // 是否来自订单确认
  orderConfirm = 'orderConfirmCoupon' == opts.from,
  // 如果来自订单确认，只显示可用优惠券
  tabNavItems;

  if (orderConfirm){

    // 来自订单确认
    helper.navTitle('选择优惠券');

    // 只显示未使用的优惠券
    tabNavItems = [ { key: 'available', text: '未使用' } ];

  }
  else {

    // 默认
    helper.navTitle('优惠券');

    tabNavItems = [
      { key: 'available', text: '未使用' },
      { key: 'used', text: '已使用' },
      { key: 'expired', text: '已失效' }
    ];

  }

  // 保存传入的 tab index
  if (opts.tab)
    this.setData({ tab: opts.tab });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 是否来自订单确认
  this.setData({ orderConfirm: orderConfirm, tabNavItems: tabNavItems });

  // 查询优惠券列表
  this.queryCoupons();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryCoupons('scrollend');
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
  this.queryCoupons( !isSame );
},
/* ------------------------------
 查询优惠券列表
------------------------------ */
queryCoupons: function(paging){

  var
  tab = this.data.tab,
  existCoupons = this.data[ tab + '_coupons' ],
  pageIndex = helper.nextPageIndex( existCoupons, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: [ 'wx/coupon/items?pageIndex=', pageIndex || 0, '&status=', tab || '' ].join(''),
    success: this.bindCoupons
  });

},
/* ------------------------------
 绑定显示优惠券列表
------------------------------ */
bindCoupons: function(ret){

  var
  key = this.data.tab + '_coupons',
  coupons;

  // 日期字符串
  helper.each(ret.records, function(idx, coupon){
    coupon.issueTimeString = helper.d2str(coupon.issueTime);
    coupon.itemExpireTimeString = helper.d2str(coupon.itemExpireTime);
  });

  // 拼接分页数据
  coupons = helper.concatPaging(this, key, ret);

  // 绑定数据
  helper.setData(this, key, coupons);

},
/* ------------------------------
 处理优惠券Click
------------------------------ */
couponClick: function(e){

  var
  ds = e.currentTarget.dataset,
  itemId = ds.itemId,
  action = ds.action;

  // （最优先）如果来自"订单确认"页，返回 itemId 至前一页
  if (this.data.orderConfirm){
    helper.pageArg('orderConfirmCoupon', itemId);
    wx.navigateBack(1);
    return;
  }

  // 默认跳转到首页
  if ('useCoupon' == action){
    helper.switchTab('index');
    return;
  }

}


})
