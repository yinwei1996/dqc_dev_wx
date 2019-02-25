/**
 * 首页
 * index
 * -----------------------------------
 * 19/02/25 Jerry 更新
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
onLoad (opts) {

  // 更新导航标题
  helper.navTitle('大清仓');
},
/* ------------------------------
 页面显示
 ------------------------------ */
onShow(){

  // 查询数据
  this.queryData();
},
/* ------------------------------
 页面隐藏
 ------------------------------ */
onHide(){

  // 清除已存在的活动计时器
  this.clearActivityTimer();
},
/* ------------------------------
 下拉刷新
 ------------------------------ */
onPullDownRefresh(){

  // 查询数据
  this.queryData();
},
/* ------------------------------
 分享小程序
 ------------------------------ */
onShareAppMessage(){

  var path = helper.getSharePath(this, 'index');

  console.log('index.onShareAppMessage, path => ' + path);

  return {
    title: '大清仓',
    path: path
  }
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
  this.queryActivities( !isSame );
},
/* ------------------------------
 查询首页数据
 ------------------------------ */
queryData(){

  // 清除已存在的活动计时器
  this.clearActivityTimer();

  // 查询数据
  helper.request({ url: 'wx/index', success: this.bindData });

},
/* ------------------------------
 绑定显示初始数据
 ------------------------------ */
bindData(ret){

  // 绑定数据
  this.setData({
    ads: helper.bindFullImgUrl(ret.ads),
    categories: ret.categories.slice(0, 4),
    activities: ret.activities,
    activityCount: ret.activityCount,
    previewActivities: ret.previewActivities,
    previewActivityCount: ret.previewActivityCount,
    tabNavItems: [
      { key: 'activities', text: '活动中[' + ret.activityCount + ']' },
      { key: 'previewActivities', text: '预告[' + ret.previewActivityCount + ']' }
    ]
  });

  // 停止下拉动画
  wx.stopPullDownRefresh();

},
/* ------------------------------
 刷新限时购倒计时
------------------------------ */
refreshActivityCountdown(){

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
clearActivityTimer(){

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
changeAD(e){
  this.setData({ adIdx: e.detail.current + 1 });
},
/* ------------------------------
 处理广告Click
 ------------------------------ */
clickAD(e){

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
handleSearchClick(){
  helper.navigateTo('skuSearch');
},
/* ------------------------------
 查询活动列表
------------------------------ */
queryActivities(paging){

  var
  tab = this.data.tab,
  existActivities = this.data[ tab ],
  pageIndex = helper.nextPageIndex( existActivities, paging ),
  approveStatus;

  if (pageIndex < 0)
    return;

  if ('activities' == tab){
    approveStatus = 'Enabled';
  }
  else if ('previewActivities' == tab){
    approveStatus = 'Approved';
  }

  helper.request({
    url: helper.formatUrl('wx/act/list', { approveStatus, pageIndex }),
    success: this.bindActivities
  });

},
/* ------------------------------
 绑定显示活动
------------------------------ */
bindActivities(ret){

  var key = this.data.tab;

  // 格式化日期时间
  helper.bindDt2Str(ret.records, 'createTime');

  // 拼接绑定分页数据
  helper.setData(this, key, helper.concatPaging(this, key, ret));

}


})
