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
  helper.request({ url: 'wx/cart/groups', success: this.bindCart });
},
/* ------------------------------
 绑定显示购物车列表
------------------------------ */
bindCart(ret){

  // 格式化金额显示
  ret.payableAmountString = helper.fen2str(ret.payableAmount);
  helper.each(ret.groups, (idx, grp) => helper.bindfen2str(grp.items, 'price', 'amount', 'calculatedAmount'));

  // 绑定数据
  this.setData(ret);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 选中/取消选中项目
------------------------------ */
checkItem(skuId, toCheck){

  // returnAll: true, 总是返回购物车全部项目列表
  helper.request({
    url: toCheck ? 'wx/cart/checkSingle' : 'wx/cart/uncheckSingle',
    data: { skuId },
    success: this.bindCart
  })

},
/* ------------------------------
 选中/取消选中全部项目
------------------------------ */
checkItemAll(toCheck){

  helper.request({
    url: toCheck ? 'wx/cart/checkAll' : 'wx/cart/uncheckAll',
    success: this.bindCart
  })

},
/* ------------------------------
 SKU数量变更
------------------------------ */
changeQuantity(ret) {

  var d = ret.detail;

  console.log('myCart.changeQuantity =>');
  console.log(d);

  helper.request({
    url: 'wx/cart/setQty',
    data: d,
    success: this.bindCart
  });

},
/* ------------------------------
 采购项Click
------------------------------ */
clickItem(e){

  var
    ds = e.currentTarget.dataset,
    batchId = ds.batchId,
    spuId = ds.spuId,
    skuId = ds.skuId,
    action = e.target.dataset.action;

  // 选中
  if ('check' === action){
    this.checkItem(skuId, true);
    return;
  }

  // 取消选中
  if ('uncheck' === action){
    this.checkItem(skuId, false);
    return;
  }

  // 删除
  if ('del' === action){
    this.deleteItem(skuId);
    return;
  }

  // 关注商品加入购物车（查询相关SKU映射列表）
  if ('addCart' === action){
    this.querySKUs(batchId, spuId);
    return;
  }

  // 其他情况，隐藏"删除"操作
  this.setData({ opItemSkuId: null });

},
/* ------------------------------
 查询SKU列表
------------------------------ */
querySKUs(batchId, spuId){

  helper.request({
    url: helper.formatUrl('/wx/act/sku/list', { batchId, spuId }),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs(skuMaps){

  helper.each(skuMaps, (idx, map) => {
    map.fullImageUrl = helper.concatFullImgUrl(map.imageUrl);
    map.priceBString = helper.fen2str(map.priceB);
    map.marketPriceString = helper.fen2str(map.marketPrice);
    map.quantity = 1;
  });

  // 绑定数据
  helper.setData(this, { skuMaps, skuMap: skuMaps[0] });

  // 加购物车
  this.showQuantitySheet();

},
/* ------------------------------
 采购项滑动开始
------------------------------ */
itemTouchStart(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  skuId = e.currentTarget.dataset.skuId,
  xy = e.touches[0];

  this.setData({
    touchStartItemSkuId: skuId,
    touchStartItemX: xy.clientX,
    touchStartItemY: xy.clientY,
    touchMoveItemSkuId: null,
    touchMoveItemX: null,
    touchMoveItemY: null
  });

  console.log(['touch start => ', skuId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 采购项滑动
------------------------------ */
itemTouchMove(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  skuId = e.currentTarget.dataset.skuId,
  xy = e.touches[0];

  this.setData({
    touchMoveItemSkuId: skuId,
    touchMoveItemX: xy.clientX,
    touchMoveItemY: xy.clientY
  });

  console.log(['touch move => ', skuId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 采购项滑动结束
------------------------------ */
itemTouchEnd(e){

  var
  itemSkuId = e.currentTarget.dataset.skuId,
  startItemSkuId = this.data.touchStartItemSkuId,
  moveItemSkuId = this.data.touchMoveItemSkuId,
  distanceX,
  distanceY;

  console.log(['touch end => startItemSkuId: ', startItemSkuId, ', moveItemSkuId: ', moveItemSkuId].join(''));

  if (!startItemSkuId || startItemSkuId != moveItemSkuId)
    return;

  distanceX = this.data.touchStartItemX - this.data.touchMoveItemX;
  distanceY = this.data.touchStartItemY - this.data.touchMoveItemY;

  // X轴从右到左距离超过一定标准的，显示"删除"操作
  this.setData({ opItemSkuId: distanceX >= 60 ? itemSkuId : null });
  console.log(['touch end => ', startItemSkuId, ', distanceX: ', distanceX, ', distanceY: ', distanceY].join(''));

},
/* ------------------------------
 删除指定的采购项
------------------------------ */
deleteItem(skuId){

  helper.request({
    url: 'wx/cart/delete',
    data: { skuId },
    success: this.bindCart
  });

},
/* ------------------------------
 底部统计区域Click
------------------------------ */
opsClick(e){

  var action = e.target.dataset.action;

  // 全选
  if ('checkAll' == action){
    this.checkItemAll(true);
    return;
  }

  // 取消全选
  if ('uncheckAll' == action){
    this.checkItemAll(false);
    return;
  }

  // 下单
  if ('done' == action){
    this.confirmCart();
    return;
  }

},
/* ------------------------------
 活动标题Click
 ------------------------------ */
clickActivity(e){

  var
    action = e.currentTarget.dataset.action,
    activityId = e.currentTarget.dataset.activityId,
    url = null;

  if (action == 'checkActivity') {
    url = 'wx/cart/checkActivity';
  }
  else if (action == 'uncheckActivity') {
    url = 'wx/cart/uncheckActivity';
  }

  if (!url)
    return;

  // 按活动全选/取消全选
  helper.request({
    url: url,
    data: { activityId },
    success: this.bindCart
  })

},
/* ------------------------------
 底部统计区域Click
------------------------------ */
confirmCart(){

  helper.request({
    url: 'wx/order/confirmCart',
    // 跳转到订单下单页
    success: order => helper.navigateFormat('orderConfirm', { orderId: order.orderId })
  });

},
/* ------------------------------
 显示数量选择器
------------------------------ */
showQuantitySheet(){

  if (!this.quantitySheet)
    this.quantitySheet = this.selectComponent('#quantitySheet');

  this.quantitySheet.showSheet();

},
/* ------------------------------
 显示数量选择器
------------------------------ */
closeQuantitySheet(){

  if (!this.quantitySheet)
    this.quantitySheet = this.selectComponent('#quantitySheet');

  this.quantitySheet.closeSheet();

}


})
