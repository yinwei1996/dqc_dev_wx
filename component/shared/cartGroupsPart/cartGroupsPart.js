/*
 * 组件 - 购物车项分组列表
 * cartGroupsPart
 * -----------------------------------
 * 19/03/04 Jerry 新增
*/

var
helper = require('../../../utils/helper.js');

Component({
options: {
  addGlobalClass: true
},
/* ------------------------------
 组件的属性列表
------------------------------ */
properties: {
  groups: { type: Object, observer(newVal) { this.initGroups( newVal ) } },
  wish: { type: Boolean, observer(newVal) { this.initWish( newVal ) } },
  expired: { type: Boolean, observer(newVal) { this.initExpired( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: { }, /* data */
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化分组
  ------------------------------ */
  initGroups(groups) {
    this.setData({ groups });
  },
  /* ------------------------------
   初始化是否关注商品
  ------------------------------ */
  initWish(wish) {
    this.setData({ wish });
  },
  /* ------------------------------
   初始化是否已回收项
  ------------------------------ */
  initExpired(expired) {
    this.setData({ expired });
  },
  /* ------------------------------
   购物车项滑动开始
  ------------------------------ */
  itemTouchStart(e){

    if (!e.touches || e.touches.length === 0)
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
   购物车项滑动
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
   购物车项滑动结束
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
   点击活动项
   ------------------------------ */
  clickActivity(e){

    var
      ds = e.currentTarget.dataset,
      action = ds.action,
      activityId = ds.activityId,
      url;

    if (action === 'check') {
      url = 'wx/cart/checkActivity';
    }
    else if (action === 'uncheck') {
      url = 'wx/cart/uncheckActivity';
    }

    if (!url)
      return;

    // 按活动全选/取消全选
    helper.request({
      url: url,
      data: { activityId },
      success: ret => this.bindCart(ret)
    });

  },
  /* ------------------------------
   点击购物车项
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
   选中/取消选中购物车项
  ------------------------------ */
  checkItem(skuId, check){

    // returnAll: true, 总是返回购物车全部项目列表
    helper.request({
      url: check ? 'wx/cart/checkSingle' : 'wx/cart/uncheckSingle',
      data: { skuId },
      success: ret => this.bindCart(ret)
    })

  },
  /* ------------------------------
   选中/取消选中全部购物车项
  ------------------------------ */
  checkItemAll(check){

    helper.request({
      url: check ? 'wx/cart/checkAll' : 'wx/cart/uncheckAll',
      success: ret => this.bindCart(ret)
    })

  },
  /* ------------------------------
   删除指定的购物车项
  ------------------------------ */
  deleteItem(skuId){

    helper.request({
      url: 'wx/cart/delete',
      data: { skuId },
      success: ret => this.bindCart(ret)
    });

  },
  /* ------------------------------
   显示数量选择Sheet
  ------------------------------ */
  showQuantitySheet(){

    if (!this.quantitySheet)
      this.quantitySheet = this.selectComponent('#quantitySheet');

    // 显示Sheet
    this.quantitySheet.showSheet();

  },
  /* ------------------------------
   关闭数量选择Sheet
  ------------------------------ */
  closeQuantitySheet(){

    if (!this.quantitySheet)
      this.quantitySheet = this.selectComponent('#quantitySheet');

    // 关闭Sheet
    this.quantitySheet.closeSheet();

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
      success: ret => this.bindCart(ret)
    });

  },
  /* ------------------------------
   绑定显示购物车分组项
  ------------------------------ */
  bindCart(ret) {
    this.triggerEvent('bindCart', ret);
  },
  /* ------------------------------
   查询SKU列表
  ------------------------------ */
  querySKUs(batchId, spuId){

    helper.request({
      url: helper.formatUrl('/wx/act/sku/list', { batchId, spuId }),
      success: skuMaps => this.bindSKUs(skuMaps)
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
    this.setData({ skuMaps, skuMap: skuMaps[0] });

    // 加购物车
    this.showQuantitySheet();

  }

}

});
