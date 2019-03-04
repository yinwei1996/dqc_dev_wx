/**
 * 购物车回收清单
 * myCartExpired
 * -----------------------------------
 * 19/03/04 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { },
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow (){

  // 更新导航
  helper.navTitle('回收清单');

  // 查询购物车列表
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
  helper.request({ url: 'wx/cart/expiredGroups', success: this.bindCart });
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

}


})
