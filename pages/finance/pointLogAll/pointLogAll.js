/**
 * 积分日志列表
 * pointLogAll
 * -----------------------------------
 * 19/02/22 Jerry 更新
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
    { key: 'in', text: '入账' },
    { key: 'out', text: '出账' }
  ],
  tab: 'all'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts) {

  // 导航标题
  helper.navTitle('积分账户');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 240);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow(){
  // 查询积分余额
  this.queryPoint();
},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower(){

  // 分页查询（标识scrollend）
  this.queryLogs('scrollend');

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
  this.queryLogs( !isSame );
},
/* ------------------------------
 查询统计
------------------------------ */
queryPoint(){

  helper.request({
    url: 'wx/account/point',
    success: this.bindPoint
  });

},
/* ------------------------------
 绑定积分余额
------------------------------ */
bindPoint(ret){

  // 绑定数据
  this.setData(ret);

  // 继续查询日志列表
  this.queryLogs();

},
/* ------------------------------
 查询日志列表
------------------------------ */
queryLogs(paging){

  var
  tab = this.data.tab,
  existLogs = this.data[ tab + '_logs' ],
  pageIndex = helper.nextPageIndex( existLogs, paging ),
  queryArgs = {},
  isAdd = null;

  if (pageIndex < 0)
    return;

  if ('in' == tab){
    isAdd = 'true';
  }
  else if ('out' == tab){
    isAdd = 'false';
  }

  if (isAdd)
    queryArgs[ 'add' ] = isAdd;

  queryArgs[ 'type' ] =  'Point';
  queryArgs[ 'pageIndex' ] = pageIndex || 0;

  helper.request({
    url: helper.formatUrl('wx/account/log/list', queryArgs),
    success: this.bindLogs
  });

},
/* ------------------------------
 绑定显示日志
------------------------------ */
bindLogs(ret){

  var
  key = this.data.tab + '_logs';

  // 格式化日期时间
  helper.bindDt2Str(ret.records, 'createTime');

  // 拼接绑定分页数据
  helper.setData(this, key, helper.concatPaging(this, key, ret));

},

/* ------------------------------
 绑定显示日志
------------------------------ */
clickLogItem(e){

  var
    key = this.data.tab + '_logs',
    logs = this.data[ key ],
    curIdx = parseInt(e.currentTarget.dataset.idx),
    curLog = logs.records[ curIdx ];

  wx.showModal({
    title: '详情',
    content: [
      curLog.createTimeString, ' ',
      curLog.refTypeTitle, curLog.difAmount, '积分。',
      curLog.memo ? [ '备注：', curLog.memo ].join('') : ''
    ].join(''),
    showCancel: false
  });

}

})
