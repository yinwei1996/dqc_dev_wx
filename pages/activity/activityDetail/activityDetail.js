/**
 * 活动详情样式
 * activityDetail.less
 * -----------------------------------
 * 18/09/18 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  tabNavItems: []
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function (opts) {

  var
  // 先从 opts 获取 urlCode
  urlCode = opts.urlCode;

  // 如果 urlCode 为空，尝试从 opts.query.q 获取，
  // 仍然为空，跳转到首页
  if (!urlCode)
    urlCode = helper.parseQueryArgs(opts.q).urlCode;

  if (!urlCode) {
    helper.switchTab('index');
    return;
  }

  // 更新导航标题
  helper.navTitle('活动详情');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 绑定数据
  helper.setData(this, { urlCode: urlCode });

},
/* ------------------------------
 页面呈现
------------------------------ */
onShow: function(){
  // 查询活动详情
  this.queryActivity();
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
 查询活动详情
------------------------------ */
queryActivity: function(){

  helper.request({
    url: 'wx/act/detail',
    data: { urlCode: this.data.urlCode },
    success: this.bindActivity
  });

},
/* ------------------------------
 绑定显示活动
------------------------------ */
bindActivity: function(ret){

  var
    that = this,
    tabNavItems = [],
    queryUrls = {},
    key;

  // 更新导航标题
  helper.navTitle(ret.activity.activityName);

  helper.each(ret.items, function(idx, item){

    key = 't' + item.sysNo;

    tabNavItems.push({ key: key, text: item.itemName, item: item });
    queryUrls[ key ] = item.listQueryUrl.replace('/item/list', '/wx/sku/list');

  });

  // 绑定数据
  helper.setData(this, { activity: ret.activity, tabNavItems: tabNavItems, tab: tabNavItems[0].key, queryUrls: queryUrls });

  this.querySKUs();

},
/* ------------------------------
 按楼层查询SKU列表
------------------------------ */
querySKUs: function(paging){

  var
  tab = this.data.tab,
  url = this.data.queryUrls[ tab ],
  existSKUs = this.getItemByTab(tab).skus,
  pageIndex = helper.nextPageIndex( existSKUs, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: [url, url.indexOf('?') >= 0 ? '&' : '?', 'pageIndex=', pageIndex || 0 ].join(''),
    success: this.bindSKUs
  });

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
getItemByTab: function(tab){

  var
    navItems = this.data.tabNavItems,
    curItem;

  // 找到指定的 navItem
  helper.each(navItems, function(idx, item){

    if (item.key === tab) {
      curItem = item;
      return false;
    }

    return true;

  });

  return curItem;

},
/* ------------------------------
 绑定显示SKU列表
------------------------------ */
bindSKUs: function(ret){

  var
  curTab = this.data.tab,
  key = curTab + '_skus',
  navItems = this.data.tabNavItems,
  curItem;

  // 找到指定的 navItem
  helper.each(navItems, function(idx, item){

    if (item.key === curTab) {
      curItem = item;
      return false;
    }

    return true;

  });

  // 绑定SKU图片完整URL
  helper.bindFullImgUrl(ret.records);

  // 如果新分页数据的 pageIndex == 1（首页）时，视为重新查询
  // 需要将 oridata 清空（保证对应的view竖向滚动条复位，并正确显示分页加载提示）
  if (ret.pageIndex == 1) {
    curItem.skus = null;
    helper.setData(this, { tabNavItems: navItems });
  }

  // 拼接分页数据
  curItem.skus = helper.concatPagingData(curItem.skus, ret);

  // 绑定数据
  helper.setData(this, { tabNavItems: navItems });

}

})
