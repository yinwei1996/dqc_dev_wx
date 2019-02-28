/**
 * 活动专场
 * activityDetail
 * -----------------------------------
 * 19/02/19 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hiddenSortItems: 'hidden',
  hiddenQuantitySheet: 'hidden',
  tabNavItems: [
    { key: 'spuMaps', text: '商品列表' },
    { key: 'material', text: '内容素材' }
  ],
  tab: 'spuMaps'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts) {

  var
  // 先从 opts 获取 activityId
  activityId = opts.activityId || 'f551cb32340911e9af6054e1ad01c5be';

  // 如果 activityId 为空，尝试从 opts.query.q 获取，
  // 仍然为空，跳转到首页
  if (!activityId)
    activityId = helper.parseQueryArgs(opts.q).activityId;

  if (!activityId) {
    helper.switchTab('index');
    return;
  }

  // 更新导航标题
  helper.navTitle('活动专场');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 340);

  // 绑定数据
  helper.setData(this, { activityId: activityId });

},
/* ------------------------------
 页面呈现
------------------------------ */
onShow(){
  // 查询活动详情
  this.queryActivity();
},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower(){

  // 分页查询（标识scrollend）
  this.querySPUs('scrollend');
},
/* ------------------------------
 处理Tab导航Click
------------------------------ */
tabNavClick(e) {

  var
  tab = e.currentTarget.dataset.navKey,
  isSame = tab == this.data.tab;

  // 切换tab
  this.setData({ tab: tab });

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.querySPUs( !isSame );
},
/* ------------------------------
 查询活动详情
------------------------------ */
queryActivity(){

  helper.request({
    url: 'wx/act/detail',
    data: { activityId: this.data.activityId },
    success: this.bindActivity
  });

},
/* ------------------------------
 绑定显示活动
------------------------------ */
bindActivity(ret){

  var
    tabNavItems = this.data.tabNavItems,
    activity = ret.activity,
    spuMaps = ret.spuMaps;

  // 绑定活动品牌完整Url
  activity.fullBrandImageUrl = helper.concatFullImgUrl(activity.brandImageUrl);

  // 绑定SPU图片完整Url
  this.bindSpuImageUrls(spuMaps);

  // Tab导航项的数量显示
  tabNavItems[ 0 ].count = spuMaps.recordCount;

  // 绑定数据
  this.setData({ activity, spuMaps, tabNavItems });

},
/* ------------------------------
 绑定SPU九宫格完整URL
------------------------------ */
bindSpuImageUrls(spuMaps){

  helper.each(spuMaps.records, (idx, map) => {
    map.fullImageUrls = [];
    helper.each(map.imageUrls || [], (idx, url) => map.fullImageUrls.push(helper.concatFullImgUrl(url)));
    map.priceBString = helper.fen2str(map.priceB);
  });

},
/* ------------------------------
 分页查询SPU列表
------------------------------ */
querySPUs(paging){

  var
  activityId = this.data.activityId,
  existSPUs = this.data.spuMaps,
  sort = this.data.sort,
  pageIndex = helper.nextPageIndex( existSPUs, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: helper.formatUrl('/wx/act/spu/list', { activityId, sort, pageIndex }),
    success: this.bindSPUs
  });

},
/* ------------------------------
 绑定显示SPU列表
------------------------------ */
bindSPUs(ret){

  var tabNavItems = this.data.tabNavItems;

  // 绑定SPU图片完整Url
  this.bindSpuImageUrls(ret);

  // Tab导航项的数量显示
  tabNavItems[ 0 ].count = ret.recordCount;

  // 绑定数据
  this.setData({ spuMaps: helper.concatPaging(this, 'spuMaps', ret), tabNavItems });

},

