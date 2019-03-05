/**
 * 活动列表
 * activitiesPart
 * -----------------------------------
 * 19/02/26 Jerry 新增
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
  categoryId: { type: String, observer(newVal) { this.initCategoryId( newVal ) } },
  initActivities: { type: Object, observer(newVal) { this.initActivities( newVal ) } },
  initPreviewActivities: { type: Object, observer(newVal) { this.initPreviewActivities( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'activities', text: '活动中' }
  ],
  tab: 'activities'
},
/* ------------------------------
 组件生命周期
------------------------------ */
lifetimes: {

  /* ------------------------------
   页面加载
  ------------------------------ */
  attached() {
    // 设置scroll-view高度
    helper.setScrollViewHeight(this, 240);
  }

},
/* ------------------------------
 组件所在页面的生命周期
------------------------------ */
pageLifetimes: {

  /* ------------------------------
   页面显示
  ------------------------------ */
  show() {

  }

},
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化类目编号
  ------------------------------ */
  initCategoryId(categoryId){
    this.setData({ categoryId });
  },
  /* ------------------------------
   初始化活动中的活动列表
  ------------------------------ */
  initActivities(activities){
    this.bindActivities('activities', activities);
  },
  /* ------------------------------
   初始化预告的活动列表
  ------------------------------ */
  initPreviewActivities(previewActivities){
    this.bindActivities('previewActivities', previewActivities);
  },
  /* ------------------------------
   视图滚动到底部
  ------------------------------ */
  scrollToLower(){

  },
  /* ------------------------------
   处理Tab导航Click
  ------------------------------ */
  tabNavClick(e) {

    var
    tab = e.currentTarget.dataset.navKey,
    isSame = tab == this.data.tab;

    // 切换tab
    this.setData({ tab: tab });

    // 重复点击tab时，重新查询数据；
    // 否则按分页方式查询数据。
    this.queryActivities( !isSame );
  },
  /* ------------------------------
   查询活动列表
  ------------------------------ */
  queryActivities(paging){

    var
    tab = this.data.tab,
    existActivities = this.data[ tab ],
    category = this.data.categoryId,
    pageIndex = helper.nextPageIndex( existActivities, paging ),
    approveStatus;

    if (pageIndex < 0)
      return;

    if ('activities' == tab){
      approveStatus = 'Enabled';
    }
    else if ('previewActivities' == tab){
      approveStatus = 'Approved';
    }

    helper.request({
      url: helper.formatUrl('wx/act/list', { category, approveStatus, pageIndex }),
      success: (ret) => this.bindActivities(null, ret)
    });

  },
  /* ------------------------------
   绑定显示活动
  ------------------------------ */
  bindActivities(key, ret){

    var tabNavItems = this.data.tabNavItems;

    if (!key)
      key = this.data.tab;

    // 格式化日期时间
    helper.bindDt2Str(ret.records, 'createTime');

    // 补全活动品牌LOGO完整Url
    helper.bindFullImgUrl(ret.records, 'brandImageUrl', 'fullBrandImageUrl');

    // 拼接绑定分页数据
    helper.setData(this, key, helper.concatPaging(this, key, ret));

    // 对应tab项的业务记录数
    tabNavItems[ key === 'previewActivities' ? 1 : 0 ].count = ret.recordCount;

    // 绑定数据
    this.setData({ tabNavItems });

  }

}

});
