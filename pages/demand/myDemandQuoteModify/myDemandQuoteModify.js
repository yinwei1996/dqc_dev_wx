/**
 * 求购报价页
 * myDemandQuoteModify.js
 * -----------------------------------
 * 18/11/15
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hidden: 'hidden',
  demand:{},
  quote:{},
  isModify: false,
  show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
  index:0 //选择的下拉列表下标
},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  // 绑定订单编号
  this.setData({ demandId: opts.demandId });

  // 判断是否报价/编辑
  if (opts.quoteId) {

    this.setData({
      quoteId: opts.quoteId,
      isModify:true
    });

    // 更新导航标题
    helper.navTitle('编辑报价');

  } else {

    // 更新导航标题
    helper.navTitle('求购报价');

  }

  // 查询发货地址
  this.queryAddress();

  // 查询求购信息
  this.queryDemand();

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
    // 发货地址
    this.bindAddress('', addressId);

},
/* ------------------------------
 查询求购数据
 ------------------------------ */
queryDemand: function(){

  var that = this,
      quote = this.data.quote;

  // 报价
  helper.request({
    url: 'wx/demand/details',
    data: { demandId: this.data.demandId },
    success: this.bindDemand
  });

  if (this.data.isModify){
    // 编辑报价
    helper.request({
      url: 'wx/demand/quote/get',
      data: { quoteId: this.data.quoteId },
      success: function (ret) {

        // 绑定报价信息
        that.setData({
          quote: ret,
          address: [ret.warehouseAddressEntity]
        });
      }
    });

  }

},
/* ------------------------------
 绑定求购数据
 ------------------------------ */
bindDemand:function(ret){

  if (ret.demand.expireTime)
    ret.demand.expireTimeStr = helper.d2str(ret.demand.expireTime);

  helper.each(ret.quotes, function (idx, quote) {
    quote.createTimeStr = helper.d2str(quote.createTime);
  });

  ret.demand.skuImgUrlFull = helper.concatFullImgUrl(ret.demand.skuImgUrl);

  // 录入demandId
  var quote = this.data.quote;

  quote[ 'demandId' ] = ret.demand.demandId;

  // 绑定数据
  this.setData({ quote: quote });

  this.setData(ret);
},
/* ------------------------------
 查询发货地址
 ------------------------------ */
queryAddress: function() {

  helper.request({
    url: 'wx/address/list',
    data: {
      type: 'ContractDelivery'
    },
    success: this.bindAddress
  });
},
/* ------------------------------
 绑定显示发货地址
 ------------------------------ */
bindAddress: function(ret, addressId) {
  var
      that = this,
      isDefaultAddress = [];

  if(ret) {

    // 绑定地址列表
    this.setData({ allAddress: ret });

    helper.each(ret, function (idx, item) {

      // 默认在地址列表 中查询渲染默认地址
      if(item.isDefault) {

        // 绑定默认地址数据 isDefaultAddress
        isDefaultAddress.push(item);
        that.setData({ address: isDefaultAddress });

        // 录入地址 id
        var quote = that.data.quote;

        quote[ 'warehouseAddress' ] = item.addressId;

        // 绑定数据
        that.setData({ quote: quote });

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
        var quote = that.data.quote;

        quote[ 'warehouseAddress' ] = item.addressId;

        // 绑定数据
        that.setData({quote: quote});

        return;

      }

    });

  }
},
/* ------------------------------
 选择发货地址
 ------------------------------ */
selectAddress: function(){

  // 有备选地址时，跳转到地址列表页；没有时，跳转到地址新增页。
  helper.navigateFormat( this.data.address ? 'addressAll' : 'addressModify', { from: 'demandModifyAddress',type: 'ContractDelivery' } );
},
/* ------------------------------
 录入供应数量
 ------------------------------ */
inputQuantity:function(e){
  this.inputProperty(e, 'quantity');
},
/* ------------------------------
 录入供应单价
 ------------------------------ */
inputPrice:function(e){
  this.inputProperty(e, 'price');
},
/* ------------------------------
 录入运费
 ------------------------------ */
inputDeliveryFee:function(e){
  this.inputProperty(e, 'deliveryFee');
},
/* ------------------------------
 录入交货期
 ------------------------------ */
inputDeliveryDays:function(e){
  this.inputProperty(e, 'deliveryDays');
},
/* ------------------------------
 录入联系人姓名
 ------------------------------ */
inputContactName:function(e){
  this.inputProperty(e, 'contactName');
},
/* ------------------------------
 录入联系方式
 ------------------------------ */
inputContactMobile:function(e){
  this.inputProperty(e, 'contactMobile');
},
/* ------------------------------
 录入描述信息
 ------------------------------ */
inputMemo:function(e){
  this.inputProperty(e, 'memo');
},
/* ------------------------------
 录入求购单属性
 ------------------------------ */
inputProperty: function(e, prop, enumName){
  // 更新属性为录入值
  var
      quote = this.data.quote,
      val;

  if (e) {
    val = e.detail.value;
  } else {
    val = 0;
  }

  // 文本框值
  quote[ prop ] = val;

  // 绑定数据
  this.setData({ quote: quote });

},
/* ------------------------------
 发布求购 保存数据
 ------------------------------ */
saveDemand: function(){

  var quote = this.data.quote;

  helper.request({
    url: '/wx/demand/quote/add',
    data: quote,
    success: this.afterSave
  });

},
/* ------------------------------
 发布报价 保存数据
 ------------------------------ */
modify: function () {

  var quote = this.data.quote;

  quote.warehouseAddressEntity = null;

  helper.request({
    url: '/wx/demand/quote/modify',
    data: quote,
    success: this.afterSave
  });

},
/* ------------------------------
 发布求购之后，跳转到指定页面
 ------------------------------ */
afterSave: function(ret){

  if(!ret)
      return;

  // 跳转报价列表页
  helper.navigateTo('myDemandQuoteAll');
  return;

}


})
