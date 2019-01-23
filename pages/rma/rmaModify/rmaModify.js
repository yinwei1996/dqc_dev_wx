/**
 * RMA申请编辑
 * rmaModify.js
 * -----------------------------------
 * 18/04/23 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  // rma 默认留空
  rma: {},
  types: [
    { val: 'Refund', text: '退款' },
    { val: 'Replace', text: '换货' }
  ],
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle('申请退换货');

  // 按orderId查询详情
  this.queryRMA(opts.orderId || 'f256264b8bfa41d096dd3666aab1411f');

},
/* ------------------------------
 查询退换货详情
------------------------------ */
queryRMA: function(orderId){

  helper.request({
    url: 'wx/rma/detailByOrder',
    data: { orderId: orderId },
    success: this.bindRMA
  });

},
/* ------------------------------
 绑定显示退换货详情
------------------------------ */
bindRMA: function(rma){

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(rma.orderSkuMaps);

  // 绑定数据
  this.setData({ rma: rma });

},
/* ------------------------------
 录入类型
------------------------------ */
inputType: function(e){
  this.inputProperty(e, 'type', 'types');
},
/* ------------------------------
 录入原因
------------------------------ */
inputReason: function(e){
  this.inputProperty(e, 'reason');
},
/* ------------------------------
 录入退换货属性（私有）
------------------------------ */
inputProperty: function(e, prop, enumName){

  // 更新属性为录入值
  var
  val = e.detail.value,
  rma = this.data.rma;

  // 文本框值
  rma[ prop ] = val;

  // 枚举名称
  if (enumName) {

    // 枚举值
    val = this.data[ enumName ][ val ];
    rma[ prop ] = val.val;
    rma[ prop + 'Title' ] = val.text;

  }

  // 绑定数据
  this.setData({ rma: rma });

},
/* ------------------------------
 保存退换货申请
------------------------------ */
saveRMA: function(){

  var rma = this.data.rma;

  helper.request({
    url: rma.rmaId ? 'wx/rma/modify' : 'wx/rma/add',
    data: { rmaId: rma.rmaId, orderId: rma.orderId, type: rma.type, reason: rma.reason },
    success: this.afterSave
  });

},
/* ------------------------------
 保存退换货申请之后，跳转到指定页面
------------------------------ */
afterSave: function(rma){

  // 跳转到退换货申请详情
  helper.redirectFormat('rmaDetail', { orderId: rma.orderId });
}

})
