/**
 * 限时购列表
 * flashSaleAlll.js
 * -----------------------------------
 * 18/04/11 Jerry 新增
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
onLoad: function () {

  // 更新导航
  helper.navTitle('限时购');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 180);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 查询限时购列表
  this.querySales();
},
/* ------------------------------
 页面隐藏
------------------------------ */
onHide: function(){

  // 清除已存在的倒计时
  this.clearTimer();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 查询限时购列表
  this.querySales();
},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.querySkus('scrollend');
},
/* ------------------------------
 处理导航Click
------------------------------ */
clickNav: function(e) {

  var
  saleId = e.currentTarget.dataset.saleId,
  isSame = saleId == this.data.curSale.saleId,
  curSale;

  if (isSame)
    return;

  // 找到新的限时购
  helper.each(this.data.sales, function(idx, sale){
    if (saleId == sale.saleId)
      curSale = sale;
  });

  console.log([ '切换到新的限时购Tab => ', curSale.validTimeString ].join(''));

  // 切换tab
  this.setData({ curSale: curSale });

  // 刷新倒计时
  this.refreshCountdown();

  // 查询SKU
  this.querySkus();
},
/* ------------------------------
 查询限时购列表
------------------------------ */
querySales: function(){

  // 清除已存在的倒计时
  this.clearTimer();

  // 数据查询
  helper.request({
    url: 'wx/flashSale/list',
    success: this.bindSales
  });

},
/* ------------------------------
 绑定显示限时购列表
------------------------------ */
bindSales: function(ret){

  var curSale;

  helper.each(ret.sales, function(idx, sale){

    // 默认找到今天的限时购
    if (sale.isToday)
      curSale = sale;

    // 日期转字符串
    sale.validTimeString = helper.d2str(sale.validTime, { ignoreYear: true, monthEndfix: true, dayEndfix: true });

  });

  // 绑定数据
  helper.setData(this, { sales: ret.sales, curSale: curSale }, false);

  // 刷新倒计时
  this.refreshCountdown();

  // 查询SKU列表
  this.querySkus();

},
/* ------------------------------
 刷新显示倒计时
------------------------------ */
refreshCountdown: function(){

  var
    that = this,
    curSale = that.data.curSale,
    countSeconds = that.data.countSeconds || 0,
    countdown = curSale.countdown - countSeconds,
    countdownString;

  console.log(['刷新倒计时 => ', curSale.validTimeString, ', countdown: ', countdown].join(''));

  if (countdown > 0) {
    countdownString = [ curSale.isFuture ? '距离开始' : '本场剩余', helper.seconds2Str(countdown) ].join(' ');
  }
  else {
    countdownString = curSale.isFuture ? '抢购中' : '已结束';
  }

    that.setData({
      countSeconds: countSeconds + 1,
      curCountdownString: countdownString
    });

    // countSeconds 是全局变量，要一直累加
    if (!that.data.countdownTimer) {
      that.setData({ countdownTimer: setInterval(function(){ that.refreshCountdown() }, 1000) });
      console.log('已创建限时购计时器');
    }

},
/* ------------------------------
 清除限时购计时器
------------------------------ */
clearTimer: function(){

  if (!this.data.countdownTimer)
    return;
  
  // 清除计时器（同时也清除秒数）
  clearInterval(this.data.countdownTimer);
  this.setData({ countdownTimer: null, countSeconds: null });
  console.log('已清除限时购计时器');

},
/* ------------------------------
 查询SKU列表
------------------------------ */
querySkus: function(paging){

  var
  curSaleId = this.data.curSale.saleId,
  existSkus = this.data.skus,
  pageIndex = helper.nextPageIndex( existSkus, paging ),
  url;

  if (pageIndex < 0)
    return;

  if (pageIndex == 0)
    this.setData({ skus: { loading: true } });

  url = [ 'wx/sku/list?flashSaleId=', curSaleId, '&pageIndex=', pageIndex ].join('');

  helper.request({
    url: url,
    success: this.bindSkus
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSkus: function(ret){

  helper.each(ret.records, function(idx, sku){

    // SKU图片完整URL
    sku.fullImgUrl = helper.concatFullImgUrl(sku.imgUrl);

    // 已完成库存占比
    var donePercent = sku.flashSaleTotalQuantity > 0
      ? ( sku.flashSaleDoneQuantity / sku.flashSaleTotalQuantity * 100 )
      : 100;

    // 方便显示，如果宽度大于0，小于8%，设为8%（刚好有个小圆点）
    if (donePercent > 0 && donePercent < 8)
      donePercent = 8;

    sku.flashSaleDoneQuantityPercent = donePercent;

  });

  // 绑定数据
  helper.setData(this, { skus: helper.concatPaging(this, 'skus', ret) }, false);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

}

})
