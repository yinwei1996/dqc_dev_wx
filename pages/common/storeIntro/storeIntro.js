/**
 * 企业介绍
 * storeIntro.js
 * -----------------------------------
 * 18/12/13
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { hiddenDescSheet: 'hidden' },
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  var sellerId = opts.seller || '9c7b9ea4fb8f49f5bbebbe42472fd667';

  // 更新导航标题
  if (opts.sellerName)
    helper.navTitle(opts.sellerName);

  // 绑定数据
  this.setData({ sellerId: sellerId });

},
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow: function (){

  // 查询店铺介绍
  this.queryIntro();

},
/* ------------------------------
 绑定店铺介绍
 ------------------------------ */
queryIntro() {

  // 查询数据
  helper.request({
    url: 'wx/store/intro',
    data: { seller: this.data.sellerId },
    success: this.bindData
  });

},
/* ------------------------------
 绑定数据
 ------------------------------ */
bindData: function(ret){

  // LOGO完整Url
  ret.corp.fullCorpLogoUrl = helper.concatFullImgUrl(ret.corp.corpLogoUrl);

  // 分类图标完整Url
  helper.bindFullImgUrl(ret.types, 'typeImageUrl', 'fullTypeImageUrl');

  // 更新导航标题
  helper.navTitle(ret.corp.corpName);

  // 绑定数据
  this.setData({ corp: ret.corp, types: ret.types.slice(0, 12) });
},
/* ------------------------------
 处理一级分类Click
 ------------------------------ */
handleTypesClick: function(e){

  var
      key = e.currentTarget.dataset.key;

  if (!key)
    return;

  helper.navigateFormat('skuCategory', { type1: key, seller: this.data.sellerId });

},
/* ------------------------------
 拨打电话
 ------------------------------ */
clickTel() {
  wx.makePhoneCall({ phoneNumber: this.data.corp.corpCsTel });
},
/* ------------------------------
 点击SKU分类导航
 ------------------------------ */
clickTypeNav(e) {

  var
    sellerId = this.data.sellerId,
    sellerName = this.data.corp.corpName,
    typeId = e.currentTarget.dataset.typeId;

  if (!typeId)
    return;

  // 跳转到SKU分类页
  helper.navigateFormat('skuCategory', { seller: sellerId, sellerName: sellerName, type1: typeId });
},
/* ------------------------------
 跳转到地图页
 ------------------------------ */
navLocation: function(){

  var
      corp = this.data.corp,
      latitude = corp.corpAddressLatitude,
      longitude = corp.corpAddressLongitude,
      address = [ corp.corpProvinceName, corp.corpCityName, corp.corpDistrictName, corp.corpAddress ].join('');

  wx.getLocation({
    type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
    success(res) {

      wx.openLocation({
        latitude,
        longitude,
        name: corp.corpDistrictName,
        address: address,
        scale: 18
      });

    }
  })

},
/* ------------------------------
 显示企业介绍Sheet
 ------------------------------ */
showDescSheet() {
  this.setData({ hiddenDescSheet: '' });
},
/* ------------------------------
 关闭企业介绍Sheet
 ------------------------------ */
closeDescSheet() {
  this.setData({ hiddenDescSheet: 'hidden' });
}

})
