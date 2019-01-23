/**
 * 开票申请
 * invoiceApplication.js
 * -----------------------------------
 * 18/11/27
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
  templateIds: [],
  contentTypes: [
    { val: 'Detail', text: '明细' }
  ]
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle('申请开票');

  // 如果传入了invoiceId，查询详情
  this.queryInvoice(opts.orderId);

  // 查询收货地址
  this.queryAddress();

},
/* ------------------------------
 每次页面显示时，刷新数据
 ------------------------------ */
onShow: function (){

  // 确认是否有来自地址列表页传入的addressId，
  var
      that = this,
      addressId = helper.pageArg('demandModifyAddress');

  if (addressId)
  // 收货地址
    this.bindAddress('', addressId);

},
/* ------------------------------
 查询发票数据
------------------------------ */
queryInvoice: function(orderId){

  helper.request({
    url: 'wx/invoice/beforeAdd',
    data: { orderId: orderId },
    success: this.bindInvoice,
    error: function (ret) {

      //  如果发票还未认证，请认证发票资质，跳转到发票资质认证页
      if(ret.errorCode == 5) {

        wx.showModal({
          title: '提示',
          content: ret.errorMsg,
          showCancel: false,
          success (res) {
            if (res.confirm) {
              helper.navigateFormat('invoiceModify', { type: 'VATNormal' });
            }
          }
        });

      }
    }
  });

},
/* ------------------------------
 绑定显示发票详情
------------------------------ */
bindInvoice: function(ret){

  console.log(ret);

  var
      invoice = this.data.invoice,
      templateIds = this.data.templateIds,
      ty='';

  // 发票审核通过加入开票类型选择，templateIds
  helper.each(ret.allTemplates, function (idx, item) {

    if(item.approveStatus == "Approved") {

      var arr  = {
        "val" : item.templateId,
        "text" : item.typeTitle
      }

      templateIds.push(arr);

    }

  });

  this.setData({templateIds: templateIds});

  // 录入orderId
  invoice['orderId'] = ret.order.orderId;

  // 录入开票内容
  ty = { detail: { value: 0 } };
  this.inputProperty(ty, 'contentType', 'contentTypes');

  // 绑定数据
  helper.setData(this, { order: ret.order }, true);
  helper.setData(this, { invoice: invoice }, true);

},
/* ------------------------------
 查询收货地址
 ------------------------------ */
queryAddress: function() {

  helper.request({ url: 'wx/address/list', success: this.bindAddress });
},
/* ------------------------------
 绑定显示收货地址
 ------------------------------ */
bindAddress: function(ret, addressId) {
  var
      that = this,
      isDefaultAddress = [];

  if(ret) {

    // 绑定地址列表
    that.setData({ allAddress: ret });

    helper.each(ret, function (idx, item) {

      // 默认在地址列表 中查询渲染默认地址
      if(item.isDefault) {

        // 绑定默认地址数据 isDefaultAddress
        isDefaultAddress.push(item);
        that.setData({ address: isDefaultAddress });

        // 录入地址 id
        var
            invoice = that.data.invoice;

        invoice[ 'deliveryAddressId' ] = item.addressId;

        // 绑定数据
        that.setData({ invoice: invoice });

        return;

      }

    });

    // 如果没有默认收货地址，跳转到地址新增页
    if (!isDefaultAddress)
      that.selectAddress();

  } else {

    var allAddress = that.data.allAddress;

    helper.each(allAddress, function (idx, item) {

      // 在地址列表中重新选择新的收货地址 addressId
      if(item.addressId == addressId) {

        // 绑定地址数据
        isDefaultAddress.push(item);
        that.setData({ address: isDefaultAddress });

        // 录入地址 id
        var
            invoice = that.data.invoice;

        invoice[ 'deliveryAddressId' ] = item.addressId;

        // 绑定数据
        that.setData({ invoice: invoice });

        return;

      }

    });

  }
},
/* ------------------------------
 选择收货地址
 ------------------------------ */
selectAddress: function(){

  // 有备选地址时，跳转到地址列表页；没有时，跳转到地址新增页。
  helper.navigateFormat( this.data.address ? 'addressAll' : 'addressModify', { from: 'demandModifyAddress' } );
},
/* ------------------------------
 录入发票类型
------------------------------ */
inputType: function(e){
  this.inputProperty(e, 'templateId', 'templateIds');
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
  this.inputProperty(e, 'titleName', 'titleNames');
},
/* ------------------------------
 录入纳税人识别号
------------------------------ */
inputTaxNumber: function(e){
  this.inputProperty(e, 'taxNumber');
},
/* ------------------------------
 录入发票内容
------------------------------ */
inputContentType: function(e){
  this.inputProperty(e, 'contentType', 'contentTypes');
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
 保存发票信息
------------------------------ */
saveInvoice: function(){

  var invoice = this.data.invoice;

  helper.request({
    url: 'wx/invoice/add',
    data: invoice,
    success: function (ret) {

      // 保存发票之后，跳转到指定页面
      helper.navigateTo('invoiceCenter');
    }
  });
  
}

})
