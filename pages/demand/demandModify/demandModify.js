/**
 * 发布求购页
 * demandModify.less
 * -----------------------------------
 * 18/11/9
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hidden: 'hidden',
  isModify: false,
  demandId: '',
  demand: {},
  tempImgs: [],
  show:false,//控制下拉列表的显示隐藏
  deliveryTypes: [
    { typeId: 'Delivery', typeName: '供应商发货' },
  ],// 交货方式
  payTypes:[
    { typeId: 'PayFirst', typeName: '先款后货' },
    { typeId: 'PayLast', typeName: '先货后款' },
    { typeId: 'Deposit', typeName: '先定金，货到后付尾款' }
  ],// 支付方式
  index: 0,//选择的下拉列表下标
  index1: 0,
  index2: 0,
  index3: 0
},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  // 判断是否发布/编辑
  if (opts.demandId) {

    this.setData({ "demandId": opts.demandId, isModify:true });

    // 更新导航标题
    helper.navTitle('编辑求购');

  } else {

    // 更新导航标题
    helper.navTitle('发布求购');
  }

  //查询求购
  this.queryDemand();

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
 编辑查询数据
 ------------------------------ */
queryDemand:function(){

  if (this.data.isModify){

    helper.request({
      url: 'wx/demand/get',
      data: { demandId: this.data.demandId },
      success: this.bindDemand
    });

  }else{

    // 分类查询
    this.querySkuType1Selector();
  }
},
/* ------------------------------
 绑定显示求购详情
 ------------------------------ */
bindDemand: function(ret){

   var tempFilePaths = [],
        imageIds = [];

  // 图片渲染
   helper.each(ret.demandImageList, function (idx, image) {

     imageIds.push(image.imageId);
     tempFilePaths.push(helper.concatFullImgUrl(image.imageUrl));

   });

   ret.imageIds = imageIds.join(",");
   ret.expireTime = helper.d2str(ret.expireTime);

    // 绑定数据
   this.setData({
                    "demand": ret,
                    "date": helper.d2str(ret.expireTime),
                    "address": [ret.deliveryAddressEntity],
                    "tempFilePaths": tempFilePaths });

  // 分类查询
   this.querySkuType1Selector();
},

/* ------------------------------
 查询一级分类
 ------------------------------ */
querySkuType1Selector: function() {

  helper.request({ url: 'wx/cat/childTypes', success: this.bindType1DDL});
},
/* ------------------------------
 绑定显示一级分类下拉列表
 ------------------------------ */
bindType1DDL: function(types) {

  // 绑定一级分类数据
  this.setData({ skuTypes1: types });

  // 编辑绑定 demand
  var that = this,
      ty='';

  if (that.data.demand.skuType1) {

    helper.each(types, function (i, item) {

      if (that.data.demand.skuType1 == item.typeId) {
        ty = { detail: { value: i } };
        return;
      }

    });

  }
    
  this.inputProperty(ty, 'skuType1', 'skuTypes1');

  // 默认渲染二级分类（skuTypes1[0].typeId）
  this.querySkuType2Selector(this.data.demand.skuType1 || types[0].typeId);

},
/* ------------------------------
 查询二级分类 默认（skuTypes1[0].typeId）渲染二级分类
 ------------------------------ */
querySkuType2Selector: function(typeId1) {

  helper.request({
    url: 'wx/cat/childTypes',
    data: {
      parentType: typeId1
    },
    success: this.bindType2DDL

  });
},
/* ------------------------------
 绑定显示二级分类下拉列表
 ------------------------------ */
bindType2DDL: function(types) {

  // 绑定二级分类数据
  this.setData({ skuTypes2: types });

  // 编辑绑定 demand
  var that = this,
      ty='';

  if (that.data.demand.skuType2) {

    helper.each(types, function (i, item) {

      if (that.data.demand.skuType2 == item.typeId) {
        ty = { detail: { value: i } };
        return;
      }

    });

  }

  this.inputProperty(ty, 'skuType2', 'skuTypes2');

  // 默认渲染三级分类（skuTypes1[0].typeId）
  this.querySkuType3Selector(this.data.demand.skuType2 || types[0].typeId);

},
/* ------------------------------
 查询三级分类 默认（skuTypes2[0].typeId）渲染二级分类
 ------------------------------ */
