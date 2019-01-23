/**
 * 发票编辑
 * invoiceModify.js
 * -----------------------------------
 * 18/11/27 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  // invoice 默认留空
  invoice: {},
  titleTypes: [
    { val: 'Corp', text: '单位' }
  ]
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 专票-增票 类型绑定
  this.setData({ tpyes: opts.type });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 80);

  // 更新导航
  helper.navTitle(opts.type ==  'VATNormal' ? '增票资质' : '专票资质');

  // 查询发票数据
  this.queryInvoice(opts.type);

},
/* ------------------------------
 查询发票数据
------------------------------ */
queryInvoice: function(type){

  helper.request({
    url: 'wx/invoice/vatInf',
    data: { type: type },
    success: this.bindInvoice
  });

},
/* ------------------------------
 绑定显示发票详情
------------------------------ */
bindInvoice: function(ret){

  console.log(ret);

  // 如果资质未通过 重新设置scroll-view高度
  // if(ret.template.approveStatus == 'Refused') {
  //   helper.setScrollViewHeight(this, 96);
  // }

  // 审核时间
  // helper.bindD2Str(ret.template, 'approveTime');

  this.setData({ readonly: ret.readonly });

  // 绑定数据
  helper.setData(this, { invoice: ret.template }, true);

},
/* ------------------------------
 录入抬头类型
------------------------------ */
inputTitleType: function(e){
  this.inputProperty(e, 'titleType', 'titleTypes');
},
/* ------------------------------
 录入抬头名称
------------------------------ */
inputTitleName: function(e){
  this.inputProperty(e, 'titleName');
},
/* ------------------------------
 录入纳税人识别号
------------------------------ */
inputTaxNumber: function(e){
  this.inputProperty(e, 'taxNumber');
},
/* ------------------------------
 录入注册地址
 ------------------------------ */
inputAddressNumber: function(e){
  this.inputProperty(e, 'registerAddress');
},
/* ------------------------------
 录入注册电话
 ------------------------------ */
inputMobileNumber: function(e){
  this.inputProperty(e, 'registerMobile');
},
/* ------------------------------
 录入开户银行
 ------------------------------ */
inputBankName: function(e){
  this.inputProperty(e, 'bankName');
},
/* ------------------------------
 录入银行账号
 ------------------------------ */
inputBankNumber: function(e){
  this.inputProperty(e, 'bankCode');
},
/* ------------------------------
 录入发票属性（私有）
------------------------------ */
inputProperty: function(e, prop, enumName){

  // 更新属性为录入值
  var
  val = e.detail.value,
  invoice = this.data.invoice;

  // 文本框值
  invoice[ prop ] = val;

  // 枚举名称
  if (enumName) {

    // 枚举值
    val = this.data[ enumName ][ val ];
    invoice[ prop ] = val.val;
    invoice[ prop + 'Title' ] = val.text;

  }

  // 绑定数据
  this.setData({ invoice: invoice });

},
/* ------------------------------
 删除未通过记录
 ------------------------------ */
opDeleteRefusedClick: function(e){

  var
      that = this,
      tpyes = this.data.tpyes;

  helper.request({
    confirm: [ '确认删除未通过记录!' ].join(''),
    url: 'wx/invoice/deleteRefusedVatInf',
    data: { type: tpyes },
    success: function(ret){

      // 刷新列表数据
      that.queryInvoice(tpyes);
    }
  });

},
/* ------------------------------
 保存发票信息
------------------------------ */
saveInvoice: function(){

  var invoice = this.data.invoice;

  helper.request({
    url: 'wx/invoice/saveVatInf',
    data: invoice,
    success: this.afterSave
  });

},
/* ------------------------------
 保存发票之后 刷新列表数据
------------------------------ */
afterSave: function(ret){

  this.queryInvoice(this.data.tpyes);

}

})
