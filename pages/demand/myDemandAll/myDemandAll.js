/**
 * 求购单-列表页
 * myDemandAll.js
 * -----------------------------------
 * 18/11/14
 */

var
    helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
页面数据
------------------------------ */
data: {
  tabNavItems: [],
  currentTab: 0,
  tabs:[
    { status: '', text: '所有求购' },
    { status: 'Approved', sale: true, text: '报价中' },
    { status: 'Approved', sale: false, text: '已下架' },
    { status: 'WaitingApprove', text: '待审核' },
    { status: 'Refused ', text: '已拒绝' },
    { status: 'ApprovedAndDone', text: '已合作' },
    { status: 'ApprovedAndExpired', text: '已结束' }
  ]
},
/* ------------------------------
页面加载
------------------------------ */
onLoad: function (opts) {

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 100);

  // 查询求购列表
  this.queryDemand();
},
/* ------------------------------
 每次页面显示时，刷新数据
 ------------------------------ */
onShow: function (){

  // 更新导航标题
  helper.navTitle('我的求购');

},
/* ------------------------------
页面触底
------------------------------ */
scrollToLower: function(){

  var sort = this.data.sort;

  // 分页查询（标识scrollend）
  this.queryDemand('scrollend', sort);
},
/* ------------------------------
处理Tab导航Click
------------------------------ */
tabNavClick: function(e) {

var
    tab = e.currentTarget.dataset.index,
    sort = e.currentTarget.dataset.key,
    sale = e.currentTarget.dataset.sale;

    // 切换tab
    this.setData({ currentTab: tab });

    // 查询数据
    this.queryDemand('', sort, sale);
},
/* ------------------------------
 查询求购单列表
------------------------------ */
queryDemand: function(paging, sort, sale){

  var
      existRESs = this.data.demandList,
      pageIndex = helper.nextPageIndex( existRESs, paging );

  if (pageIndex < 0)
    return;

  // 如果分页为0，清空已绑定（保证 scroll-view 滚动到顶部）
  if (!pageIndex)
    this.setData({ demandList: null });

  if(sale == undefined)
    sale = '';

  helper.request({
    url: '/wx/demand/list',
    data: {
      pageIndex: pageIndex || 0,
      approveStatus: sort,
      onSale: sale
    },
    success: this.bindDemand
  });

},
/* ------------------------------
 绑定显示采购单列表
------------------------------ */
bindDemand: function(ret){

  // 截至时间 装换
  helper.bindD2Str(ret.records, 'expireTime');
  helper.bindD2Str(ret.records, 'createTime');

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records, 'skuImgUrl');

  // 绑定数据，同时隐藏搜索历史UI
  helper.setData(this, { demandList: helper.concatPaging(this, 'demandList', ret) }, false);

},
/* ------------------------------
 预览上传图片
 ------------------------------ */
previewImgClick: function (e) {

  var current = e.target.dataset.id,
      urls = [];

  urls.push(current);

  wx.previewImage({
    current: current,
    urls: urls
  })

},
/* ------------------------------
 商品上架
 ------------------------------ */
upLineClick: function (e) {
  var
      that = this,
      demandId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认上架吗!' ].join(''),
    url: '/wx/demand/upLine',
    data: { demandId: demandId },
    success: function(ret){
      // 刷新求购列表
      that.queryDemand();
    }
  });

},
/* ------------------------------
商品下架
------------------------------ */
downLineClick: function (e) {

  var
      that = this,
      demandId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认下架吗!' ].join(''),
    url: '/wx/demand/downLine',
    data: { demandId: demandId },
    success: function(ret){
      // 刷新求购列表
      that.queryDemand();
    }
  });

}

})
