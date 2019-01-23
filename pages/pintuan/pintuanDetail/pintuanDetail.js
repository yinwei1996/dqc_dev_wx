/**
 * 拼团详情
 * pintuanDetail.js
 * -----------------------------------
 * 18/04/11 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { 
  hidden: 'hidden'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts) {

  // 更新导航标题
  helper.navTitle('拼团详情');

  // 绑定拼团编号
  this.setData({ pintuanId: opts.pintuanId });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 清除遗留的timeout
  if (this.data.lastTimeout)
    clearTimeout(this.data.lastTimeout);

  // 查询拼团详情
  this.queryPintuan();
},
/* ------------------------------
 查询拼团详情
------------------------------ */
queryPintuan: function(){

  helper.request({
    url: 'wx/pin/detail',
    data: { pintuanId: this.data.pintuanId },
    success: this.bindPintuan
  });

},
/* ------------------------------
 绑定显示拼团详情
------------------------------ */
bindPintuan: function(ret){

  var
  pintuan = ret.pintuan,
  sku = ret.sku;

  // 更新SKU首图URL
  pintuan.fullSkuImgUrl = helper.concatFullImgUrl(pintuan.skuImgUrl);

  // 更新拼团图片URL
  pintuan.fullImgUrl = helper.concatFullImgUrl(pintuan.imgUrl);

  // 将 desc 属性解析成图片URL（多个）
  this.parseDescImgUrl(sku);

  // 绑定显示拼团及SKU
  this.setData({ pintuan: pintuan, sku: sku });

  // 继续查询最早参团列表
  this.queryEarlyPintuanItems();

},/* ------------------------------
 查询最早参团列表
------------------------------ */
queryEarlyPintuanItems: function(){

  helper.request({
    url: 'wx/pin/items',
    data: { pintuanId: this.data.pintuanId },
    success: this.bindEarlyPintuanItems
  });

},
/* ------------------------------
 绑定显示最早参团列表
------------------------------ */
bindEarlyPintuanItems: function(items){
  this.countdownEarlyPintuanItems(items);
},
/* ------------------------------
 最早参团列表倒计时显示
------------------------------ */
countdownEarlyPintuanItems: function(items){

  var
  that = this,
  continueCountdown = false,
  lastTimeout = null;

  helper.each(items, function(idx, item){

    item.expireSeconds = item.expireSeconds - 1;
    item.expireSecondsString = helper.seconds2Str(item.expireSeconds);

    // 任意Item的倒计时变为零，刷新页面（优先，强制结束处理）
    if (item.joinItemAvailable && item.expireSeconds < 0) {
        that.onShow();
        return ( continueCountdown = false );
    }

    // 任意item的倒计时大于零，继续倒计时
    if (item.expireSeconds >= 0)
      continueCountdown = true;

  });

  // 设置下一次超时，并保留timeout引用
  if (continueCountdown)
    lastTimeout = setTimeout(function(){ that.countdownEarlyPintuanItems(items) }, 1000);

  // 绑定数据
  helper.setData(that, { earlyPintuanItems: items, lastTimeout: lastTimeout }, false);

},
/* ------------------------------
 刷新SKU的大图URL
------------------------------ */
bindFullImgUrl: function(pintuan){

  var fullImgUrls = [];

  helper.each(pintuan.imgUrls, function(idx, imgUrl){
    fullImgUrls.push( helper.concatFullImgUrl(imgUrl) );
  });

  pintuan.fullImgUrls = fullImgUrls;
  pintuan.fullImgUrl = fullImgUrls.length > 0 ? fullImgUrls[0] : null;

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
 处理分享Click
------------------------------ */
onShareAppMessage: function(e) {

  var
  pintuan = this.data.pintuan,
  path = helper.getSharePath(this, 'pintuanDetail', { pintuanId: pintuan.pintuanId });

  console.log('pintuanDetail.onShareAppMessage, path => ' + path);

  return {
    title: [ pintuan.itemUserCount, '人团 ￥', pintuan.price, ' | ', pintuan.pintuanName ].join(''),
    path: path,
    imageUrl: pintuan.fullSkuImgUrl + '/x245'
  }
},
/* ------------------------------
 大图预览
------------------------------ */
handleImagePreview: function(e){
  wx.previewImage({ urls: [ this.data.pintuan.fullImgUrl ] });
},
/* ------------------------------
 返回首页Click
------------------------------ */
handleOpHomeClick: function() {
  helper.switchTab('index');
},
/* ------------------------------
 开团
------------------------------ */
confirm: function(){

  var
  pintuan = this.data.pintuan;

  helper.request({
    loading: true,
    url: 'wx/order/confirmPintuan',
    data: { pintuanId: pintuan.pintuanId },
    success: function(order) { helper.navigateFormat('orderConfirm', { orderId: order.orderId, isPintuan: true }) }
  });

},
/* ------------------------------
 跳转到SKU详情页
------------------------------ */
buyNow: function(){
  helper.navigateFormat('skuDetail', { skuId: this.data.pintuan.skuId });
},
/* ------------------------------
 跳转到拼团详情页（Item）
------------------------------ */
handleItemClick: function(e){
  helper.navigateFormat('pintuanItem', { itemId: e.currentTarget.dataset.itemId });
},
/* ------------------------------
 跳转到HowTo页
------------------------------ */
redirectHowTo: function(){
  helper.navigateTo('skuHowTo');
}

})
