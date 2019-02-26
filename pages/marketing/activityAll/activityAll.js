/**
 * 活动列表
 * activityAll
 * -----------------------------------
 * 19/02/26 Jerry 新增
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
  helper.navTitle('活动列表');

  if (opts.categoryId)
    this.setData({ categoryId: opts.categoryId });

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
 查询首页数据
 ------------------------------ */
queryData(){
  // 查询数据
  helper.request({ url: helper.formatUrl('wx/act', { categoryId: this.data.categoryId }), success: this.bindData });
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
 点击类目
 ------------------------------ */
clickCategory(e){

  var categoryId = e.currentTarget.dataset.categoryId;

  // 绑定数据
  this.setData({ categoryId });

  // 查询数据（活动中、预告，同时查询）
  this.queryData();

}

})
