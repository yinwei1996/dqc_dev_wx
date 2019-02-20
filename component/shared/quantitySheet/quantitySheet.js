/*
 * 组件 - 数量Sheet
 * quantitySheet
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
  sku: { type: Object, observer(newVal, oldVal) { this.initSku( newVal ) } },
  skus: { type: Object, observer(newVal, oldVal) { this.initSkus( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  hidden: 'hidden'
}, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化SKU
  ------------------------------ */
  initSku(sku) {
    this.setData({ sku: sku });
  },
  /* ------------------------------
   初始化SKU集合
  ------------------------------ */
  initSkus(skus) {
    this.setData({ skus: skus });
  },
  /* ------------------------------
   显示Sheet
  ------------------------------ */
  showSheet() {
    this.setData({ hidden: '' });
  },
  /* ------------------------------
   隐藏Sheet
  ------------------------------ */
  closeSheet() {
    this.setData({ hidden: 'hidden' });
  },
  /* ------------------------------
   立即下单
  ------------------------------ */
  clickBuyNow() {
    var sku = this.data.sku;
    this.triggerEvent('clickBuyNow', { batchId: sku.batchId, skuId: sku.skuId, quantity: sku.quantity || 1 });
  },
  /* ------------------------------
   处理规格Click(有多个规格时)
  ------------------------------ */
  clickSpec(e) {

    var
      sku = this.data.sku,
      curSkuId = e.currentTarget.dataset.skuId;

    if (!curSkuId || curSkuId === sku.skuId)
      return;

    console.log('quantitySheet.clickSpec => curSkuId: ' + curSkuId);

    // 触发事件
    this.triggerEvent('clickSpec', { skuId: curSkuId });

  },
  /* ------------------------------
   SKU数量变更
  ------------------------------ */
  changeQuantity(ret) {
    var d = ret.detail;
    console.log([ 'quantitySheet.changeQuantity => skuId: ', d.skuId, ', quantity: ', d.quantity ].join(''));
    this.triggerEvent('changeQuantity', d);
  }

}

});
