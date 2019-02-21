/**
 * 收货地址新增/编辑
 * addressModify.js
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
  address: {}
},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle( opts.addressId ? '编辑收货地址' : '新增收货地址' );

  // 是否来自订单确认
  this.setData({ orderConfirm: 'orderConfirmAddress' == opts.from });

  // 如果传入了addressId，查询详情
  this.queryAddress(opts.addressId);

},
/* ------------------------------
 查询地址详情
 ------------------------------ */
queryAddress(addressId){

  if (!addressId)
    return;

  helper.request({
    url: 'wx/address/detail',
    data: { addressId: addressId },
    success: this.bindAddress
  });

},
/* ------------------------------
 绑定显示地址详情
 ------------------------------ */
bindAddress(ret){
  // 绑定数据
  this.setData({ address: ret });
},
/* ------------------------------
 输入所在地区
 ------------------------------ */
changeRegion(e){

  var
    region = e.detail.region,
    addr = this.data.address;

    console.log('addressModify.changeRegion =>');
    console.log(region);

    addr.province = region.province;
    addr.provinceName = region.provinceName;
    addr.city = region.city;
    addr.cityName = region.cityName;
    addr.area = region.area;
    addr.areaName = region.areaName;
    addr.street = region.street;
    addr.streetName = region.streetName;

    this.setData({ address: addr });

},
/* ------------------------------
 输入收货人姓名
 ------------------------------ */
changeDefault(e){

  var addr = this.data.address;
  addr.isDefault = e.detail.isChecked;

  this.setData({ address: addr });

  console.log('addressModify.changeDefault => isDefault: ' + addr.isDefault);

},
/* ------------------------------
 输入收货人姓名
 ------------------------------ */
inputUserName(e){
  this.inputProperty(e, 'userName');
},
/* ------------------------------
 输入手机号
 ------------------------------ */
inputMobile(e){
  this.inputProperty(e, 'mobile');
},
/* ------------------------------
 输入详细地址
 ------------------------------ */
inputAddress(e){
  this.inputProperty(e, 'address');
},
/* ------------------------------
 输入详细地址
 ------------------------------ */
inputUserIdNo(e){
  this.inputProperty(e, 'userIdNo');
},
/* ------------------------------
 输入属性（私有）
 ------------------------------ */
inputProperty(e, prop){

  // 更新属性为输入值
  var addr = this.data.address;
  addr[ prop ] = e.detail.value;

  // 绑定数据
  this.setData({ address: addr });

},
/* ------------------------------
 保存地址
 ------------------------------ */
saveAddress(){

  var addr = this.data.address;

  helper.request({
    url: addr.addressId ? 'wx/address/modify' : 'wx/address/add',
    data: addr,
    success: this.afterSave
  });

},
/* ------------------------------
 保存地址之后，跳转到指定页面
 ------------------------------ */
afterSave(addr){

  // 如果来自"订单确认"页，返回 addressId 至前一页
  if (this.data.orderConfirm){
    helper.pageArg('orderConfirmAddress', addr.addressId);
    wx.navigateBack(1);
    return;
  }

  // 默认返回地址列表
  wx.navigateBack();

}

})
