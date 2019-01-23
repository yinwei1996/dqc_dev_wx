/**
 * 个人中心
 * myCenter.js
 * -----------------------------------
 * 18/03/14 Jerry 新增
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
onLoad: function(){
  // 更新导航
  helper.navTitle('企业中心');
},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 查询最近订单
  this.querySummary();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 查询最近订单
  this.querySummary();
},
/* ------------------------------
 绑定用户数据（在 querySummary 之后执行，尝试登录之后）
------------------------------ */
bindUser: function(){

  // 根据用户登录状态，刷新页面
  var
  user = helper.getUser(),
  wxUser = helper.getWxUser();

  // 绑定数据
  helper.setData(this, { user: user, wxUser: wxUser }, false);

  // 如果 nextUrl 有值，需要做对应跳转
  this.handleNextUrl();

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 处理 nextUrl
------------------------------ */
handleNextUrl: function(){

  var
  m = /\bnextUrl=([^&]+)/ig.exec( helper.pageArg('myCenter') || '' ),
  nextUrl = m ? m[1] : null;

  if (!nextUrl)
    return;

  if ('myCode' == nextUrl){
    this.redirectMyCode();
    return;
  }

  if ('orderAll' == nextUrl){
    this.handleOrderClick();
    return;
  }

  if ('couponAll' == nextUrl){
    this.handleCouponClick();
    return;
  }

  if ('addressAll' == nextUrl){
    this.handleAddressClick();
    return;
  }

},
/* ------------------------------
 查询摘要
------------------------------ */
querySummary: function(){
  helper.request({ url: 'wx/my/summary', success: this.bindSummary });
},
/* ------------------------------
 绑定显示摘要
------------------------------ */
bindSummary: function(ret){

  var
  order = ret.recentOrder,
  agentId = ret.agentId;

  if (order){

    helper.bindFullImgUrl(order.skuMaps);

    // 统计SKU件数
    var skuQuantity = 0;
    helper.each(order.skuMaps, function(idx, map){ skuQuantity += map.quantity });
    order.skuQuantity = skuQuantity;

  }

  // 绑定数据
  helper.setData(this, { recentOrder: order, agentId: agentId });

  // 绑定用户信息
  this.bindUser();

},
/* ------------------------------
 跳转到"补充个人资料"
------------------------------ */
redirectUserModify: function(){
  helper.navigateTo('userModify', 'myCenter');
},
/* ------------------------------
 跳转到"会员代理详情"
------------------------------ */
redirectAgentDetail: function(){
  helper.navigateFormat('userAgentDetail', { agentId: this.data.agentId });
},
/* ------------------------------
 跳转到"我的二维码"
------------------------------ */
//redirectMyCode: function(){
//  helper.navigateTo('myCode', 'myCenter');
//},

/* ------------------------------
 跳转到"采购需求"
 ------------------------------ */
handlePurchaseDemand: function(){
    helper.navigateTo("purchaseDemand","myCenter")
},
/* ------------------------------
 跳转到"采购订单"
------------------------------ */
handleOrderClick: function(){
    helper.navigateTo('orderAll', 'myCenter');
},
/* ------------------------------
 跳转到"我的发票"
 ------------------------------ */
handleInvoiceClick: function(){
  helper.navigateTo('invoiceCenter', 'myCenter');
},
/* ------------------------------
 跳转到"求购中心"
 ------------------------------ */
handleDemandClick: function(){
  helper.navigateTo('demandCenter', 'myCenter');
},
/* ------------------------------
 跳转到"供应中心"
 ------------------------------ */
handleSupplyClick: function(){
  helper.navigateTo('supplyCenter', 'myCenter');
},
/* ------------------------------
 跳转到"退换货"
 ------------------------------ */
handleRMAClick: function(){
  helper.navigateTo('rmaAll', 'myCenter');
},
/* ------------------------------
 跳转到"供应需求"
------------------------------ */
handleSupplyDemand: function(){
  helper.navigateTo('supplyDemand', 'myCenter');
},

/* ------------------------------
 跳转到"提现"
 ------------------------------ */
handleWithdraw: function(){
    helper.navigateTo('bankcardAll', 'myCenter');
},
/* ------------------------------
 跳转到"收货地址"
------------------------------ */
handleAddressClick: function(){
  helper.navigateTo('addressAll', 'myCenter');
},
/* ------------------------------
 跳转到"地址"
------------------------------ */
handleBankcardClick: function(){
  helper.navigateTo('addressAll', 'myCenter');
},
/* ------------------------------
 跳转到"消息"
------------------------------ */
handleMessage: function(){
  helper.navigateTo('message', 'myCenter');
},
/*
* 跳转到快商通客服
* */
handleKSTClick: function (){
    //helper.navigateTo('concatService','myCenter');
    helper.navigateTo({
        url:"/pages/concatService/concatService"
    })
},
/* ------------------------------
 跳转到"关于合采"
 ------------------------------ */
handleAboutClick: function(){
  helper.navigateTo({
    url:"/pages/my/myAbout/myAbout"
  })
}

});