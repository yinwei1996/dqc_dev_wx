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
data: { },
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
 查询首页数据
 ------------------------------ */
queryData(){
  // 查询数据
  helper.request({ url: 'wx/index', success: this.bindData });
},
/* ------------------------------
 绑定显示初始数据
 ------------------------------ */
bindData(ret){

  // 绑定数据
  this.setData(ret);

  // 停止下拉动画
  wx.stopPullDownRefresh();

},
/* ------------------------------
 大图幻灯片切换
 ------------------------------ */
changeAd(e){
  this.setData({ adIdx: e.detail.current + 1 });
},
/* ------------------------------
 处理广告Click
 ------------------------------ */
clickAd(e){

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
clickActivityAll(e){
  helper.navigateFormat('activityAll', { categoryId: e.currentTarget.dataset.categoryId });
},
/* ------------------------------
 点击搜索框
 ------------------------------ */
clickSearchBar(){
  helper.navigateTo('skuSearch');
}


})
