/**
 * 退换货列表样式
 * rmaAll.less
 * -----------------------------------
 * 18/04/08 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts){

  // 更新导航
  helper.navTitle('退换货');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 查询退换货列表
  this.queryRMAs();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryRMAs('scrollend');
},
/* ------------------------------
 查询退换货列表
------------------------------ */
queryRMAs: function(paging){

  var
  existRMAs = this.data.rmas,
  pageIndex = helper.nextPageIndex( existRMAs, paging ),
  status;

  if (pageIndex < 0)
    return;

  helper.request({
    url: [ 'wx/rma/list?pageIndex=', pageIndex || 0 ].join(''),
    success: this.bindRMAs
  });

},
/* ------------------------------
 绑定显示退换货列表
------------------------------ */
bindRMAs: function(ret){

  helper.each(ret.records, function(idx, rma){
    // 绑定SKU图片完整URL
    helper.bindFullImgUrl(rma.orderSkuMaps);
  });

  // 绑定数据
  helper.setData(this, { rmas: helper.concatPaging(this, 'rmas', ret) }, false);

},
/* ------------------------------
 申请退换货
------------------------------ */
requestRMA: function(){
  helper.navigateTo('rmaOrders');
},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}

})
