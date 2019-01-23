/**
 * 搜索入口
 * searchEntry.js
 * -----------------------------------
 * 18/03/26 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  inputable: true,
  focus: true,
  hiddenClear: 'hidden',
  hiddenHistory: 'hidden',
  hiddenMultipleLayer: 'hidden', //综合排序弹层
  hiddenFilterLayer: 'hidden', //筛选弹层
  filterTags: {}
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  var
  keyword = opts.keyword,
  hiddenClear = keyword ? '' : 'hidden',
  // 如果没有传入关键词，显示搜索历史
  histories = !keyword ? wx.getStorageSync('searchHistory') : null,
  hiddenHistory = !keyword ? '' : 'hidden';

  helper.navTitle( opts.sellerName || '搜索' );

  // 绑定数据
  helper.setData(this, {
    sellerId: opts.seller,
    sellerName: opts.sellerName,
    inputKeyword: keyword,
    keyword: keyword,
    hiddenClear: hiddenClear,
    hiddenHistory: hiddenHistory
  });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 196);

  // 尝试按关键词搜索
  this.querySKUs();

},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.querySKUs('scrollend');
},
/* ------------------------------
 处理搜索
------------------------------ */
searchConfirm: function(e){
  // 搜索SKU
  this.querySKUs();
},
/* ------------------------------
 按关键词查询SKU列表
------------------------------ */
querySKUs: function(paging){

  var
  existSKUs = this.data.skus,
  pageIndex = helper.nextPageIndex( existSKUs, paging ),
  keyword = this.data.keyword,
  sellerId = this.data.sellerId,
  sort = this.data.sort,
  filterPropVals = this.data.filterPropVals,
  queryArgs;

  if (pageIndex < 0 || !keyword)
    return;

  // 更新本地搜索历史
  this.refreshHistories(keyword);

  // 如果分页为0，清空已绑定的SKU（保证 scroll-view 滚动到顶部）
  if (!pageIndex)
    this.setData({ skus: null, hiddenHistory: 'hidden' });

  queryArgs = {
    seller: sellerId,
    sort, sort,
    filterPropVals, filterPropVals,
    s: encodeURIComponent(keyword), pageIndex: pageIndex || 0 };

  helper.request({
    url: helper.formatUrl('wx/sku/list', queryArgs),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs: function(ret){

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);

  // 绑定数据，同时隐藏搜索历史UI
  helper.setData(this, { skus: helper.concatPaging(this, 'skus', ret), hiddenHistory: 'hidden' }, false);

  // 绑定筛选数据
  this.bindFilter();

},
/* ------------------------------
 确认是否显示"清除关键词"图标
------------------------------ */
searchInput: function(e){
  var keyword = e.detail.value;
  this.setData({ keyword: keyword, hiddenClear: keyword ? '' : 'hidden' });
},
/* ------------------------------
 输入框聚焦时，绑定显示搜索历史
------------------------------ */
searchFocus: function(){

  var
  keyword = this.data.keyword,
  histories;

  if (keyword)
    return;

  this.setData({
    histories: wx.getStorageSync('searchHistory'),
    hiddenHistory: ''
  });

},
/* ------------------------------
 清除输入的关键词
------------------------------ */
searchClear: function(){

  this.setData({
    inputKeyword: null,
    keyword: null,
    hiddenClear: 'hidden',
    hiddenHistory: ''
  });

},
/* ------------------------------
 返回首页
------------------------------ */
searchCancel: function(){
  helper.switchTab('index');
},
/* ------------------------------
 处理历史关键词Click
------------------------------ */
searchHistoryClick: function(e){

  var keyword = e.target.dataset.keyword;

  // 刷新UI（同时更新 inputKeyword，把内容显示在输入框）
  this.setData({
    inputKeyword: keyword,
    keyword: keyword,
    hiddenClear: ''
  });

  // 搜索SKU
  this.querySKUs();

},
/* ------------------------------
 刷新本地搜索历史
------------------------------ */
refreshHistories: function(keyword){

  if (!keyword)
    return;

  var
  histories = wx.getStorageSync('searchHistory'),
  idx;

  if (!histories)
    histories = [];

  for (idx = 0; idx < histories.length; idx++){

    if (histories[idx] != keyword)
      continue;

    histories.splice(idx, 1);
    break;

  }

  histories.unshift(keyword);

  // 将更新的数据保存到本地存储
  wx.setStorageSync('searchHistory', histories);

},
/* ------------------------------
 清空本地搜索历史
------------------------------ */
searchHistoryClear: function(){

  wx.removeStorageSync('searchHistory');
  this.setData({ histories: null, hiddenHistory: '' });

},
/* ------------------------------
 绑定筛选数据
 ------------------------------ */
bindFilter: function(){

  var
      ret = this.data.skus,
      filterGroups = ret.filterGroups,
      otherGroups = []; // 筛选分组

  if(filterGroups) {

    // 筛选分组 过滤只有一个元素&&item.selected为false的分组
    helper.each(filterGroups, function (idx, item) {

      var lgh = item.fields.length;

      // 排除selected为ture的分组
      helper.each(item.fields, function (i, itm) {

        if(lgh != 1 && !itm.selected) {
          otherGroups.push(filterGroups[idx]);
          return false;
        }

      });

    });

    // 筛选分组 品牌
    if(otherGroups[0].name == "品牌") {

      // 默认品牌大于等于6个 隐藏品牌分组
      if(otherGroups[0].fields.length <= 6) {

        this.setData({ hiddenFilterBrand: 'hidden'})
      } else {

        this.setData({ hiddenFilterBrand: ''})
      }

      // 绑定 品牌分组
      this.setData({
        filterBrandGroups: otherGroups[0]
      });

      // 筛选分组 除去品牌分组
      otherGroups.splice(0, 1);
    }

  }

  this.setData({ groups: filterGroups, otherGroups: otherGroups });


},
/* ------------------------------
 显示排序和筛选弹层
 ------------------------------ */
showFilterSheet: function(e){

  var
      key = e.currentTarget.dataset.key;

  // 显示排序弹层
  if(key == 'multiple') {
    this.setData({ hiddenMultipleLayer: ''});
  }

  // 显示筛选弹层
  if(key == 'filter') {
    this.setData({ hiddenMultipleLayer: 'hidden', hiddenFilterLayer: '' });
  }

},
/* ------------------------------
 隐藏弹层
 ------------------------------ */
hideLayer: function(){

  this.setData({ hiddenMultipleLayer: 'hidden', hiddenFilterLayer: 'hidden' });

},
/* ------------------------------
 综合排序 Click
 ------------------------------ */
multipleItemClick: function(e){

  var sort = e.currentTarget.dataset.val;

  this.setData({ sort: sort });

  // 隐藏综合弹层
  this.hideLayer();

  // 搜索SKU
  this.querySKUs();

},
/* ------------------------------
 SKU列表和图片切换 Click
 ------------------------------ */
lstImgSwitchClick: function(){

  var lstImgSwitch = !this.data.lstImgSwitch;

  // 隐藏弹层
  this.hideLayer();

  this.setData({ isLstImgSelected: true, lstImgSwitch: lstImgSwitch });

},
/* ------------------------------
 筛选分组 品牌 Click
 ------------------------------ */
filterBrandClick: function(){

  var
      hiddenFilterBrand = this.data.hiddenFilterBrand;

  this.setData({ hiddenFilterBrand: !hiddenFilterBrand });

},
/* ------------------------------
 筛选标签Click
 ------------------------------ */
optTagClick: function(e){

  var
      filterBrandGroups = this.data.filterBrandGroups,
      otherGroups = this.data.otherGroups,
      brand = e.currentTarget.dataset.type,
      index = e.currentTarget.dataset.index,
      select = !e.currentTarget.dataset.select;

  // 品牌标签 选择
  if(brand == "brand") {

    // 只能选一个品牌tag
    if(select) {

      // 单选
      helper.each(filterBrandGroups.fields, function (idx, item) {

        filterBrandGroups.fields[idx].selected = false;

      });

    }

    filterBrandGroups.fields[index].selected = select;

    this.setData({ filterBrandGroups });

  } else { // 除去品牌 分组标签 选择

    var aindex = e.currentTarget.dataset.aindex,
        bindex = e.currentTarget.dataset.bindex;

    // 每个分组只能 单选一个标签tag
    if(select) {

      helper.each(otherGroups[aindex].fields, function (idx, item) {

        otherGroups[aindex].fields[idx].selected = false;

      });

    }

    otherGroups[aindex].fields[bindex].selected = select;

    this.setData({ otherGroups });

  }

  // 获取已选中 筛选标签以及数量
  this.getSelectionTags();

},
/* ------------------------------
 获取已选中 筛选标签以及数量
 ------------------------------ */
getSelectionTags: function () {

  var
      filterBrandGroups = this.data.filterBrandGroups,
      otherGroups = this.data.otherGroups,
      countTags = 0, // 选择筛选标签数量
      filterPropValsArry = [],
      arr = {};

  // 获取品牌选择
  helper.each(filterBrandGroups.fields, function (idx, item) {

    if(item.selected) {

      arr = {
        'name': item.name,
        'type': filterBrandGroups.name
      };

      filterPropValsArry.push(arr);

      countTags++;

      return false;
    }

  });

  // 获取 其他选择tag
  helper.each(otherGroups, function (idx, item) {

    helper.each(item.fields, function (i, itm) {

      if(itm.selected) {

        arr = {
          'name': itm.name,
          'type': item.name
        };

        filterPropValsArry.push(arr);

        countTags++;

        return false;
      }

    });

  });

  this.setData({ filterPropValsArry, countTags });

},
/* ------------------------------
 重置 筛选分组 Click
 ------------------------------ */
resettingClick: function(){

  var
      filterBrandGroups = this.data.filterBrandGroups,
      otherGroups = this.data.otherGroups;

  // 获取品牌选择
  helper.each(filterBrandGroups.fields, function (idx, item) {

    item.selected = false;

    filterBrandGroups.fields[idx].selected = false;
  });



  // 获取 其他选择tag
  helper.each(otherGroups, function (idx, item) {

    helper.each(item.fields, function (i, itm) {

      otherGroups[idx].fields[i].selected = false;

    });

  });

  // 重置 filterBrandGroups otherGroups countTags 参数 filterPropVals
  this.setData({ filterBrandGroups, otherGroups, countTags: 0, filterPropVals: '' });

  // 重置 搜索
  this.querySKUs();

},
/* ------------------------------
 筛选 确定Click
 ------------------------------ */
saveFilterClick: function(){

  this.hideLayer();

  var
      filterPropValsArry = this.data.filterPropValsArry,
      filterPropValsOld;

  // filterPropValsArry 将选中的标签拼成 'ur + &filterPropVals=品牌%7C史泰博%2C'
  helper.each(filterPropValsArry, function (idx, item) {

    if(idx == 0) {
      filterPropValsOld += item.type + '%7C' + item.name
    } else {
      filterPropValsOld += '%2C' + item.type + '%7C' + item.name
    }

  });

  var filterPropVals = filterPropValsOld.replace("undefined","");

  // 绑定参数 filterPropVals
  this.setData({ filterPropVals: filterPropVals });

  // 按选中标签搜索
  this.querySKUs();

}


})
