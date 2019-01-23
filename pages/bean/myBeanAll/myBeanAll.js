/**
 * 我的云豆
 * myBeanAll.js
 * -----------------------------------
 * 18/04/06 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hidden: 'hidden',
  tabNavItems: [
    { key: 'all', text: '全部' },
    { key: 'commission', text: '返佣' },
    { key: 'reduce', text: '抵扣' },
    { key: 'withdrawal', text: '提现' }
  ],
  tab: 'all'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts) {

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 320);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){
  // 查询统计
  this.querySummary();
},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryLogs('scrollend');

},/* ------------------------------
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
  this.queryLogs( !isSame );
},
/* ------------------------------
 查询统计
------------------------------ */
querySummary: function(){

  helper.request({
    url: 'wx/bean/summary',
    success: this.bindSummary
  });

},
/* ------------------------------
 绑定显示统计
------------------------------ */
bindSummary: function(ret){

  var
  data = {
    account: ret.account
  };

  // 绑定数据
  helper.setData(this, data, false);

  // 继续查询日志列表
  this.queryLogs();

},
/* ------------------------------
 查询日志列表
------------------------------ */
queryLogs: function(paging){

  var
  tab = this.data.tab,
  existLogs = this.data[ tab + '_logs' ],
  pageIndex = helper.nextPageIndex( existLogs, paging ),
  refType;

  if (pageIndex < 0)
    return;

  if ('commission' == tab){
    refType = 'OrderCommission';
  }
  else if ('reduce' == tab){
    refType = 'OrderReduce';
  }
  else if ('withdrawal' == tab){
    refType = 'Withdrawal';
  }

  helper.request({
    url: [ 'wx/bean/logs?pageIndex=', pageIndex || 0, '&refType=', refType || '' ].join(''),
    success: this.bindBeans
  });

},
/* ------------------------------
 绑定显示云豆
------------------------------ */
bindBeans: function(ret){

  var
  key = this.data.tab + '_logs';

  // 格式化日期时间
  helper.bindDt2Str(ret.records, 'createTime');

  // 拼接绑定分页数据
  helper.setData(this, key, helper.concatPaging(this, key, ret));

},
/* ------------------------------
 跳转到"提现列表"
------------------------------ */
redirectWithdrawalAll: function(){
  helper.navigateTo('withdrawalAll');
},
/* ------------------------------
 跳转到"申请提现"
------------------------------ */
redirectWithdrawalModify: function(){
  helper.navigateTo('withdrawalModify');
}

})
