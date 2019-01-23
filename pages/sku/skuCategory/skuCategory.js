/**
 * SKU分类样式
 * skuCategory.less
 * -----------------------------------
 * 18/03/19 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  tabNavItems: [],
  tab: 'puersheng',
  scrollLeft:0,
  currentIndex:0,
  twoLevel:false,
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts) {
  
  var tab;

    // 判断是是一级分类进来还是二级分类
    if(opts.type2) {
      tab = opts.type2;
      this.setData({
        typeId:opts.type1,
        twoLevel:true
      });
    } else {
      tab = opts.type1;
    }

  this.setData({ seller: opts.seller, sellerName: opts.sellerName, tab: tab });

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 更新导航标题
  if (opts.sellerName)
    helper.navTitle(opts.sellerName);

  // 查询导航？
  this.queryNav();

},
/* ------------------------------
 页面nav
 ------------------------------ */
queryNav: function(){
  var
      that = this,
      twoLevel = this.data.twoLevel;

        helper.request({
          url: 'wx/cat/list?withChildren=true',
          success: function (ret) {
            var types = [], tab = '';
            helper.each(ret, function(idx, type){
              if(!twoLevel) {
                types.push({ key: type.typeId, text: type.typeName });
                if(ret[idx].typeId == that.data.tab) {
                  if( idx < 5 ) {
                    helper.setData(that, { scrollLeft: "200" })
                  }
                  if (ret.length > 0)
                    tab = ret[idx].typeId;
                }
              } else {
                if(ret[idx].typeId == that.data.typeId) {
                  types.length = 0;
                  tab = '';
                  var retc = ret[idx].children;
                  helper.each(retc, function(idx, type){
                    types.push({ key: type.typeId, text: type.typeName });
                    if(retc[idx].typeId == that.data.tab) {
                      if( idx > 5 ) {
                        helper.setData(that, { scrollLeft: "350" })
                      }
                      if (retc.length > 0)
                        tab = retc[idx].typeId;
                    }
                  })
                }
              }
            });
            helper.setData(that, { tabNavItems: types, tab: tab });
            // 查询SKU
            that.querySKUs();
          }
        });

},
/* ------------------------------
 页面触底
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.querySKUs('scrollend');
},
/* ------------------------------
 处理Tab导航Click
------------------------------ */
tabNavClick: function(e) {
  console.log(e)
  var
  tab = e.currentTarget.dataset.navKey,
  isSame = tab == this.data.tab;

  // 切换tab
  this.setData({ tab: tab });

  // 重复点击tab时，重新查询数据；
  // 否则按分页方式查询数据。
  this.querySKUs( !isSame );
},
/* ------------------------------
 按分类查询SKU列表
------------------------------ */
querySKUs: function(paging){

  var
    tab = this.data.tab,
    existSKUs, // = this.data[ tab + '_skus' ],
    pageIndex, // = helper.nextPageIndex( existSKUs, paging ),
    twoLevel = this.data.twoLevel,
    navItem,
    queryArgs;

  helper.each(this.data.tabNavItems, function(idx, item){
    if (item.key == tab)
      navItem = item;
  });

  existSKUs = navItem.skus;
  pageIndex = helper.nextPageIndex( existSKUs, paging );

  if (pageIndex < 0)
    return;

  queryArgs = { seller: this.data.seller, pageIndex: pageIndex || 0 };
  queryArgs[ !twoLevel ? 'type1' : 'type2' ] = tab;

  helper.request({
    url: helper.formatUrl('wx/sku/list', queryArgs),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs: function(ret){

  var
  key = this.data.tab + '_skus',
  skus;

  var
      currentIndex = this.data.index,
      currentTab = this.data.tab,
      navItems = this.data.tabNavItems,
      navItem;

  helper.each(navItems, function(idx, item){
    if (item.key == currentTab) {
      navItem = item;
      currentIndex  = idx;
    }
  });
  this.setData({ index: currentIndex });
  
  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);


  navItem.skus = this.concatPaging(navItem.skus, ret);

  helper.setData(this, { tabNavItems: navItems });

  // 拼接分页数据
  //skus = helper.concatPaging(this, key, ret);

  // 绑定数据
  //helper.setData(this, key, skus);

},
  /* ------------------------------
   拼接分页业务数据
   ------------------------------ */
  concatPaging: function(oriData, newData){

    // 如果新分页数据的 pageIndex == 1（首页）时，视为重新查询
    // 需要将 oridata 清空（保证对应的view竖向滚动条复位，并正确显示分页加载提示）
    if (newData.pageIndex == 1)
        return newData;

    if (oriData) {

      // 其他情况，如果 oriData 的 pageIndex 大于或者与 newData 的 pageIndex 一致（重复查询），
      // 这时返回 oridata（因为包含了之前已拼接的全部业务数据）
      if (oriData.pageIndex >= newData.pageIndex)
        return oriData;

      // 将新旧数据列表拼在一起
      newData.records = oriData.records.concat(newData.records);

    }

    // 返回 newData
    return newData;
  }

})
