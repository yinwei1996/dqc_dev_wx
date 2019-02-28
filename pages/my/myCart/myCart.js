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
data: { hidden: 'hidden' },
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow (){

  // 更新导航
  helper.navTitle('购物车');

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

  helper.request({
    url: 'wx/cart/groups',
    success: (ret)=> this.bindCart(ret)
  });

},
/* ------------------------------
 绑定显示购物车列表
------------------------------ */
bindCart(activities){

  var
  totalQty = 0,
  payableQty = 0,
  payableAmount = 0,
  activityChecked;

  helper.each(activities, function(idx, activity){

    /* 是否选中卖家名称之前的CheckBox */
    activityChecked = true;

    // 绑定SKU图片完整URL
    helper.bindFullImgUrl(activity.items);

    // 计算总额、总件数
    helper.each(activity.items, function(idx2, item){

      totalQty += item.quantity;

      if (item.checked){
        payableQty += item.quantity;
        payableAmount += item.calculatedAmount;
      }
      else if (activityChecked)
        activityChecked = false;

    });

    // 更新activity.checked标志位
    activity.checked = activityChecked;

  });

  // 更新数据
  helper.setData(this, { activities, totalQty, payableQty, payableAmount }, false);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 选中/取消选中项目
------------------------------ */
itemCheck(skuId, toCheck){

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
itemCheckAll(toCheck){

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
  console.log([ 'myCart.changeQuantity => skuId: ', d.skuId, ', quantity: ', d.quantity ].join(''));

  helper.request({
    url: 'wx/cart/setQty',
    data: { skuId, qty },
    success: this.bindCart
  });

},
/* ------------------------------
 采购项Click
------------------------------ */
itemClick(e){

  var
    skuId = e.currentTarget.dataset.skuId,
    action = e.target.dataset.action;

  // SKU详情
  if ('sku' == action){
    helper.navigateFormat('skuDetail', { skuId: skuId });
    return;
  }

  // 选中
  if ('check' == action){
    this.itemCheck(skuId, true);
    return;
  }

  // 取消选中
  if ('uncheck' == action){
    this.itemCheck(skuId, false);
    return;
  }

  // 删除操作
  if ('del' == action){
    this.itemDelete(skuId);
    return;
  }

  // 其他情况，隐藏"删除"操作
  this.setData({ opItemSkuId: null });

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
itemDelete(skuId){

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
    this.itemCheckAll(true);
    return;
  }

  // 取消全选
  if ('uncheckAll' == action){
    this.itemCheckAll(false);
    return;
  }

  // 下单
  if ('done' == action){
    this.confirmCart();
    return;
  }

},
/* ------------------------------
 卖家标题Click
 ------------------------------ */
clickActivity(e){

  var
    action = e.currentTarget.dataset.action,
    activity = e.currentTarget.dataset.activityId,
    url = null;

  if (action == 'checkSeller') {
    url = 'wx/cart/checkSeller';
  }
  else if (action == 'uncheckSeller') {
    url = 'wx/cart/uncheckSeller';
  }

  if (!url)
    return;

  // 按卖家全选/取消全选
  helper.request({
    url: url,
    data: { activity },
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

}

})
