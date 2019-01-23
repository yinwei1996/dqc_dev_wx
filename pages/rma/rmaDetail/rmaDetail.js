/**
 * RMA申请详情
 * rmaDetail.js
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
  rma: {}
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 按orderId查询详情
  this.queryRMA(opts.orderId || '98ee9810f8014e9e87ad4302ef4d7a23');

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

  // 申请时间、实付时间
  rma.createTimeString = helper.dt2str(rma.createTime);
  rma.payTimeString = helper.dt2str(rma.payTime);

  // 绑定数据
  this.setData({ rma: rma });

},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}

})
