/**
 * 收货地址新增/编辑
 * addressModify.js
 * -----------------------------------
 * 18/03/27 Jerry 新增
 */

var
    helper = require('../../../utils/helper.js');

Page({

  /* ------------------------------
   初始数据
   ------------------------------ */
  data: {
    // address 默认留空
    address: {},
    hiddenRegionSheet: 'hidden',
    //  默认收货
    typeText: '收货'
  },
  /* ------------------------------
   页面加载
   ------------------------------ */
  onLoad: function(opts){

    // 更新导航
    helper.navTitle( opts.addressId ? '编辑地址' : '新增地址' );

    // 是否来自订单确认
    this.setData({ orderConfirm: 'orderConfirmAddress' == opts.from });

    // 是否来发布求购
    this.setData({ demandModify: 'demandModifyAddress' == opts.from });

    // 如果传入了addressId，查询详情
    this.queryAddress(opts.addressId);

    // 如果传入了type，录入发货地址 type
    if(opts.type == 'ContractDelivery') {

      var addr = this.data.address;

      addr[ 'type' ] = opts.type;

      // 绑定数据
      this.setData({ address: addr, typeText: '发货' });

    }

  },
  /* ------------------------------
   查询地址详情
   ------------------------------ */
  queryAddress: function(addressId){

    if (!addressId)
      return;

    helper.request({
      url: 'wx/address/detail',
      data: { addressId: addressId },
      success: this.bindAddress
    });

  },
  /* ------------------------------
   绑定显示地址详情
   ------------------------------ */
  bindAddress: function(ret){

    // 绑定数据
    this.setData({
      address: ret,
      input: {
        province: { id: ret.province, name: ret.provinceName },
        city: { id: ret.city, name: ret.cityName },
        district: { id: ret.area, name: ret.areaName }
      }
    });

  },
  /* ------------------------------
   查询省份列表
   ------------------------------ */
  queryProvinces: function(){

    helper.request({
      url: 'wx/area/provinces',
      success: this.bindProvinces
    });

  },
  /* ------------------------------
   绑定显示省份列表
   ------------------------------ */
  bindProvinces: function(ret){

    var
        input = this.data.input || {},
        inputProvinceId = input.province ? input.province.id : null;

    this.setData({
      provinces: ret,
      hiddenCandidate: { province: '', city: 'hidden', district: 'hidden' }
    });

    this.queryCities(inputProvinceId);

  },
  /* ------------------------------
   查询城市列表
   ------------------------------ */
  queryCities: function(provinceId){

    if (!provinceId)
      return;

    helper.request({
      url: '/wx/area/cities',
      data: { provinceId: provinceId },
      success: this.bindCities
    });

  },
  /* ------------------------------
   绑定显示城市列表
   ------------------------------ */
  bindCities: function(ret){

    var
        input = this.data.input || {},
        inputCityId = input.city ? input.city.id : null;

    this.setData({
      cities: ret,
      hiddenCandidate: { province: 'hidden', city: '', district: 'hidden' }
    });

    this.queryDistricts(inputCityId);

  },
  /* ------------------------------
   查询区县列表
   ------------------------------ */
  queryDistricts: function(cityId){

    if (!cityId)
      return;

    helper.request({
      url: 'wx/area/districts',
      data: { cityId: cityId },
      success: this.bindDistricts
    });

  },
  /* ------------------------------
   绑定显示区县列表
   ------------------------------ */
  bindDistricts: function(ret){

    var
        input = this.data.input || {},
        inputDistrictId = input.district ? input.district.id : null;

    this.setData({
      districts: ret,
      hiddenCandidate: { province: 'hidden', city: 'hidden', district: '' }
    });

  },
  /* ------------------------------
   处理已选省份Click
   ------------------------------ */
  selectedProvinceClick: function(){

    var input = this.data.input || {};

    input.city = null;
    input.district = null;

    this.setData({
      input: input,
      hiddenCandidate: { province: '', city: 'hidden', district: 'hidden' }
    });

  },
  /* ------------------------------
   处理已选城市Click
   ------------------------------ */
  selectedCityClick: function(){

    this.setData({
      inputDistrict: null,
      hiddenCandidate: { province: 'hidden', city: '', district: 'hidden' }
    });

  },
  /* ------------------------------
   处理已选区县Click
   ------------------------------ */
  selectedDistrictClick: function(){

    this.setData({
      hiddenCandidate: { province: 'hidden', city: 'hidden', district: '' }
    });

  },
  /* ------------------------------
   处理备选省份Click
   ------------------------------ */
  candidateProvinceClick: function(e){

    // 捕获子元素，用 e.target
    var
        ds = e.target.dataset,
        input = {
          province: { id: ds.provinceId, name: ds.provinceName },
          city: null,
          district: null
        };

    // 绑定数据
    this.setData({ input: input });

    // 查询下属城市
    this.queryCities(ds.provinceId);

  },
  /* ------------------------------
   处理备选城市Click
   ------------------------------ */
  candidateCityClick: function(e){

    // 捕获子元素，用 e.target
    var
        ds = e.target.dataset,
        input = this.data.input || {};

    input.city = { id: ds.cityId, name: ds.cityName };
    input.district = null;

    // 绑定数据
    this.setData({ input: input });

    // 查询下属区县
    this.queryDistricts(ds.cityId);

  },
  /* ------------------------------
   处理备选区县Click
   ------------------------------ */
  candidateDistrictClick: function(e){

    // 捕获子元素，用 e.target
    var
        ds = e.target.dataset,
        input = this.data.input || {};

    input.district = { id: ds.districtId, name: ds.districtName };

    // 绑定数据
    this.setData({ input: input });

    // TODO 确定按钮可用

  },
  /* ------------------------------
   显示区域选择器
   ------------------------------ */
  showRegionSheet: function(){

    // 显示选择器
    this.setData({ hiddenRegionSheet: '' });

    // 查询省份
    this.queryProvinces();

  },
  /* ------------------------------
   隐藏区域选择器
   ------------------------------ */
  hideRegionSheet: function(e){

    var
        isOk = e.target.dataset.isOk,
        input = this.data.input || {},
        data = { hiddenRegionSheet: 'hidden' },
        addr;

    if (isOk){

      // 省市区未全部选择的，中止处理
      if (!input.province || !input.city || !input.district)
        return;

      // 点了"确定"，更新地址的省市区
      addr = this.data.address;
      addr.province = input.province.id;
      addr.provinceName = input.province.name;
      addr.city = input.city.id;
      addr.cityName = input.city.name;
      addr.area = input.district.id;
      addr.areaName = input.district.name;

      data.address = addr;

    }

    // 绑定数据
    this.setData(data);

  },
  /* ------------------------------
   录入收货人姓名
   ------------------------------ */
  inputUserName:function(e){
    this.inputProperty(e, 'userName');
  },
  /* ------------------------------
   录入手机号
   ------------------------------ */
  inputMobile:function(e){
    this.inputProperty(e, 'mobile');
  },
  /* ------------------------------
   录入详细地址
   ------------------------------ */
  inputAddress:function(e){
    this.inputProperty(e, 'address');
  },
  /* ------------------------------
   录入地址属性（私有）
   ------------------------------ */
  inputProperty: function(e, prop){

    // 更新属性为录入值
    var addr = this.data.address;
    addr[ prop ] = e.detail.value;

    // 绑定数据
    this.setData({ address: addr });

  },
  /* ------------------------------
   保存地址
   ------------------------------ */
  saveAddress: function(){

    var addr = this.data.address;

    helper.request({
      url: addr.addressId ? 'wx/address/modify' : 'wx/address/add',
      data: addr,
      success: this.afterSave
    });

  },
  /* ------------------------------
   保存地址之后，跳转到指定页面
   ------------------------------ */
  afterSave: function(addr){

    // 如果来自"订单确认"页，返回 addressId 至前一页
    if (this.data.orderConfirm){
      helper.pageArg('orderConfirmAddress', addr.addressId);
      wx.navigateBack(1);
      return;
    }

    // 如果来自"发布求购"页，返回
    if (this.data.demandModify){
      helper.pageArg('demandModifyAddress', addr.addressId);
      wx.navigateBack(1);
      return;
    }

    // 默认返回地址列表
    wx.navigateBack();

  }

})
