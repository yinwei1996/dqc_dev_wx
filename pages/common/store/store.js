/**
 * 店铺-首页
 * store.js
 * -----------------------------------
 * 18/12/13
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  var sellerId = opts.seller;

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

  // 查询店铺信息
  this.queryStore();

},

/* ------------------------------
 处理分享Click
------------------------------ */
onShareAppMessage: function(e) {

  var
  seller = this.data.seller,
  path = helper.getSharePath(this, 'store', { seller: seller.userId, sellerName: seller.corpName });

  console.log('store.onShareAppMessage, path => ' + path);

  return {
    title: seller.corpName,
    path: path
  }
},
/* ------------------------------
 查询数据
 ------------------------------ */
queryStore:function(){

  // 查询数据
  helper.request({
    url: 'wx/store',
    data: { seller: this.data.sellerId },
    success: this.bindData
  });

},
/* ------------------------------
 绑定显示顶部广告列表
 ------------------------------ */
bindData: function(ret){

  // 企业LOGO完整Url
  if (ret.seller)
    ret.seller.fullCorpLogoUrl = helper.concatFullImgUrl(ret.seller.corpLogoUrl);

  // SKU品牌完整Url
  helper.bindFullImgUrl(ret.brands, 'brandImageUrl', 'fullBrandImageUrl');

  // 热销SKU完整图片Url
  helper.bindFullImgUrl(ret.recommendSkus);

  // 新品SKU完整图片Url
  helper.bindFullImgUrl(ret.newSkus);

  helper.each(ret.types, function(idx, type){
    helper.bindFullImgUrl(type.skus);
  });

  // 更新导航标题
  helper.navTitle(ret.seller.corpName);

  // 绑定数据
  this.setData(ret);

},
/* ------------------------------
 Click搜索框
 ------------------------------ */
handleSearchClick() {

  var
    sellerId = this.data.sellerId,
    sellerName = this.data.seller.corpName;

  helper.navigateFormat('skuSearch', { seller: sellerId, sellerName: sellerName });
},
/* ------------------------------
 跳转到企业介绍页
 ------------------------------ */
navIntro() {

  var
    sellerId = this.data.sellerId,
    sellerName = this.data.seller.corpName;

  helper.navigateFormat('storeIntro', { seller: sellerId, sellerName: sellerName });
},

/* ------------------------------
 点击SKU分类楼层
 ------------------------------ */
clickTypeFloor(e) {

  var
    sellerId = this.data.sellerId,
    sellerName = this.data.seller.corpName,
    typeId = e.currentTarget.dataset.typeId;

  if (!typeId)
    return;

  // 跳转到SKU分类页
  helper.navigateFormat('skuCategory', { seller: sellerId, sellerName: sellerName, type1: typeId });

}


})
