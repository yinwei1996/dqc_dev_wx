/**
 * SKU搜索
 * skuSearch
 * -----------------------------------
 * 19/02/27 Jerry 新增
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
onLoad: function(opts){

  var
  keyword = opts.keyword || 'hello',
  // 如果没有传入关键词，显示搜索历史
  histories = !keyword ? wx.getStorageSync('searchHistory') : null;

  helper.navTitle('商品搜索');

  // 绑定数据
  if (keyword)
    this.setData({ keyword });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 尝试按关键词搜索
  this.querySKUs();

},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.querySKUs('scrollend');
},
/* ------------------------------
 处理搜索
------------------------------ */
searchConfirm: function(e){

  // 绑定关键词
  this.setData({ keyword: e.detail.keyword || '' });

  // 搜索SKU
  this.querySKUs();

},
/* ------------------------------
 按关键词查询SKU列表
------------------------------ */
querySKUs: function(paging){

  var
  existSpuMaps = this.data.spuMaps,
  pageIndex = helper.nextPageIndex( existSpuMaps, paging ),
  keyword = this.data.keyword;

  if (pageIndex < 0 || !keyword)
    return;

  // 如果分页为0，清空已绑定的SKU（保证 scroll-view 滚动到顶部）
  if (!pageIndex)
    this.setData({ spuMaps: null });

  helper.request({
    url: helper.formatUrl('wx/act/spu/list', { s: encodeURIComponent(keyword), pageIndex }),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs: function(ret){

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);

  // 绑定数据，同时隐藏搜索历史UI
  helper.setData(this, { spuMaps: helper.concatPaging(this, 'spuMaps', ret) }, false);

}


})
