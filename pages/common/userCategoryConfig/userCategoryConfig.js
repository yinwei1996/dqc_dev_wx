/**
 * 关注品类设置
 * userCategoryConfig
 * -----------------------------------
 * 19/02/21 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: { },
/* ------------------------------
 页面显示
------------------------------ */
onReady() {
  // 更新导航
  helper.navTitle('关注品类设置');
},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
  this.queryConfigs();
},
/* ------------------------------
 下拉刷新
 ------------------------------ */
onPullDownRefresh(){
  this.queryConfigs();
},
/* ------------------------------
 查询配置列表
------------------------------ */
queryConfigs() {

  if (!this.userCategoryConfigPart)
    this.userCategoryConfigPart = this.selectComponent('#userCategoryConfigPart');

  this.userCategoryConfigPart.query();
},
/* ------------------------------
 配置查询完成
------------------------------ */
queryDone() {
  // 停止下拉动画
  wx.stopPullDownRefresh();
}

})
