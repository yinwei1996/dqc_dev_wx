/**
 * 采购单
 * myCart.js
 * -----------------------------------
 * 18/03/21 Jerry 新增
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
onShow: function (){

  // 更新导航
  helper.navTitle('采购单');

  // 查询采购单列表
  this.queryCart();

},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh: function(){

  // 查询采购单列表
  this.queryCart();
},
/* ------------------------------
 查询采购单列表
------------------------------ */
queryCart: function(){

  helper.request({
    url: 'wx/cart/groups',
    success: this.bindCart
  });

},
/* ------------------------------
 绑定显示采购单列表
------------------------------ */
bindCart: function(sellers){

  var
  totalQty = 0,
  payableQty = 0,
  payableAmount = 0,
  sellerChecked;

  helper.each(sellers, function(idx, seller){

    /* 是否选中卖家名称之前的CheckBox */
    sellerChecked = true;

    // 绑定SKU图片完整URL
    helper.bindFullImgUrl(seller.items);

    // 计算总额、总件数
    helper.each(seller.items, function(idx2, item){

      totalQty += item.quantity;

      if (item.checked){
        payableQty += item.quantity;
        payableAmount += item.calculatedAmount;
      }
      else if (sellerChecked)
        sellerChecked = false;

    });

    // 更新seller.checked标志位
    seller.checked = sellerChecked;

  });

  // 更新数据
  helper.setData(this, { sellers: sellers, totalQty: totalQty, payableQty: payableQty, payableAmount: payableAmount }, false);

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 选中/取消选中项目
------------------------------ */
itemCheck: function(skuId, toCheck){

  // returnAll: true, 总是返回采购单全部项目列表
  helper.request({
    url: toCheck ? 'wx/cart/checkSingle' : 'wx/cart/uncheckSingle',
    data: { skuId: skuId },
    success: this.bindCart
  })

},
/* ------------------------------
 选中/取消选中全部项目
------------------------------ */
itemCheckAll: function(toCheck){

  helper.request({
    url: toCheck ? 'wx/cart/checkAll' : 'wx/cart/uncheckAll',
    success: this.bindCart
  })

},
/* ------------------------------
 SKU数量减一
------------------------------ */
quantityReduce: function(e){
  this.quantityChange(e, false);
},
/* ------------------------------
 SKU数量加一
------------------------------ */
quantityAdd: function(e){
  this.quantityChange(e, true);
},
/* ------------------------------
 SKU数量变更
------------------------------ */
quantityChange: function(e, isAdd){
  var
  that = this,
  ds = e.target.dataset,
  skuId = ds.key,
  qty = parseInt(ds.quantity) + ( isAdd ? 1 : -1 ),
  minQty = parseInt(ds.minQuantity),
  maxQty = parseInt(ds.maxQuantity),
  unit = ds.unit;

  if (!skuId || !qty || qty < 0)
    return;

  if (isAdd && qty >= maxQty) {
    helper.showToast([ '商品限购', maxQty, unit ].join(''), 'none');
  }
  else if (!isAdd && qty <= minQty) {
      helper.showToast([ '商品', minQty, unit, '起订' ].join(''), 'none');
  }

  helper.request({
    url: 'wx/cart/setQty',
    data: { skuId: skuId, qty: qty },
    success: this.bindCart
  });

},
/* ------------------------------
 采购项Click
------------------------------ */
itemClick: function(e){
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
itemTouchStart: function(e){

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
itemTouchMove: function(e){

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
itemTouchEnd: function(e){

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
itemDelete: function(skuId){

  helper.request({
    url: 'wx/cart/delete',
    data: { skuId: skuId },
    success: this.bindCart
  });

},
/* ------------------------------
 底部统计区域Click
------------------------------ */
opsClick: function(e){

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
sellerClick: function(e){

  var
    action = e.currentTarget.dataset.action,
    seller = e.currentTarget.dataset.sellerId,
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
    data: { seller: seller },
    success: this.bindCart
  })

},
/* ------------------------------
 底部统计区域Click
------------------------------ */
confirmCart: function(){

  helper.request({
    url: 'wx/order/confirmCart',
    // 跳转到订单下单页
    success: function (order) { helper.navigateFormat('orderConfirm', { orderId: order.orderId }) }
  });

}

})
