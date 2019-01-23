/**
 * SKU详情
 * skuDetail.js
 * -----------------------------------
 * 18/03/19 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hidden: 'hidden',
  hiddenQuantitySheet: 'hidden',
  hiddenShareSheet: 'hidden'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts) {

  var
  // 先从 opts 获取 skuId
  skuId = opts.skuId;

  // 如果 skuId 为空，尝试从 opts.query.q 获取，
  // 仍然为空，跳转到首页
  if (!skuId)
    skuId = helper.parseQueryArgs(opts.q).skuId;

  if (!skuId) {
    helper.switchTab('index');
    return;
  }

  // 更新导航标题
  helper.navTitle('商品详情');

  // 绑定数据
  helper.setData(this, {
    skuId: skuId,
    // SKU描述最后的帮助图片
    helpImgUrls: [ ]
  });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 查询SKU详情
  this.querySKU();
},
/* ------------------------------
 页面隐藏
------------------------------ */
onHide: function(){

  // 清除已存在的限时购计时器
  this.clearFlashSaleTimer();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 查询SKU详情
  this.querySKU();
},
/* ------------------------------
 查询SKU详情
------------------------------ */
querySKU: function(){

  // 清除限时购计时器
  this.clearFlashSaleTimer();

  // 查询数据
  helper.request({
    url: 'wx/sku/detail',
    data: { skuId: this.data.skuId },
    success: this.bindSKU
  });

},
/* ------------------------------
 绑定显示SKU
------------------------------ */
bindSKU: function(ret){
  
  var
      that = this,
      sku = ret.sku,
      props = ret.props,
      cartCount = ret.cartCount,
      lastPrice = null;

  if (!sku.spec)
    sku.spec = '默认规格';

  helper.each(sku.availablePrices, function(idx, price){

    if (lastPrice)
      lastPrice.maxQuantity = price.minQuantity - 1;

    lastPrice = price;

  });

  /* 默认数量 */
  sku.quantity = sku.actualMinQuantity;

  // 更新大图URL
  this.bindFullImgUrl(sku);

  // 将 desc 属性解析成图片URL（多个）
  this.parseDescImgUrl(sku);

  // 绑定显示SKU
  helper.setData(this, { sku: sku, props: props, cartCount: cartCount }, false);

  // 刷新限时购倒计时
  this.refreshFlashSaleCountdown();

  // 继续查询SKU评价
  this.queryComments();

},
/* ------------------------------
 刷新限时购倒计时
------------------------------ */
refreshFlashSaleCountdown: function(){

  var
    that = this,
    sku = that.data.sku,
    isFuture = sku.flashSaleIsFuture,
    countdown = isFuture ? sku.flashSaleValidCountdown : sku.flashSaleExpireCountdown,
    label,
    val;

  // 没有关联限时购编号，不做处理
  if (!sku.flashSaleId)
    return;

  // 如果没有正在使用的倒计时，则以SKU关联的倒计时为准
  countdown = that.data.flashSaleCountdown || countdown;

  if (countdown && countdown > 1) {

    // 倒计时有效
    label = isFuture ? '距离开始' : '距离结束';
    val = helper.seconds2Str(countdown);
    countdown--;

    if (!that.data.flashSaleCountdownTimer) {
      that.setData({ flashSaleCountdownTimer: setInterval(function(){ that.refreshFlashSaleCountdown() }, 1000) });
      console.log('已创建限时购计时器');
    }

  }
  else {

    // 倒计时失效
    label = isFuture ? '抢购中' : null;
    val = null;
    countdown = null;

    // 清除计时器
    this.clearFlashSaleTimer();

  }

  // 同步数据
  that.setData({
    flashSaleCountdown: countdown,
    flashSaleCountdownLabel: label,
    flashSaleCountdownVal: val
  });

},
/* ------------------------------
 清除限时购计时器
------------------------------ */
clearFlashSaleTimer: function(){

  if (!this.data.flashSaleCountdownTimer)
    return;

  clearInterval(this.data.flashSaleCountdownTimer);
  this.setData({ flashSaleCountdownTimer: null });
  console.log('已清除限时购计时器');

},
/* ------------------------------
 刷新SKU的大图URL
------------------------------ */
bindFullImgUrl: function(sku){

  var fullImgUrls = [];

  helper.each(sku.imgUrls, function(idx, imgUrl){
    fullImgUrls.push( helper.concatFullImgUrl(imgUrl) );
  });

  sku.fullImgUrls = fullImgUrls;
  sku.fullImgUrl = fullImgUrls.length > 0 ? fullImgUrls[0] : null;

},
/* ------------------------------
 将 desc 属性解析成图片URL（多个）
------------------------------ */
parseDescImgUrl: function(sku){

    var
    descImgUrls = [],
    r = /img[^>]+\bsrc="([^"]+)"/ig,
    m;

    while ( m = ( r.exec( sku.desc ) ) )
      descImgUrls.push( helper.concatFullImgUrl( m[1] ) );

    sku.descImgUrls = descImgUrls;

},
/* ------------------------------
 查询评价
------------------------------ */
queryComments: function(){

  helper.request({
    url: 'wx/sku/comments',
    data: { skuId: this.data.skuId },
    success: this.bindComments
  });

},
/* ------------------------------
 绑定显示评价
------------------------------ */
bindComments: function(ret){

  var
  total = ret.total,
  commentPageIndex = ret.comments.pageIndex,
  comments = ret.comments.records;

  // 计算星星数
  this.bindStars(comments);

  // 绑定创建时间字符串
  this.bindDateTimeString(comments);

  this.setData({
    commentTotal: total,
    comments: comments
  });

  // 查询第一页评论时，绑定最近一条评论
  if (commentPageIndex == 1 && comments.length > 0)
    this.setData({ recentComments: [ comments[0] ] });

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 计算星星数
------------------------------ */
bindStars: function(comments){

  for (var idx = 0; idx < comments.length; idx++){

    var
    comment = comments[ idx ],
    starCount = comment.commentVal / 20,
    stars = [];

    for (var starIdx = 0; starIdx < starCount; starIdx++)
      stars.push(true);

    for (var starIdx = 0; starIdx < 5 - stars.length; starIdx++)
      stars.push(false);

    comment.stars = stars;

  }

},
/* ------------------------------
 计算星星数
------------------------------ */
bindDateTimeString: function(comments){

  for (var idx = 0; idx < comments.length; idx++){

    var comment = comments[ idx ];

    if (!comment.createTime)
      continue;

    comments[ idx ].createTimeString = helper.dt2str(comment.createTime);
  }

},
/* ------------------------------
 处理分享Click
------------------------------ */
onShareAppMessage: function(e) {

  var
  sku = this.data.sku,
  path = helper.getSharePath(this, 'skuDetail', { skuId: sku.skuId });

  console.log('skuDetail.onShareAppMessage, path => ' + path);

  return {
    title: sku.skuName,
    path: path,
    imageUrl: sku.fullImgUrl
  }
},
/* ------------------------------
 大图幻灯片切换
------------------------------ */
handleSwiperChange: function(e){
  this.setData({ swiperIndex: e.detail.current + 1 });
},
/* ------------------------------
 大图预览
------------------------------ */
handleImagePreview: function(e){

  var url = e.currentTarget.dataset.src;

  if (url)
    wx.previewImage({ urls: [ url ] });

},
/* ------------------------------
 返回首页Click
------------------------------ */
handleOpHomeClick: function() {
  helper.switchTab('index');
},
/* ------------------------------
 返回采购单Click
------------------------------ */
handleOpCartClick: function() {
  helper.switchTab('myCart');
},
/* ------------------------------
 处理底部菜单Click
------------------------------ */
handleOpClick: function(e) {

  var action = e.target.dataset.action;

  if (!action)
    return;

  // 加入采购单
  if ('addCart' == action){
    this.addCart();
    return;
  }

  // 立即购买
  if ('buyNow' == action){
    this.buyNow();
    return;
  }

},
/* ------------------------------
 跳转到SKU评价页
------------------------------ */
redirectComments: function(){
  helper.navigateFormat('skuCommentAll', { skuId: this.data.skuId });
},
/* ------------------------------
 显示分享选择器
------------------------------ */
showShareSheet: function(){
  this.setData({ hiddenShareSheet: '' });
},
/* ------------------------------
 隐藏分享选择器
------------------------------ */
hideShareSheet: function(e){

  var
  action = ( e.target || e.currentTarget ).dataset.action;

  if (!action)
    return;

  // 点击任意 action 都隐藏 sheet
  this.setData({ hiddenShareSheet: 'hidden' });

  // 点击 poster，发起生成海报的请求
  if ('poster' == action)
    this.queryPoster();

},
/* ------------------------------
 显示数量选择器
------------------------------ */
showQuantitySheet: function(action){

  // 显示数量选择器
  this.setData({ hiddenQuantitySheet: '', action: action });

},
/* ------------------------------
 隐藏数量选择器
------------------------------ */
hideQuantitySheet: function(e){

  var
  isOk = e.target.dataset.isOk,
  data = { hiddenQuantitySheet: 'hidden' };

  this.setData(data);

  // 如果点击了"确定'按钮，根据 action 加入采购单 或 立即购买
  if (!isOk)
    return;

  if ('addCart' == this.data.action) {
    this.addCart();
    return;
  }

},
/* ------------------------------
 数量加一
------------------------------ */
quantityAdd: function(){
  this.quantityChange(true);
},
/* ------------------------------
 数量减一
------------------------------ */
quantityReduce: function(){
  this.quantityChange(false);
},
/* ------------------------------
 数量调整
------------------------------ */
quantityChange: function(isAdd){

  var
  sku = this.data.sku,
  oriQuantity = sku.quantity;

  if (isAdd){

    // 数量加一
    if (oriQuantity >= sku.actualMaxQuantity)
      return;

    sku.quantity = oriQuantity + 1;

    if (sku.quantity >= sku.actualMaxQuantity)
      helper.showToast([ '商品限购', sku.actualMaxQuantity, sku.unitWithDefaultVal ].join(''), 'none');

  }
  else{

    // 数量减一
    if (sku.actualMinQuantity >= oriQuantity)
      return;

    sku.quantity = oriQuantity - 1;

    if (sku.quantity <= sku.actualMinQuantity)
      helper.showToast([ '商品', sku.actualMinQuantity, sku.unitWithDefaultVal, '起订' ].join(''), 'none');

  }

  // 绑定数据
  this.setData({ sku: sku });

},

/* ------------------------------
 加入采购单
------------------------------ */
addCart: function(){

  var
  that = this,
  sku = that.data.sku;

  // returnCartCount: true, 要求返回采购单项目总数

  helper.request({
    loading: true,
    url: 'wx/cart/add',
    data: { skuId: sku.skuId, quantity: sku.quantity, returnCartCount: true },
    success: function(ret){
      // 刷新采购单数量
      that.setData({cartCount: ret.cartCount });
      // 显示提示消息
      helper.showToast('已加入采购单');
    }
});

},
/* ------------------------------
 加入采购单
------------------------------ */
buyNow:function(){

  var
  sku = this.data.sku;

  helper.request({
    loading: true,
    url: 'wx/order/confirmBuyNow',
    data: { skuId: sku.skuId, quantity: sku.quantity },
    success: function(order) { helper.navigateFormat('orderConfirm', { orderId: order.orderId }) }
  });

},
/* ------------------------------
 查询商品海报
------------------------------ */
queryPoster: function(){

  var
  that = this,
  sku = that.data.sku;

  // 发起海报生成请求
  helper.request({
    url: 'wx/sku/poster',
    data: { skuId: sku.skuId },
    loading: true,
    success: function(ret){

      // 绑定海报URL
      that.setData({ posterUrl: ret.url });

      // 保存海报图片
      that.savePoster();

    }
  });

},
/* ------------------------------
 保存商品海报之前获取授权
------------------------------ */
savePoster: function(){

  wx.authorize({
    scope: 'scope.writePhotosAlbum',
    success: this.savePosterImpl,
    fail: function(){
      // 保存失败
      wx.showModal({
        title: '提示',
        content: '您未授权云小茗保存图片到系统相册，相关功能暂不可用。',
        showCancel: false,
        confirmText: '知道了'
      });

    }
  });

},
/* ------------------------------
 保存商品海报到系统相册
------------------------------ */
savePosterImpl: function(){

  var posterUrl = this.data.posterUrl;

  // 下载海报到本地
  wx.downloadFile({
    url: posterUrl,
    success: function(ret){
      // 保存图片到系统相册
      wx.saveImageToPhotosAlbum({
        filePath: ret.tempFilePath,
        success: function(){ wx.showToast({ title: '已保存商品海报', icon: 'success' }) }
      });
    }
  });

},
/* ------------------------------
 跳转到限时购列表
------------------------------ */
clickFlashSale: function(){
  helper.redirectTo('flashSaleAll');
},
/* ------------------------------
 跳转到店铺首页
 ------------------------------ */
clickStore() {
  var sku = this.data.sku;
  helper.navigateFormat('store', { seller: sku.seller, sellerName: sku.sellerName });
}

});
