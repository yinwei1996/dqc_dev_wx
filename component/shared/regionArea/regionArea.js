/*
 * 组件 - 区域选择
 * regionArea
 * -----------------------------------
 * 19/02/21 Jerry 新增
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
  region: { type: Object, observer(newVal) { this.initRegion( newVal ) } }
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
   初始化区域
  ------------------------------ */
  initRegion(region) {

    // 复制一个区域对象，不要直接引用
    var local = {};

    if (region) {
      local.province = region.province;
      local.provinceName = region.provinceName;
      local.city = region.city;
      local.cityName = region.cityName;
      local.area = region.area;
      local.areaName = region.areaName;
    }

    this.setData({ local: local });

  },
  /* ------------------------------
   显示选择器
   ------------------------------ */
  showSheet(){
    // 显示选择器
    this.setData({ hidden: '' });
    // 查询省份
    this.queryProvinces();
  },
  /* ------------------------------
   隐藏选择器
   ------------------------------ */
  hideSheet(e){

    var
      isOk = e.target.dataset.isOk,
      input = this.data.input,
      region;

    // 触发事件
    if (isOk && input && input.province && input.city && input.area) {

      region = {
        province: input.province.id,
        provinceName: input.province.name,
        city: input.city.id,
        cityName: input.city.name,
        area: input.area.id,
        areaName: input.area.name
      };

      if (input.street) {
        region.street = input.street.id;
        region.streetName = input.street.name;
      }

      // 触发事件
      this.triggerEvent('change', { region: region });

    }

    // 关闭Sheet
    this.setData({ hidden: 'hidden' });

  },
  /* ------------------------------
   查询省份列表
   ------------------------------ */
  queryProvinces(){

    var that = this;
    helper.request({ url: 'wx/area/provinces', success: (ret) => that.bindProvinces(ret) });

  },
  /* ------------------------------
   绑定显示省份列表
   ------------------------------ */
  bindProvinces(ret){

    var
      input = this.data.input || {},
      inputProvinceId = input.province ? input.province.id : null;

    this.setData({
      provinces: ret,
      hiddenCandidate: { province: '', city: 'hidden', area: 'hidden' }
    });

    // 查询下属城市
    this.queryCities(inputProvinceId);

  },
  /* ------------------------------
   查询城市列表
   ------------------------------ */
  queryCities(provinceId){

    if (!provinceId)
      return;

    var that = this;

    helper.request({
      url: '/wx/area/cities',
      data: { provinceId: provinceId },
      success: (ret) => that.bindCities(ret)
    });

  },
  /* ------------------------------
   绑定显示城市列表
   ------------------------------ */
  bindCities(ret){

    var
      input = this.data.input || {},
      inputCityId = input.city ? input.city.id : null;

    this.setData({
      cities: ret,
      hiddenCandidate: { province: 'hidden', city: '', area: 'hidden' }
    });

    // 查询下属区县
    this.queryAreas(inputCityId);

  },
  /* ------------------------------
   查询区县列表
   ------------------------------ */
  queryAreas(cityId){

    if (!cityId)
      return;

    var that = this;

    helper.request({
      url: 'wx/area/districts',
      data: { cityId: cityId },
      success: (ret) => that.bindAreas(ret)
    });

  },
  /* ------------------------------
   绑定显示区县列表
   ------------------------------ */
  bindAreas(ret){

    var
      input = this.data.input || {},
      inputAreaId = input.area ? input.area.id : null;

    this.setData({
      areas: ret,
      hiddenCandidate: { province: 'hidden', city: 'hidden', area: '' }
    });

  },
  /* ------------------------------
   处理已选省份Click
   ------------------------------ */
  selectedProvinceClick(){

    var input = this.data.input || {};

    input.city = null;
    input.area = null;

    this.setData({
      input: input,
      hiddenCandidate: { province: '', city: 'hidden', area: 'hidden' }
    });

  },
  /* ------------------------------
   处理已选城市Click
   ------------------------------ */
  selectedCityClick(){

    this.setData({
      inputArea: null,
      hiddenCandidate: { province: 'hidden', city: '', area: 'hidden' }
    });

  },
  /* ------------------------------
   处理已选区县Click
   ------------------------------ */
  selectedAreaClick(){

    this.setData({
      hiddenCandidate: { province: 'hidden', city: 'hidden', area: '' }
    });

  },
  /* ------------------------------
   处理备选省份Click
   ------------------------------ */
  candidateProvinceClick(e){

    // 捕获子元素，用 e.target
    var
      ds = e.target.dataset,
      input = {
        province: { id: ds.provinceId, name: ds.provinceName },
        city: null,
        area: null
      };

    // 绑定数据
    this.setData({ input: input });

    // 查询下属城市
    this.queryCities(ds.provinceId);

  },
  /* ------------------------------
   处理备选城市Click
   ------------------------------ */
  candidateCityClick(e){

    // 捕获子元素，用 e.target
    var
      ds = e.target.dataset,
      input = this.data.input || {};

    input.city = { id: ds.cityId, name: ds.cityName };
    input.area = null;

    // 绑定数据
    this.setData({ input: input });

    // 查询下属区县
    this.queryAreas(ds.cityId);

  },
  /* ------------------------------
   处理备选区县Click
   ------------------------------ */
  candidateAreaClick(e){

    // 捕获子元素，用 e.target
    var
      ds = e.target.dataset,
      input = this.data.input || {};

    input.area = { id: ds.areaId, name: ds.areaName };

    // 绑定数据
    this.setData({ input: input });

    // TODO 确定按钮可用

  }

}

});
