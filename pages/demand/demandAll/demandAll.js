/**
 * 发布求购-列表页
 * demand.less
 * -----------------------------------
 * 18/11/8
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  // 更新导航标题
  helper.navTitle('求购信息');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 312);

  // 查询求购列表
  this.queryDemand();

},
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow: function (){


},
/* ------------------------------
 处理搜索Click
 ------------------------------ */
handleSearchClick: function(){
  helper.navigateTo('skuSearch');
},
/* ------------------------------
 下拉刷新
------------------------------ */
scrollToLower: function(){

  var sortVue = this.data.sortVue;

  // 分页查询（标识scrollend）
  this.queryDemand('scrollend', sortVue);

},
/* ------------------------------
 查询求购单列表
------------------------------ */
queryDemand: function(paging, sortVue, sVue){

  var
      existRESs = this.data.demandList,
      pageIndex = helper.nextPageIndex( existRESs, paging );

  if (pageIndex < 0)
    return;

  // 如果分页为0，清空已绑定（保证 scroll-view 滚动到顶部）
  if (!pageIndex)
    this.setData({ demandList: null });

  helper.request({
    url: '/wx/demand/all',
    data: {
      pageIndex: pageIndex || 0,
      sort: sortVue,
      s: sVue
    },
    success: this.bindDemand
  });

},
/* ------------------------------
 绑定显示采购单列表
------------------------------ */
bindDemand: function(ret){

  // 绑定排序 求购商家
  this.setData({  sortList: ret.sortFields, recordCount: ret.recordCount });

  // 截至时间 转换
  helper.bindDt2readable(ret.records, 'expireTime');

  // 绑定数据，同时隐藏搜索历史UI
  helper.setData(this, { demandList: helper.concatPaging(this, 'demandList', ret) }, false);
},
/* ------------------------------
 排序点击处理
 ------------------------------ */
sortClick: function (e) {

  var sortVue = e.currentTarget.dataset.key,
      sVue = this.data.keyword;

  // 绑定排序参数
  this.setData({ sortVue: sortVue });

  // 查询求购列表
  this.queryDemand('', sortVue, sVue);

},
/* ------------------------------
 搜索框事件
 ------------------------------ */
searchInput: function (e) {

  this.setData({ keyword:e.detail.value });

  if(!e.detail.value) {
    this.queryDemand();
  }

},
/* ------------------------------
 搜索事件
 ------------------------------ */
searchConfirm: function (e) {

  var sVue = this.data.keyword;

  this.queryDemand('', '', sVue);


}

})
