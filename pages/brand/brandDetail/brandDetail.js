/**
 * 品牌详情样式
 * brandDetail.less
 * -----------------------------------
 * 18/09/18 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts) {

  var
  sellerId = opts.seller,
  brandId = opts.brandId;

  if (!brandId) {
    helper.switchTab('index');
    return;
  }

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 0);

  // 绑定数据
  helper.setData(this, { seller: sellerId, brandId: brandId });

},
/* ------------------------------
 页面呈现
------------------------------ */
onShow: function(){
  // 查询品牌详情
  this.queryBrand();
},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.querySKUs('scrollend');
},
/* ------------------------------
 查询品牌详情
------------------------------ */
queryBrand: function(){

  helper.request({
    url: 'wx/brand/detail',
    data: { brandId: this.data.brandId },
    success: this.bindBrand
  });

},
/* ------------------------------
 绑定显示品牌
------------------------------ */
bindBrand: function(ret){

  var
    that = this,
    tabNavItems = [],
    queryUrls = {},
    key;

  // 更新导航标题
  helper.navTitle(ret.brand.brandName);

  // 绑定数据
  helper.setData(this, { brand: ret.brand });

  this.querySKUs();

},
/* ------------------------------
 查询SKU列表
------------------------------ */
querySKUs: function(paging){

  var
  sellerId = this.data.sellerId,
  brandId = this.data.brandId,
  existSKUs = this.data.skus,
  pageIndex = helper.nextPageIndex( existSKUs, paging ),
  queryArgs;

  if (pageIndex < 0)
    return;

  queryArgs = { seller: sellerId, brandId: brandId, pageIndex: pageIndex || 0 };

  helper.request({
    url: helper.formatUrl('/wx/sku/list', queryArgs),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs: function(ret){

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);

  // 拼接分页数据并绑定
  helper.setData(this, { skus: helper.concatPaging(this, 'skus', ret) });

}

})
