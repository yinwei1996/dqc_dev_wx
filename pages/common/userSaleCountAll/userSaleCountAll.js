/**
 * 销售明细列表
 * userSaleCountAll
 * -----------------------------------
 * 19/02/22 Jerry 新增
 */

var
helper = require('../../../utils/helper.js'),
today = new Date();

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  dayStart: helper.d2str(helper.dtAdd(today, -1, 'month')),
  dayEnd: helper.d2str(today),
  monthStart: helper.d2str(today).replace(/\-[0-9]+$/ig, ''),
  monthEnd: helper.d2str(today).replace(/\-[0-9]+$/ig, ''),
  tabNavItems: [
    { key: 'day', text: '日销售额' },
    { key: 'month', text: '月销售额' }
  ],
  tab: 'day'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts) {

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 240);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow(){
  // 查询销售额统计
  this.queryLogs();
},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower(){

  // 分页查询（标识scrollend）
  this.queryLogs('scrollend');

},/* ------------------------------
 处理Tab导航Click
------------------------------ */
tabNavClick(e) {

  var
  tab = e.currentTarget.dataset.navKey,
  isSame = tab == this.data.tab;

  // 切换tab
  this.setData({ tab: tab });

  // 查询销售统计
  this.queryLogs();
},
/* ------------------------------
 查询销售统计
------------------------------ */
queryLogs(){

  var
    tab = this.data.tab,
    queryUrl,
    queryArgs = {};

  if ('month' === tab) {
    // 月销售额（服务器端只处理年月，所以日期参数补零，保证格式正确即可）
    queryUrl = 'wx/my/sale/countByMonth';
    queryArgs[ 'dateStart' ] = this.data.monthStart + '-01';
    queryArgs[ 'dateEnd' ] = this.data.monthEnd + '-01';
  }
  else {
    // 日销售额
    queryUrl = 'wx/my/sale/countByDay';
    queryArgs[ 'dateStart' ] = this.data.dayStart;
    queryArgs[ 'dateEnd' ] = this.data.dayEnd;
  }

  helper.request({
    url: helper.formatUrl(queryUrl, queryArgs),
    success: this.bindLogs
  });

},
/* ------------------------------
 绑定显示日志
------------------------------ */
bindLogs(ret){

  var
  key = this.data.tab + '_logs',
  args = {};

  // 格式化金额显示
  helper.each(ret, (idx, log) => { log.saleAmountString = helper.fen2str(log.saleAmount) });

  // 绑定数据
  args[ key ] = ret;
  this.setData(args);

},
/* ------------------------------
 更新日销售额开始时间
------------------------------ */
changeDayStart(e){

  var
    val = e.detail.value,
    daysDif = helper.dateDiff(helper.obj2dt(val), helper.obj2dt(this.data.dayEnd));

  console.log('userSaleCountAll.changeDayStart => daysDif: ' + daysDif);

  if (daysDif < 0){
    helper.showToast('开始日期不能晚于结束日期', 'none');
    return;
  }

  // 0也包括在日期内，所以区间应在30以内
  if (daysDif >= 31) {
    helper.showToast('日期范围不能超过31天', 'none');
    return;
  }

  this.setData({ dayStart: val });
  this.queryLogs();

},
/* ------------------------------
 更新日销售额结束时间
------------------------------ */
changeDayEnd(e){

  var
    val = e.detail.value,
    daysDif = helper.dateDiff(helper.obj2dt(this.data.dayStart), helper.obj2dt(val));

  console.log('userSaleCountAll.changeDayEnd => daysDif: ' + daysDif);

  if (daysDif < 0){
    helper.showToast('结束日期不能早于开始日期', 'none');
    return;
  }

  // 0也包括在日期内，所以区间应在30以内
  if (daysDif >= 31) {
    helper.showToast('日期范围不能超过31天', 'none');
    return;
  }

  this.setData({ dayEnd: val });
  this.queryLogs();

},
/* ------------------------------
 更新月销售额开始时间
------------------------------ */
changeMonthStart(e){

  var
    val = e.detail.value,
    monthsDif = helper.dateDiff(helper.obj2dt(val + '-01'), helper.obj2dt(this.data.monthEnd + '-01'), 'month');

  console.log('userSaleCountAll.changeMonthStart => monthsDif: ' + monthsDif);

  if (monthsDif < 0){
    helper.showToast('开始月份不能晚于结束月份', 'none');
    return;
  }

  // 0也包括在日期内，所以区间应在12以内
  if (monthsDif >= 12) {
    helper.showToast('月份范围不能超过12个月', 'none');
    return;
  }

  this.setData({ monthStart: val });
  this.queryLogs();

},
/* ------------------------------
 更新月销售额结束时间
------------------------------ */
changeMonthEnd(e){

  var
    val = e.detail.value,
    monthsDif = helper.dateDiff(helper.obj2dt(this.data.monthStart + '-01'), helper.obj2dt(val + '-01'), 'month');

  console.log('userSaleCountAll.changeMonthEnd => monthsDif: ' + monthsDif);

  if (monthsDif < 0){
    helper.showToast('结束月份不能早于开始月份', 'none');
    return;
  }

  // 0也包括在日期内，所以区间应在12以内
  if (monthsDif >= 12) {
    helper.showToast('月份范围不能超过12个月', 'none');
    return;
  }

  this.setData({ monthEnd: val });
  this.queryLogs();
}

})
