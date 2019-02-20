/*
 * 组件 - 数量Spinner
 * quantitySpinner
 * -----------------------------------
 * 19/01/03 Jerry 新增
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

sku: { type: Object, observer(newVal, oldVa) { this.initSku( newVal ) } }

}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {

}, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化SKU
  ------------------------------ */
  initSku(sku) {

    // 兼容购物车项
    if (!sku.actualMinQuantity)
      sku.actualMinQuantity = sku.wholesaleMinQuantity;

    // 兼容购物车项
    if (!sku.actualMaxQuantity)
      sku.actualMaxQuantity = sku.wholesaleMaxQuantity;

    if (!sku.quantity)
      sku.quantity = sku.actualMinQuantity;

    this.setData({ sku: sku });

  },
  /* ------------------------------
   数量加一
  ------------------------------ */
  addQuantity() {

    var
    sku = this.data.sku,
    oriQuantity = sku.quantity;

    // 数量加一
    if (oriQuantity >= sku.actualMaxQuantity)
      return;

    sku.quantity = oriQuantity + 1;

    if (sku.quantity >= sku.actualMaxQuantity)
      helper.showToast([ '商品限购', sku.actualMaxQuantity, sku.unitWithDefaultVal || sku.unit ].join(''), 'none');

    // 绑定数据
    this.setData({ sku: sku });

    // 触发事件
    this.triggerEvent('changeQuantity', { skuId: sku.skuId, quantity: sku.quantity });

  },
  /* ------------------------------
   数量减一
  ------------------------------ */
  reduceQuantity() {

    var
    sku = this.data.sku,
    oriQuantity = sku.quantity;

    // 数量减一
    if (sku.actualMinQuantity >= oriQuantity)
      return;

    sku.quantity = oriQuantity - 1;

    if (sku.quantity <= sku.actualMinQuantity)
      helper.showToast([ '商品', sku.actualMinQuantity, sku.unitWithDefaultVal || sku.unit, '起订' ].join(''), 'none');

    // 绑定数据
    this.setData({ sku: sku });

    // 触发事件
    this.triggerEvent('changeQuantity', { skuId: sku.skuId, quantity: sku.quantity });

  },
  /* ------------------------------
   数量输入
  ------------------------------ */
  inputQuantity(e) {

    var
    sku = this.data.sku,
    newQuantity = parseInt(e.detail.value) || 0;

    if (newQuantity < sku.actualMinQuantity) {
      newQuantity = sku.actualMinQuantity;
      helper.showToast([ '商品', sku.actualMinQuantity, sku.unitWithDefaultVal || sku.unit, '起订' ].join(''), 'none');
    }

    if (newQuantity > sku.actualMaxQuantity) {
      newQuantity = sku.actualMaxQuantity;
      helper.showToast([ '商品限购', sku.actualMaxQuantity, sku.unitWithDefaultVal || sku.unit ].join(''), 'none');
    }

    sku.quantity = newQuantity;

    // 绑定数据
    this.setData({ sku: sku });

    // 触发事件
    this.triggerEvent('changeQuantity', { skuId: sku.skuId, quantity: sku.quantity });

  }

}

});