querySkuType3Selector: function(typeId2) {

  helper.request({
    url: 'wx/cat/childTypes',
    data: {
      parentType: typeId2
    },
    success: this.bindType3DDL
  });
},
/* ------------------------------
 绑定显示二级分类下拉列表
 ------------------------------ */
bindType3DDL: function(types) {

  // 绑定三级分类数据
  this.setData({ skuTypes3: types });

  // 编辑绑定 demand
  var that = this,
      ty='';

  if (that.data.demand.skuType3) {

    helper.each(types, function (i, item) {

      if (that.data.demand.skuType3 == item.typeId) {
        ty = { detail: { value: i } };
        return;
      }

    });

  }

  this.inputProperty(ty, 'skuType3', 'skuTypes3');

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
            demand = that.data.demand;

        demand[ 'deliveryAddress' ] = item.addressId;

        // 绑定数据
        that.setData({ demand: demand });

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
            demand = that.data.demand;

        demand[ 'deliveryAddress' ] = item.addressId;

        // 绑定数据
        that.setData({ demand: demand });

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
 报价截至日期
 ------------------------------ */
bindDateChange: function(e) {

  this.setData({date: e.detail.value});
  this.inputProperty(e, 'expireTime');
},
/* ------------------------------
 录入交货方式
 ------------------------------ */
inputDeliveryType: function(e){
  this.setData({ index: e.detail.value });
  this.inputProperty(e, 'deliveryType', 'deliveryTypes');
},
/* ------------------------------
 录入一级分类和刷新二级三级分类
 ------------------------------ */
bindChangeType1: function(e){

  var
      skuTypes1 = this.data.skuTypes1,
      index1 = e.detail.value,
      typeId = skuTypes1[index1].typeId;

  this.setData({
    index1: index1
  });

  this.querySkuType2Selector(typeId);

  this.inputProperty(e, 'skuType1', 'skuTypes1');
},
/* ------------------------------
 录入二级分类
 ------------------------------ */
bindChangeType2: function(e){
  var
      skuTypes2 = this.data.skuTypes2,
      index2 = e.detail.value,
      typeId = skuTypes2[index2].typeId;

  this.setData({
    index2: index2
  });

  this.querySkuType3Selector(typeId);

  this.inputProperty(e, 'skuType2', 'skuTypes2');
},
/* ------------------------------
 录入三级分类
 ------------------------------ */
bindChangeType3: function(e){
  this.inputProperty(e, 'skuType3', 'skuTypes3');
},
/* ------------------------------
 运费/交货期/单价是否可议
 ------------------------------ */
checkboxChange: function(e) {

  var that = this,
      demand = this.data.demand,
      parameter = e.target.dataset.name,
      val = e.detail.value[0];

  // 单价包含运费 隐藏运费区间
  if(parameter == 'isPriceIncludeDeliveryFee') {

    if(val == 1) {
      that.setData({ deliveryFee: true });
    } else {
      that.setData({ deliveryFee: false});
    }

  }

  if(val == undefined) {
    // 没选中删除
    delete demand[ parameter ];
  } else {
    // 选中添加
    demand[ parameter ] = val;
  }

  console.log(demand);

  this.setData({ demand: demand });
},
/* ------------------------------
 选择图片
 ------------------------------ */
chooseImages: function(){

  var
      that = this,
      tempImgs = this.data.tempImgs;

  wx.chooseImage({
    // 最多传5张图片
    count: 5,
    // 压缩图
    sizeType: [ 'compressed' ],
    success: function(ret) {

      tempImgs = tempImgs.concat(ret.tempFilePaths);

      that.setData({
        tempImgs: tempImgs
      });

      that.uploadImages(tempImgs);
    }
  });

},
/* ------------------------------
 上传图片
 ------------------------------ */
uploadImages: function(tempImgs){

  if (!tempImgs || tempImgs.length == 0)
    return;

  var
      that = this,
      myImgs = [];

  helper.each(tempImgs, function(idx, item){

    helper.uploadFile({

      url:  'wx/upload',
      filePath: item,
      name: 'image',
      success: function(ret){

        // ret 去除开头和结尾的 "
        ret = ret.replace(/^"/ig, '').replace(/"$/ig, '');

        var
            fields = ret.split('|'),
            imgId = fields[0];

        myImgs.push(imgId);

        // 最后一张 绑定 this.data.demand
        if(tempImgs.length - 1 == idx) {

          var demand = that.data.demand;

          myImgs = myImgs.join(',');

          // 文本框值
          demand[ 'imageIds' ] = myImgs;


          // 绑定数据
          that.setData({ demand: demand });

        }

      }

    });

  });

  this.setData({ tempImgs: tempImgs });

},
/* ------------------------------
 预览上传图片
 ------------------------------ */
previewImgClick: function (e) {

  var current = e.target.dataset.id,
      urls = this.data.tempImgs;

  wx.previewImage({
    current: current,
    urls: urls
  })

},
/* ------------------------------
 录入商品名称
 ------------------------------ */
inputSkuName:function(e){
  this.inputProperty(e, 'skuName');
},
/* ------------------------------
 录入商品规格
 ------------------------------ */
inputSkuSpec:function(e){
  this.inputProperty(e, 'skuSpec');
},
/* ------------------------------
 录入商品单位
 ------------------------------ */
inputSkuUnit:function(e){
  this.inputProperty(e, 'skuUnit');
},
/* ------------------------------
 录入商品数量
 ------------------------------ */
inputSkuQuantity:function(e){
  this.inputProperty(e, 'skuQuantity');
},
/* ------------------------------
 录入单价区间 min
 ------------------------------ */
inputMinPrice:function(e){
  this.inputProperty(e, 'minPrice');
},
/* ------------------------------
 录入单价区间 max
 ------------------------------ */
inputMaxPrice:function(e){
  this.inputProperty(e, 'maxPrice');
},
/* ------------------------------
 录入单价是否可议
 ------------------------------ */
inputSkuUnits:function(e){
  this.inputProperty(e, 'skuUnit');
},
/* ------------------------------
 录入运费区间 min
 ------------------------------ */
inputMinDeliveryFee:function(e){
  this.inputProperty(e, 'minDeliveryFee');
},
/* ------------------------------
 录入运费区间 max
 ------------------------------ */
inputMaxDeliveryFee:function(e){
  this.inputProperty(e, 'maxDeliveryFee');
},
/* ------------------------------
 录入交货期区间 min
 ------------------------------ */
inputMinDeliveryDays:function(e){
  this.inputProperty(e, 'minDeliveryDays');
},
/* ------------------------------
 录入交货期区间 max
 ------------------------------ */
inputMaxDeliveryDays:function(e){
  this.inputProperty(e, 'maxDeliveryDays');
},
/* ------------------------------
 录入联系人
 ------------------------------ */
  inputContactName:function(e){
  this.inputProperty(e, 'contactName');
},
/* ------------------------------
 录入商品单位
 ------------------------------ */
  inputContactMobile:function(e){
  this.inputProperty(e, 'contactMobile');
},
/* ------------------------------
 录入支付方式
 ------------------------------ */
inputPayType: function(e){
  this.inputProperty(e, 'payType', 'payTypes');
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
inputDesc:function(e){
  this.inputProperty(e, 'desc');
},
/* ------------------------------
 录入求购单属性
 ------------------------------ */
inputProperty: function(e, prop, enumName){
  // 更新属性为录入值
  var
      demand = this.data.demand,
      val;

  if (e) {
    val = e.detail.value;
  } else {
    val = 0;
  }

  // 文本框值
  demand[ prop ] = val;

  // 枚举名称
  if (enumName) {

    // 枚举值
    val = this.data[ enumName ][ val ];
    demand[ prop ] = val.typeId;
    demand[ prop + 'Title' ] = val.typeName;

  }

  console.log(demand);

  // 绑定数据
  this.setData({ demand: demand });

},
/* ------------------------------
 发布求购 保存数据
 ------------------------------ */
modify: function () {

  var demand = this.data.demand;

  demand.deliveryAddressEntity = null;
  demand.demandImageList = null;

  helper.request({
    url: 'wx/demand/modify',
    data: demand,
    success: this.afterSave
  });

},
/* ------------------------------
 发布求购 保存数据
 ------------------------------ */
saveDemand: function(){

  var demand = this.data.demand;

  helper.request({
    url: 'wx/demand/add',
    data: demand,
    success: this.afterSave
  });

},
/* ------------------------------
 发布求购之后，跳转到指定页面
 ------------------------------ */
afterSave: function(ret){

  if(!ret)
      return;

  // 跳转列表页
  helper.navigateTo('myDemandAll');
  return;

}


})
