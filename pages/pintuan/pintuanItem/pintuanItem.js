/**
 * 拼团详情
 * pintuanItem.js
 * -----------------------------------
 * 18/04/11 Jerry 新增
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
onLoad: function (opts) {

  // 更新导航标题
  helper.navTitle('拼团详情');

  // 绑定详情编号
  helper.setData(this, { itemId: opts.itemId });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function () {

  // 清除遗留的timeout
  if (this.data.lastTimeout)
    clearTimeout(this.data.lastTimeout);

  // 查询拼团详情
  this.queryItem();
},
/* ------------------------------
 查询拼团详情
------------------------------ */
queryItem: function(){

  helper.request({
    url: 'wx/pin/item',
    data: { itemId: this.data.itemId },
    success: this.bindItem
  });

},
/* ------------------------------
 绑定显示拼团详情
------------------------------ */
bindItem: function(ret){

  var
  pintuan = ret.pintuan,
  item = ret.item;

  // 更新SKU首图URL
  pintuan.fullSkuImgUrl = helper.concatFullImgUrl(pintuan.skuImgUrl);

  // 更新拼团图片URL
  pintuan.fullImgUrl = helper.concatFullImgUrl(pintuan.imgUrl);

  // 创建已参团用户数组
  this.bindMembers(pintuan, item);

  // 绑定显示拼团详情
  helper.setData(this, { pintuan: pintuan }, false);

  // 倒计时
  this.countdownItem(item);

},
/* ------------------------------
 参团倒计时显示
------------------------------ */
bindMembers: function(pintuan, item){

  var
  itemUserCount = pintuan.itemUserCount,
  actualUserCount = item.actualUserCount,
  idx,
  emptyAvatarUrls = [];

  for (idx = 0; idx < ( itemUserCount - actualUserCount ); idx++)
    emptyAvatarUrls.push({ idx: idx });

  item.emptyAvatarUrls = emptyAvatarUrls;

},
/* ------------------------------
 参团倒计时显示
------------------------------ */
countdownItem: function(item){

  var
  that = this,
  lastTimeout = null;

  item.expireSeconds = item.expireSeconds - 1;
  item.expireSecondsString = helper.seconds2Str(item.expireSeconds);

  // 如果已超时，重新加载页面
  if (item.joinItemAvailable && item.expireSeconds < 0) {
    that.onShow();
    return;
  }

  // 设置下一次超时，并保留句柄
  if (item.expireSeconds >= 0)
    lastTimeout = setTimeout(function(){ that.countdownItem(item) }, 1000);

  // 绑定数据
  helper.setData(that, { item: item, lastTimeout: lastTimeout }, false);

},
/* ------------------------------
 处理分享Click
------------------------------ */
onShareAppMessage: function(e) {

  var 
  pintuan = this.data.pintuan,
  item = this.data.item,
  path = helper.getSharePath(this, 'pintuanItem', { itemId: item.itemId });

  console.log('pintuanItem.onShareAppMessage, path => ' + path);

  return {
    title: [pintuan.itemUserCount, '人团 ￥', pintuan.price, ' | ', pintuan.pintuanName].join(''),
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
 参团
------------------------------ */
join: function(){

  var
  item = this.data.item;

  helper.request({
    loading: true,
    url: 'wx/order/joinPintuan',
    data: { itemId: item.itemId },
    success: function(order) { helper.navigateFormat('orderConfirm', { orderId: order.orderId }) }
  });

},
/* ------------------------------
 跳转到SKU详情页
------------------------------ */
buyNow: function(){
  helper.navigateFormat('skuDetail', { skuId: this.data.pintuan.skuId });
},
/* ------------------------------
 跳转到拼团列表
------------------------------ */
redirectPintuanAll: function(){
  helper.switchTab('pintuanAll');
},
/* ------------------------------
 跳转到首页
------------------------------ */
redirectIndex: function(){
  helper.switchTab('index');
}

})
