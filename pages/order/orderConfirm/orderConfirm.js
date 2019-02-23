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
  anyToPay: false
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle('订单确认');

  // 查询订单
  this.queryOrder(opts.orderId || 'dca7e6b3a8b845c9aee61ada6678df05');

},
/* ------------------------------
 页面显示
------------------------------ */
onShow(){

  // 确认是否有来自地址列表页传入的addressId，
  // 如果有，查询地址详情，并更新 order.address
  // 确认是否有传入的收货地址
  var
  that = this,
  addressId = helper.pageArg('orderConfirmAddress');

  if (addressId) {
    // 收货地址
    this.bindAddress(addressId);
  }

},
/* ------------------------------
 查询订单
------------------------------ */
queryOrder(orderId){

  helper.request({
    url: 'wx/order/detail',
    data: { orderId: orderId },
    success: this.bindOrder
  })

},
/* ------------------------------
 绑定显示订单
------------------------------ */
bindOrder(order){

  // 绑定SKU缩略图的完整URL
  helper.each(order.skuGroups, (idx, grp) => helper.bindFullImgUrl(grp.skuMaps));

  order.skuAmountString = helper.fen2str(order.skuAmount);
  order.payableAmountString = helper.fen2str(order.payableAmount);

  // 绑定数据
  this.setData({ order: order });

  // 实物订单没有备选收货地址的，跳转到地址新增页
  if (!order.isVirtual && !order.address)
    this.selectAddress();

},
/* ------------------------------
 选择收货地址
------------------------------ */
selectAddress(){

  // 有备选地址时，跳转到地址列表页；没有时，跳转到地址新增页。
  helper.navigateFormat( this.data.order.address ? 'addressAll' : 'addressModify', { from: 'orderConfirmAddress' } );
},
/* ------------------------------
 绑定收货地址
------------------------------ */
bindAddress(addressId){

  var that = this;

  helper.request({
    url: 'wx/address/detail',
    data: { addressId: addressId },
    success (ret) { helper.setDataProp(that, 'order.address', ret) }
  });
},
/* ------------------------------
 刷新应付金额
------------------------------ */
refreshPayableAmount(){

  var
  order = this.data.order,
  skuAmount = order.skuAmount || 0,
  deliveryAmount = order.deliveryAmount || 0,
  payableAmount = skuAmount + deliveryAmoun;

  helper.setDataProp(this, 'order.payableAmount', payableAmount);
},
/* ------------------------------
 勾选"服务协议"
------------------------------ */
agreementCheckChange(){
  this.setData({ isAgree: !this.data.isAgree });
},
/* ------------------------------
 准备付款
------------------------------ */
preparePay(){

  var
  order = this.data.order,
  addr = order.address || {};

  helper.preparePay({
    payType: 'WechatPay',
    orderId: order.orderId,
    addressId: addr.addressId
  });
}

})
