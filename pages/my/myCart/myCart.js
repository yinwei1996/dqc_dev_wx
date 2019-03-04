/**
 * 购物车
 * myCart
 * -----------------------------------
 * 19/02/28 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { },
/* ------------------------------
 页面渲染完成
------------------------------ */
onReady(){
  // 更新导航
  helper.navTitle('购物车');
},
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow(){
  // 查询购物车
  this.queryCart();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh(){
  // 查询购物车列表
  this.queryCart();
},
/* ------------------------------
 查询购物车列表
------------------------------ */
queryCart(){
  helper.request({ url: 'wx/cart/groups', success: ret => this.bindCart(ret) });
},
/* ------------------------------
 绑定显示购物车列表
------------------------------ */
bindCart(ret){

  if (ret.detail)
    ret = ret.detail;

  // 格式化金额显示
  ret.payableAmountString = helper.fen2str(ret.payableAmount);
  helper.each(ret.groups, (idx, grp) => helper.bindfen2str(grp.items, 'price', 'amount', 'calculatedAmount'));

  // 绑定数据
  this.setData(ret);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 跳转到回收清单
------------------------------ */
clickExpired(){
  helper.navigateTo('myCartExpired');
},
/* ------------------------------
 点击底部操作区
------------------------------ */
clickOps(e){

  var action = e.target.dataset.action;

  // 引用分组项组件
  if (!this.groupsPart)
    this.groupsPart = this.selectComponent('#groupsPart');

  // 全选
  if ('checkAll' === action){
    this.groupsPart.checkItemAll(true);
    return;
  }

  // 取消全选
  if ('uncheckAll' === action){
    this.groupsPart.checkItemAll(false);
    return;
  }

  // 结算下单
  if ('done' === action){
    this.confirmCart();
    return;
  }

},
/* ------------------------------
 结算下单
------------------------------ */
confirmCart(){

  helper.request({
    url: 'wx/order/confirmCart',
    // 跳转到订单下单页
    success: order => helper.navigateFormat('orderConfirm', { orderId: order.orderId })
  });

}


})
