/**
 * 发票详情
 * invoiceDetail.js
 * -----------------------------------
 * 18/11/30
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  invoice: {},
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle('发票详情');

  // 如果传入了invoiceId，查询详情
  this.queryInvoice(opts.invoiceId || '472e3906b63b4d64ba9baf76f634fde2');

},
/* ------------------------------
 每次页面显示时，刷新数据
 ------------------------------ */
onShow: function (){

},
/* ------------------------------
 查询发票数据
------------------------------ */
queryInvoice: function(invoiceId){

  helper.request({
    url: 'wx/invoice/detail',
    data: { invoiceId: invoiceId },
    success: this.bindInvoice
  });

},
/* ------------------------------
 绑定显示发票详情
------------------------------ */
bindInvoice: function(ret){

  console.log(ret);

  // 绑定数据;
  helper.setData(this, { invoice: ret }, true);

}

})
