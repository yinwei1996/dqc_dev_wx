/**
 * 收货地址列表
 * addressAll
 * -----------------------------------
 * 19/02/21 Jerry 更新
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
onLoad(opts) {

  // 更新导航
  helper.navTitle('地址管理');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 是否来自订单确认
  this.setData({ orderConfirm: 'orderConfirmAddress' == opts.from });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
  // 查询地址列表
  this.queryAddress();
},
/* ------------------------------
 查询收货地址
------------------------------ */
queryAddress() {
  helper.request({ url: 'wx/address/list', success: this.bindAddress });
},
/* ------------------------------
 绑定显示收货地址
------------------------------ */
bindAddress(ret) {
  // 绑定数据
  this.setData({ allAddress: ret });
},
/* ------------------------------
 处理地址Click
------------------------------ */
addressClick(e) {

  var
  ds = e.currentTarget.dataset,
  action = e.target.dataset.action;

  // （最优先）如果来自"订单确认"页，返回 addressId 至前一页
  if (this.data.orderConfirm){
    helper.pageArg('orderConfirmAddress', ds.addressId);
    wx.navigateBack(1);
    return;
  }

  // 如果点击了"删除"按钮
  if ('del' == action){
    this.handleAddressAction(1, ds);
    return;
  }

  // 隐藏"删除"按钮（如果有）
  this.setData({ opAddressId: null });

  // 默认显示ActionSheet
  this.showAddressAction(ds);

},
/* ------------------------------
 显示地址项ActionSheet
------------------------------ */
showAddressAction(ds){

  var
  that =this,
  items = [],
  isDefault = ds.isDefault;

  // 0: 编辑
  items.push('编辑');

  // 1: 删除
  items.push('删除');

  // 2: 设为默认
  if (!isDefault)
    items.push('设为默认');

  wx.showActionSheet({
    itemList: items,
    success: (ret) => { that.handleAddressAction(ret.tapIndex, ds) }
  });

},
/* ------------------------------
 处理地址ActionSheet Click
------------------------------ */
handleAddressAction(tapIndex, ds){

  var
  addressId = ds.addressId;

  // 0: 编辑
  if (tapIndex == 0){
    helper.navigateFormat('addressModify', { addressId: addressId, type: this.data.addressType });
    return;
  }

  // 1: 删除
  if (tapIndex == 1){
    this.disableAddress(addressId, ds);
    return;
  }

  // 2: 设为默认地址
  if (tapIndex == 2){
    this.setDefaultAddress(addressId);
    return;
  }

},
/* ------------------------------
 跳转到新增地址页
------------------------------ */
addAddress(){
  // helper.navigateTo('addressModify');
  helper.navigateFormat('addressModify', { type: this.data.addressType });
},
/* ------------------------------
 设为默认地址
------------------------------ */
setDefaultAddress(addressId){

  helper.request({
    url: 'wx/address/setDefault',
    data: { addressId: addressId },
    success: this.onShow
  });

},
/* ------------------------------
 禁用收货地址
------------------------------ */
disableAddress(addressId, ds){

  var
  userName = ds.userName,
  mobileMasked = ds.mobileMasked;

  helper.request({
    confirm: [ '确认删除 ', userName, ' ', mobileMasked, '？' ].join(''),
    url: 'wx/address/setDisabled',
    data: { addressId: addressId },
    success: this.onShow
  });

},
/* ------------------------------
 地址项滑动开始
------------------------------ */
addressTouchStart(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  addressId = e.currentTarget.dataset.addressId,
  xy = e.touches[0];

  this.setData({
    touchStartAddressId: addressId,
    touchStartAddressX: xy.clientX,
    touchStartAddressY: xy.clientY
  });

  console.log(['touch start => ', addressId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 地址项滑动
------------------------------ */
addressTouchMove(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  addressId = e.currentTarget.dataset.addressId,
  xy = e.touches[0];

  this.setData({
    touchMoveAddressId: addressId,
    touchMoveAddressX: xy.clientX,
    touchMoveAddressY: xy.clientY
  });

  console.log(['touch move => ', addressId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 地址项滑动结束
------------------------------ */
addressTouchEnd(e){

  var
  addressId = e.currentTarget.dataset.addressId,
  startAddressId = this.data.touchStartAddressId,
  moveAddressId = this.data.touchMoveAddressId,
  distanceX,
  distanceY;

  if (!startAddressId || startAddressId != moveAddressId)
    return;

  distanceX = this.data.touchStartAddressX - this.data.touchMoveAddressX;
  distanceY = this.data.touchStartAddressY - this.data.touchMoveAddressY;

  // X轴从右到左距离超过一定标准的，显示"删除"操作
  this.setData({ opAddressId: distanceX >= 60 ? addressId : null });

  console.log(['touch end => ', startAddressId, ', distanceX: ', distanceX, ', distanceY: ', distanceY].join(''));

}

})
