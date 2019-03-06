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
  // 一级类目编号
  categoryId: { type: String, observer(newVal) { this.initCategoryId( newVal ) } },
  // 活动栏目编号
  columnId: { type: String, observer(newVal) { this.initColumnId( newVal ) } },
  // "活动中"活动列表
  initActivities: { type: Object, observer(newVal) { this.initActivities( newVal ) } },
  // "预告"活动列表
  initPreviewActivities: { type: Object, observer(newVal) { this.initPreviewActivities( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  tabNavItems: [
    { key: 'activities', text: '活动中' },
    { key: 'previewActivities', text: '预告' }
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
   页面隐藏
  ------------------------------ */
  hide() {
    // 清除已存在的倒计时
    this.clearTimer();
  }

},
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化一级类目编号
  ------------------------------ */
  initCategoryId(categoryId){
    this.setData({ categoryId });
  },
  /* ------------------------------
   初始化活动栏目编号
  ------------------------------ */
  initColumnId(columnId){
    this.setData({ columnId });
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
   处理Tab导航Click
  ------------------------------ */
  tabNavClick(e) {

    let
      tab = e.currentTarget.dataset.navKey,
      isSame = tab == this.data.tab;

    // 切换tab
    this.setData({ tab });

    // 重复点击tab时，重新查询数据；
    // 否则按分页方式查询数据。
    this.queryActivities( !isSame );
  },
  /* ------------------------------
   查询活动列表
  ------------------------------ */
  queryActivities(paging){

    let
      { tab, categoryId, columnId } = this.data,
      existActivities = this.data[ tab ],
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
      url: helper.formatUrl('wx/act/list', { category: categoryId, columnId, approveStatus, pageIndex }),
      success: (ret) => this.bindActivities(null, ret)
    });

  },
  /* ------------------------------
   绑定显示活动
  ------------------------------ */
  bindActivities(key, ret){

    // 清除已存在的倒计时
    this.clearTimer();

    let { tabNavItems } = this.data;

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

    // 刷新倒计时
    this.refreshCountdown();

  },
  /* ------------------------------
   刷新全部倒计时
  ------------------------------ */
  refreshCountdown(){

    let
      { activities, previewActivities, curSale, countSeconds } = this.data,
      countdownString;

    if (!countSeconds)
      countSeconds = 0;

    // 刷新"活动中"活动的倒计时
    helper.each(
      activities ? activities.records : null,
      (idx, act) => this.refreshActivityCountdown('expireCountdown', act, countSeconds));

    // 刷新"预告"活动的倒计时
    helper.each(
      previewActivities ? previewActivities.records : null,
      (idx, act) => this.refreshActivityCountdown('validCountdown', act, countSeconds));

    // countSeconds 是全局变量，要一直累加
    let localData = { countSeconds: countSeconds + 1 };

    if (activities)
      localData.activities = activities;

    if (previewActivities)
      localData.previewActivities = previewActivities;

    if (!this.data.countdownTimer) {
      localData.countdownTimer = setInterval(() => this.refreshCountdown(), 1000);
      console.log('已创建计时器');
    }

    // 绑定数据
    this.setData(localData);

  },
  /* ------------------------------
   按活动刷新倒计时
  ------------------------------ */
  refreshActivityCountdown(prop, act, countSeconds){

    let countdown = act[ prop ] - countSeconds;

    act.countdownLabel = countdown > 0 ? '结束时间' : '已结束';
    act.countdownVal = countdown > 0 ? helper.seconds2obj(countdown) : null;

    let { days, hours, minutes, seconds }  = act.countdownVal || {};

/*
    console.log([
      'activitiesPart.refreshCountdown => ', act.activityName,
      ', countdown: ', countdown,
      ', label: ', act.countdownLabel,
      ', days: ', days,
      ', hours: ', hours,
      ', minutes: ', minutes,
      ', seconds: ', seconds
      ].join(''));
*/

  },
  /* ------------------------------
   清除计时器
  ------------------------------ */
  clearTimer(){

    if (!this.data.countdownTimer)
      return;
    
    // 清除计时器（同时也清除秒数）
    clearInterval(this.data.countdownTimer);
    this.setData({ countdownTimer: null, countSeconds: null });

    console.log('activitiesPart.clearTimer => 已清除计时器');
  }

}

});
