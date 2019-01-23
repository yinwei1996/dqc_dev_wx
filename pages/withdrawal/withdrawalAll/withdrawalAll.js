/**
 * 提现列表
 * withdrawalAll.js
 * -----------------------------------
 * 18/05/30 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'all', text: '全部' },
    { key: 'todo', text: '审核中' },
    { key: 'done', text: '已完成' }
  ],
  tab: 'all'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts){

  // 更新导航
  helper.navTitle('我的提现');

  // 保存传入的 tab index
  if (opts.tab)
    this.setData({ tab: opts.tab });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 查询提现列表
  this.queryWithdrawals();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryWithdrawals('scrollend');
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.queryWithdrawals( false );
},
/* ------------------------------
 处理Tab导航Click
------------------------------ */
tabNavClick: function(e) {

  var
  tab = e.currentTarget.dataset.navKey,
  isSame = tab == this.data.tab;

  // 切换tab
  this.setData({ tab: tab });

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.queryWithdrawals( !isSame );
},
/* ------------------------------
 查询提现列表
------------------------------ */
queryWithdrawals: function(paging){

  var
  tab = this.data.tab,
  existWithdrawals = this.data[ tab + '_withdrawals' ],
  pageIndex = helper.nextPageIndex( existWithdrawals, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: [ 'wx/withdrawal/list?pageIndex=', pageIndex || 0, '&status=', tab || '' ].join(''),
    success: this.bindWithdrawals
  });

},
/* ------------------------------
 绑定显示提现列表
------------------------------ */
bindWithdrawals: function(ret){

  var
  key = this.data.tab + '_withdrawals';

  helper.each(ret.records, function(idx, rec){
    rec.createTimeString = helper.dt2str(rec.createTime);
  });

  // 绑定数据
  helper.setData(this, key, helper.concatPaging(this, key, ret.records));

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 处理列表Click
------------------------------ */
withdrawalClick: function(e){

  var
  withdrawalId = e.currentTarget.dataset.withdrawalId;

// 跳转到提现详情页
  helper.navigateFormat('withdrawalDetail', { withdrawalId: withdrawalId });

}


})
