/**
 * 我的发票
 * invoiceCenter.js
 * -----------------------------------
 * 18/11/27
 */

var
    helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
页面数据
------------------------------ */
data: {
  currentTab: 0,
  tabs:[
    { status: {}, text: '所有发票' },
    { status: { deliveryTimeNullable: true }, text: '待开票' },
    { status: { deliveryTimeNullable: false }, text: '已寄出' },
    { status: 'new', text: '待申请' }
  ],
  // isApplication待申请
  isApplication: false
},
/* ------------------------------
页面加载
------------------------------ */
onLoad: function (opts) {

  // 更新导航标题
  helper.navTitle('我的发票');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 200);

  // 查询发票列表
  this.queryInvoice();

},
/* ------------------------------
 每次页面显示时，刷新数据
 ------------------------------ */
onShow: function (){

},
/* ------------------------------
页面触底
------------------------------ */
scrollToLower: function(){

  var sort = this.data.sort;

  // 分页查询（标识scrollend）
  this.queryInvoice('scrollend', sort);
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

    // 待申请
    if(sort == 'new') {

      this.setData({ isApplication: true });

      // 待申请 列表查询参数 sort
      sort = {
        status: "Done",
        invoiceIdNullable: true
      }

    } else {

      // 发票列表
      this.setData({ isApplication: false });

    }

    // 查询数据
    this.queryInvoice('', sort);
},
/* ------------------------------
 查询发票列表
------------------------------ */
queryInvoice: function(paging, sort){

  var
      existRESs,
      pageIndex,
      isApplication = this.data.isApplication;

  // 待申请
  if(isApplication) {
    existRESs = this.data.orderList;
  } else {

    // 发票列表
    existRESs = this.data.invoiceList;
  }

  pageIndex = helper.nextPageIndex( existRESs, paging );

  if (pageIndex < 0)
    return;

  // 如果分页为0，清空已绑定（保证 scroll-view 滚动到顶部）
  if (!pageIndex)
    this.setData({ invoiceList: null });

  helper.request({
    url: isApplication ? 'wx/order/list' : 'wx/invoice/list',
    data: sort,
    success: this.bindInvoice
  });

},
/* ------------------------------
 绑定显示发票列表和订单列表
------------------------------ */
bindInvoice: function(ret){

  var
      isApplication = this.data.isApplication,
      skuQuantity;
  

  // 申请时间
  helper.bindD2Str(ret.records, 'createTime');

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records, 'skuImgUrl');

  if(isApplication) {

    helper.each(ret.records, function(idx, order){

      // 绑定SKU图片完整URL
      helper.bindFullImgUrl(order.skuMaps);

      // 统计SKU件数
      skuQuantity = 0;

      helper.each(order.skuMaps, function(idx2, map){
        skuQuantity += map.quantity;
      });

      order.skuQuantity = skuQuantity;

    });

    helper.setData(this, { orderList: helper.concatPaging(this, 'orderList', ret) }, false);


  } else {

    // 绑定数据，同时隐藏搜索历史UI 待申请
    helper.setData(this, { invoiceList: helper.concatPaging(this, 'invoiceList', ret) }, false);
    
  }

},
/* ------------------------------
 处理买家操作
 ------------------------------ */
invoiceBuyerOpClick: function(e){

  var
      orderId = e.currentTarget.dataset.orderId,
      action = e.target.dataset.action;

  // 申请开票
  if ('invoiceApplication' == action){
    this.invoiceApplication(orderId);
    return;
  }

},
/* ------------------------------
 发票详情
 ------------------------------ */
invoiceDetailClick: function (e) {

  var invoiceId = e.target.dataset.id;

  // 跳转 发票详情
  helper.navigateFormat('invoiceDetail', { invoiceId: invoiceId });

},
/* ------------------------------
 申请开票
 ------------------------------ */
invoiceApplication: function(orderId){

  // 跳转 申请开票
  helper.navigateFormat('invoiceApplication', { orderId: orderId });

}

})
