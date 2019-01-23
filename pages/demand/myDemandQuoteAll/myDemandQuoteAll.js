/**
 * 求购单报价-列表页
 * myDemandQuoteAll.js
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
    { status: {}, text: '全部' },
    { status: { readTimeNullable:true,doneTimeNullable:true,doneContractIdNullable:true}, text: '未查看' },
    { status: { readTimeNullable:false,doneTimeNullable:true,doneContractIdNullable:true }, text: '已查看' },
    { status: { doneTimeNullable:false,doneContractIdNullable:true }, text: '已达成' },
    { status: { doneContractIdNullable:false }, text: '合同生成' }
  ]
},
/* ------------------------------
页面加载
------------------------------ */
onLoad: function (opts) {

  // 默认参数sort=全部
  var sort = this.data.tabs[0].status;

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 100);

  // 查询报价
  this.queryQuote('', sort);
},
/* ------------------------------
 每次页面显示时，刷新数据
 ------------------------------ */
onShow: function (){

  // 更新导航标题
  helper.navTitle('发出的报价');

},
/* ------------------------------
 查询求购报价单列表
------------------------------ */
queryQuote: function(paging, sort){

  var
      existRESs = this.data.quoteList,
      pageIndex = helper.nextPageIndex( existRESs, paging );

      if (pageIndex < 0)
        return;

      // 如果分页为0，清空已绑定（保证 scroll-view 滚动到顶部）
      if (!pageIndex)
        this.setData({ quoteList: null });

      sort.pageIndex = pageIndex || 0;

      helper.request({
        url: '/wx/demand/quote/list',
        data: sort,
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
  helper.setData(this, { quoteList: helper.concatPaging(this, 'quoteList', ret) }, false);

},
/* ------------------------------
页面触底
------------------------------ */
scrollToLower: function(){

  var sort = this.data.sort;

  // 分页查询（标识scrollend）
  this.queryQuote('scrollend', sort);

},
/* ------------------------------
处理Tab导航Click
------------------------------ */
tabNavClick: function(e) {

  var
      tab = e.currentTarget.dataset.index,
      sort = e.currentTarget.dataset.key;

  // 切换tab
  this.setData({ currentTab: tab });

  // 查询数据
  this.queryQuote('', sort);
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
 撤销报价
 ------------------------------ */
revokeQuoteClick: function (e) {

  var
      that = this,
      quoteId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认撤销报价吗!' ].join(''),
    url: 'wx/demand/quote/revokeQuote',
    data: { quoteId: quoteId },
    success: function(ret){
      // 刷新求购列表
      that.queryQuote();
    }
  });

}


})