/* ------------------------------
 查询SKU列表
------------------------------ */
querySKUs(batchId, spuId){

  helper.request({
    url: helper.formatUrl('/wx/act/sku/list', { batchId, spuId }),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs(skuMaps){

  helper.each(skuMaps, (idx, map) => {
    map.fullImageUrl = helper.concatFullImgUrl(map.imageUrl);
    map.priceBString = helper.fen2str(map.priceB);
    map.marketPriceString = helper.fen2str(map.marketPrice);
    map.quantity = 1;
  });

  // 绑定数据
  helper.setData(this, { skuMaps: skuMaps, skuMap: skuMaps[0] });

  // 加购物车
  this.showQuantitySheet();

},
/* ------------------------------
 点击图片
------------------------------ */
clickSpu(e){

  var
    spuMaps = this.data.spuMaps,
    curIdx = parseInt(e.currentTarget.dataset.idx),
    curMap = spuMaps.records[ curIdx ],
    curImageUrl = e.target.dataset.imageUrl,
    action = e.target.dataset.action;

  // 如果有图片Url，预览图片
  if (curImageUrl) {
    wx.previewImage({ urls: curMap.fullImageUrls, current: curImageUrl });
    return;
  }

  // 加入购物车
  if (action === 'addCart') {
    // 查询相关SKU映射列表
    this.querySKUs(curMap.batchId, curMap.spuId);
    return;
  }

},
/* ------------------------------
 点击排序标签
------------------------------ */
clickSortLabel(){
  this.setData({ hiddenSortItems: this.data.hiddenSortItems === 'hidden' ? ''  : 'hidden'});
},
/* ------------------------------
 点击排序项
------------------------------ */
clickSortItem(e){

  var
    ds = e.currentTarget.dataset,
    sort = ds.key,
    sortLabelText = ds.text || '',
    sortLabelIco = ds.ico || '';

  // 绑定数据
  this.setData({ sortLabelText, sortLabelIco, sort, hiddenSortItems: 'hidden' });

  // 查询SPU列表
  this.querySPUs();

},
/* ------------------------------
 下载全部合成图片
------------------------------ */
downloadCombinedImage(e){

  var activityId = e.currentTarget.dataset.activityId;

  helper.request({
    loading: true,
      url: 'wx/act/poster',
      data: { activityId },
      success: (ret) => {
        // 绑定海报URL
        this.setData({ posterUrl: ret.url });
        // 保存海报图片
        this.savePoster();
    }
  });

},
/* ------------------------------
 保存商品海报之前获取授权
------------------------------ */
savePoster(){

  wx.authorize({
    scope: 'scope.writePhotosAlbum',
    success: this.savePosterImpl,
    fail: () => {
      // 保存失败
      wx.showModal({
        title: '提示',
        content: '您未授权大清仓保存图片到系统相册，相关功能暂不可用。',
        showCancel: false,
        confirmText: '知道了'
      });

    }
  });

},
/* ------------------------------
 保存商品海报到系统相册
------------------------------ */
savePosterImpl(){

  var posterUrl = this.data.posterUrl;

  // 下载海报到本地
  wx.downloadFile({
    url: posterUrl,
    success: (ret) => {
      // 保存图片到系统相册
      wx.saveImageToPhotosAlbum({
        filePath: ret.tempFilePath,
        success: () => wx.showToast({ title: '已保存商品海报', icon: 'success' })
      });
    }
  });

},
/* ------------------------------
 转发活动H5链接
------------------------------ */
copyH5Url(e){

  var activityId = e.currentTarget.dataset.activityId;

  helper.request({
    loading: true,
      url: 'wx/act/shareUrl',
      data: { activityId },
      success: (ret) => helper.showToast(ret.url, 'none')
  });

},
/* ------------------------------
 立即下单
------------------------------ */
clickBuyNow(e){

  var d = e.detail;

  console.log('activityDetail.clickBuyNow =>');
  console.log(d);

  helper.request({
    loading: true,
    url: 'wx/order/confirmBuyNow',
    data: d,
    success: (order) => {
      // 关闭数量Sheet
      this.closeQuantitySheet();
      // 跳转到订单确认页
      helper.navigateFormat('orderConfirm', { orderId: order.orderId });
    }
  });

},
/* ------------------------------
 加入购物车
------------------------------ */
clickAddCart(e){

  var d = e.detail;

  console.log('activityDetail.clickAddCart =>');
  console.log(d);

  helper.request({
    loading: true,
    url: 'wx/cart/add',
    data: d,
    success: (order) => {
      // 关闭数量Sheet
      this.closeQuantitySheet();
    }
  });

},
/* ------------------------------
 显示数量选择器
------------------------------ */
showQuantitySheet(){

  if (!this.quantitySheet)
    this.quantitySheet = this.selectComponent('#quantitySheet');

  this.quantitySheet.showSheet();

},
/* ------------------------------
 显示数量选择器
------------------------------ */
closeQuantitySheet(){

  if (!this.quantitySheet)
    this.quantitySheet = this.selectComponent('#quantitySheet');

  this.quantitySheet.closeSheet();

}

})
