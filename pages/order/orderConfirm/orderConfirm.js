/**
 * 订单下单
 * orderConfirm.js
 * -----------------------------------
 * 18/03/23 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  hidden: 'hidden',
  /* 默认同意服务协议（目前不显示CheckBox） */
  isAgree: true
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle(opts.isPintuan ? '拼团订单' : '填写订单');

  // 查询订单
  this.queryOrder(opts.orderId);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 确认是否有来自地址列表页传入的addressId，
  // 如果有，查询地址详情，并更新 order.address
  // 确认是否有传入的收货地址、发票、优惠券、云豆扣减
  var
  that = this,
  addressId = helper.pageArg('orderConfirmAddress'),
  invoiceId = helper.pageArg('orderConfirmInvoice'),
  couponItemId = helper.pageArg('orderConfirmCoupon'),
  bean = helper.pageArg('orderConfirmBean');

  if (addressId) {
    // 收货地址
    this.bindAddress(addressId);
  }
  else if (invoiceId){
    // 发票
    this.bindInvoice(invoiceId);
  }
  else if (couponItemId){
    // 优惠券
    this.bindCoupon(couponItemId);
  }
  else if (bean){
    // 云豆抵扣
    this.bindBean(bean);
  }

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

  // 绑定SKU缩略图的完整URL
  helper.each(order.skuGroups, function(idx, grp){
    helper.bindFullImgUrl(grp.skuMaps);
  });

  // 绑定数据
  helper.setData(this, { order: order }, false);

  // 如果订单没有默认收货地址，跳转到地址新增页
  if (!order.address)
    this.selectAddress();

},
/* ------------------------------
 选择收货地址
------------------------------ */
selectAddress: function(){

  // 有备选地址时，跳转到地址列表页；没有时，跳转到地址新增页。
  helper.navigateFormat( this.data.order.address ? 'addressAll' : 'addressModify', { from: 'orderConfirmAddress' } );
},
/* ------------------------------
 绑定收货地址
------------------------------ */
bindAddress: function(addressId){

  var that = this;

  helper.request({
    url: 'wx/address/detail',
    data: { addressId: addressId },
    success: function (ret) { helper.setDataProp(that, 'order.address', ret) }
  });
},
/* ------------------------------
 选择发票
------------------------------ */
selectInvoice: function(){

  var
  invoice = this.data.order.invoice,
  invoiceId = invoice ? invoice.invoiceId : null;

  // 跳转到发票编辑页
  helper.navigateFormat( 'invoiceModify', { from: 'orderConfirmInvoice', invoiceId: invoiceId } );
},
/* ------------------------------
 绑定发票
------------------------------ */
bindInvoice: function(invoiceId){

  var that = this;

  helper.request({
    url: 'wx/invoice/detail',
    data: { invoiceId: invoiceId },
    success: function (ret) { helper.setDataProp(that, 'order.invoice', ret) }
  });
},
/* ------------------------------
 选择优惠券
------------------------------ */
selectCoupon: function(){

  var availableCouponItemCount = this.data.order.availableCouponItemCount;

  if (!availableCouponItemCount)
    return;

  // 跳转到可用优惠券列表页
  helper.navigateFormat( 'couponAll', { from: 'orderConfirmCoupon' } );
},
/* ------------------------------
 绑定优惠券
------------------------------ */
bindCoupon: function(itemId){

  var that = this;

  helper.request({
    url: 'wx/coupon/itemBeforeUse',
    data: { itemId: itemId, orderId: this.data.order.orderId },
    success: function (ret) {

      helper.setDataProp(that, 'order.couponItem', ret);
      // 刷新应付金额
      that.refreshPayableAmount();
    }
  });
},
/* ------------------------------
 选择云豆抵扣
------------------------------ */
selectBean: function(){

  var availableBean = this.data.order.availableBean;

  if (!availableBean)
    return;

  // 跳转到云豆抵扣页
  helper.navigateFormat( 'beanReduce', { orderId: this.data.order.orderId } );
},
/* ------------------------------
 绑定云豆抵扣
------------------------------ */
bindBean: function(bean){

  // 绑定数据
  helper.setDataProp(this, 'order.bean', bean);

  // 刷新应付金额
  this.refreshPayableAmount();
},
/* ------------------------------
 刷新应付金额
------------------------------ */
refreshPayableAmount: function(){

  var
  order = this.data.order,
  skuAmount = order.skuAmount || 0,
  deliveryAmount = order.deliveryAmount || 0,
  commissionAmount = order.commisionAmount || 0,
  couponItemAmount = order.couponItem ? order.couponItem.denomination : 0,
  beanAmount = order.bean ? order.bean.amount : 0,
  payableAmount = skuAmount + deliveryAmount + commissionAmount - couponItemAmount - beanAmount;

  helper.setDataProp(this, 'order.payableAmount', payableAmount);
},
/* ------------------------------
 勾选"服务协议"
------------------------------ */
agreementCheckChange: function(){
  this.setData({ isAgree: !this.data.isAgree });
},
/* ------------------------------
 准备付款
------------------------------ */
preparePay: function(){

  var
  order = this.data.order,
  addr = order.address || {},
  invoice = order.invoice || {},
  couponItem = order.couponItem || {},
  bean = order.bean || {};

  helper.preparePay({
    orderId: order.orderId,
    addressId: addr.addressId,
    invoiceId: invoice.invoiceId,
    couponItemId: couponItem.itemId,
    // 注意这里传的是云豆数量
    bean: bean.val
  });
}

})
