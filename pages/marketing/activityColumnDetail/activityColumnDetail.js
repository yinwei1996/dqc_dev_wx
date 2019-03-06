/**
 * 活动栏目详情
 * activityColumnDetail
 * -----------------------------------
 * 19/03/06 Jerry 新增
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

  if (!opts.columnId)
    opts.columnId = 'cfb49539084a976ba676ecd25eb9bb0e';

  if (opts.columnId)
    this.setData({ columnId: opts.columnId });

},
/* ------------------------------
 页面渲染完成
 ------------------------------ */
onReady(){
  // 更新导航标题
  helper.navTitle('主题活动');
},
/* ------------------------------
 页面显示
 ------------------------------ */
onShow(){
  this.queryData();
},
/* ------------------------------
 下拉刷新
 ------------------------------ */
onPullDownRefresh(){
  this.queryData();
},
/* ------------------------------
 查询首页数据
 ------------------------------ */
queryData(){
  // 查询数据
  helper.request({
    url: helper.formatUrl('wx/col/detail', { columnId: this.data.columnId }),
    success: this.bindData
  });
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
