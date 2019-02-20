/**
 * index.js - 首页
 * -----------------------------------
 * 18/03/14 Jerry 新增
 * 18/09/18 Jerry 新增活动楼层的查询及加载
 */
var
  helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
 ------------------------------ */
data: {
  tabNavItems: [
    { key: 'activities', text: '活动中' },
    { key: 'previewActivities', text: '预告' }
  ],
  tab: 'activities'
},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function (opts) {

  // 更新导航标题
  helper.navTitle('大清仓');
},
/* ------------------------------
 页面显示
 ------------------------------ */
onShow: function(){

  // 查询数据
  this.queryData();
},
/* ------------------------------
 页面隐藏
 ------------------------------ */
onHide: function(){

  // 清除已存在的活动计时器
  this.clearActivityTimer();
},
/* ------------------------------
 下拉刷新
 ------------------------------ */
onPullDownRefresh: function(){

  // 查询数据
  this.queryData();
},
/* ------------------------------
 分享小程序
 ------------------------------ */
onShareAppMessage: function(){

  var path = helper.getSharePath(this, 'index');

  console.log('index.onShareAppMessage, path => ' + path);

  return {
    title: '大清仓',
    path: path
  }
},
/* ------------------------------
 查询首页数据
 ------------------------------ */
queryData: function(){

  // 清除已存在的活动计时器
  this.clearActivityTimer();

  // 查询数据
  helper.request({ url: 'wx/index', success: this.bindData });

},
/* ------------------------------
 绑定显示顶部广告列表
 ------------------------------ */
bindData: function(ret){

  // 广告
  this.bindADs(ret.ads);

  // SKU类目
  this.bindCategories(ret.categories);

  // 活动
  this.bindActivities(ret);

  // 停止下拉动画
  wx.stopPullDownRefresh();

},
/* ------------------------------
 绑定显示广告列表
 ------------------------------ */
bindADs: function(recs){
  this.setData({ swiperList: helper.bindFullImgUrl(recs) });
},
/* ------------------------------
 绑定显示一级分类
 ------------------------------ */
bindCategories(ret){

  // 最多显示4个
  ret = ret.slice(0, 4);

  // 绑定分类
  this.setData({ categories: ret });

},
/* ------------------------------
 绑定显示活动列表
 ------------------------------ */
bindActivities(ret){

  // 绑定数据
  this.setData({
    activities: ret.activities,
    activityCount: ret.activityCount,
    previewActivities: ret.previewActivities,
    previewActivityCount: ret.previewActivityCount,
    tabNavItems: [
      { key: 'activities', text: '活动中[' + ret.activityCount + ']' },
      { key: 'previewActivities', text: '预告[' + ret.previewActivityCount + ']' }
    ]
  });

},
/* ------------------------------
 刷新限时购倒计时
------------------------------ */
refreshActivityCountdown: function(){

  var
    that = this,
    sale = that.data.flashSale,
    countdown,
    label,
    val;

  if (!sale)
    return;

  // 获取倒计时秒数
  countdown = that.data.flashSaleCountdown || sale.countdown;

  if (countdown && countdown > 1) {

    // 秒数有效
    label = '距离结束';
    val = helper.seconds2Str(countdown);
    countdown--;

    if (!that.data.flashSaleCountdownTimer) {
      that.setData({ flashSaleCountdownTimer: setInterval(function(){ that.refreshActivityCountdown() }, 1000) });
      console.log('已创建活动计时器');
    }

  }
  else {

    // 秒数无效
    label = '已结束';
    val = null;
    countdown = null;

    // 清除计时器
    this.clearActivityTimer();

  }

  // 同步数据
  that.setData({
    flashSaleCountdown: countdown,
    flashSaleCountdownLabel: label,
    flashSaleCountdownVal: val
  });

},
/* ------------------------------
 清除活动计时器
 ------------------------------ */
clearActivityTimer: function(){

    if (!this.data.flashSaleCountdownTimer)
      return;

    // 清除计时器（倒计时秒数也再清除一次）
    clearInterval(this.data.flashSaleCountdownTimer);
    this.setData({ flashSaleCountdownTimer: null, flashSaleCountdown: null });

    console.log('已清除活动计时器');

},
/* ------------------------------
 大图幻灯片切换
 ------------------------------ */
changeAD: function(e){
  this.setData({ swiperIndex: e.detail.current + 1 });
},
/* ------------------------------
 处理广告Click
 ------------------------------ */
clickAD: function(e){

  var
      lnkUrl = e.currentTarget.dataset.lnkUrl,
      m;

  if (!lnkUrl)
    return;

  // SKU详情页
  m = /\bskuId=([a-z0-9]+)/ig.exec(lnkUrl);
  if (m) {
    helper.navigateFormat('skuDetail', { skuId: m[1] });
    return;
  }

  // 拼团详情页
  m = /\bpintuanId=([a-z0-9]+)/ig.exec(lnkUrl);
  if (m) {
    helper.navigateFormat('pintuanDetail', { pintuanId: m[1] });
    return;
  }

  // 活动详情页
  m = /\/act\/([^.]+)\.html/ig.exec(lnkUrl);
  if (m) {
    helper.navigateFormat('activityDetail', { urlCode: m[1] });
    return;
  }

},
/* ------------------------------
 处理搜索框Click
 ------------------------------ */
handleSearchClick: function(){
  helper.navigateTo('skuSearch');
},
/* ------------------------------
 处理一级分类Click
 ------------------------------ */
handleTypesClick: function(e){

  var key = e.currentTarget.dataset.key;

  if (!key)
    return;

  helper.navigateFormat('skuCategory', { type1: key });

},
/* ------------------------------
 跳转到拼团列表
 ------------------------------ */
redirectPintuanAll: function(){
  helper.switchTab('pintuanAll');
},
/* ------------------------------
 跳转到限时购列表
 ------------------------------ */
redirectFlashSaleAll: function(){
  helper.navigateTo('flashSaleAll');
},
/* ------------------------------
 跳转到求购列表
 ------------------------------ */
redirectDemandAll: function(){
  helper.navigateTo('demandAll');
},
/* ------------------------------
 查询采供列表
 ------------------------------ */
queryResale: function(){

  helper.request({
    url: 'wx/demand/all',
    data: { pageSize: 4, pageIndex: 0 },
    success: this.bindResale
  });

},
/* ------------------------------
 绑定采购列表
 ------------------------------ */
bindResale: function(ret){

  // 绑定数据
  helper.bindDt2readable(ret.records, 'expireTime');

  this.setData({ demandList: ret });

},
/* ------------------------------
 供求信息tab切换
 ------------------------------ */
resTabClick:function (e) {

  var
      key = e.target.dataset.key,
      depot = this.data.depot;

  if (depot.res == key)
    return;

      depot['res'] = key;

  if (key === 'demand') {
    depot['idx'] = 0;
    depot['resUrl'] = '/pages/demand/demandAll/demandAll';
  }

  if (key === 'supply') {
    depot['idx'] = 1;
    depot['resUrl'] = '/pages/supply/supplyAll/supplyAll';
  }

  this.setData({ depot: depot });

}

})
