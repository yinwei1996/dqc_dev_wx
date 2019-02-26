/**
 * 平台活动消息列表
 * activityMsgsPart
 * -----------------------------------
 * 19/02/25 Jerry 新增
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
  hidden: { type: String, observer(newVal) { this.initHidden( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: { },
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

    if (this.data.hidden !== 'hidden')
      this.queryMsgs();

  }

},
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化 hidden 参数
  ------------------------------ */
  initHidden(hidden){
    this.setData({ hidden });
  },
  /* ------------------------------
   视图滚动到底部
  ------------------------------ */
  scrollToLower(){

    // 分页查询（标识scrollend）
    this.queryMsgs('scrollend');

  },
  /* ------------------------------
   查询消息列表
  ------------------------------ */
  queryMsgs(paging){

    var
    existMsgs = this.data.msgs,
    keyword = this.data.keyword,
    pageIndex = helper.nextPageIndex( existMsgs, paging );

    if (pageIndex < 0)
      return;

    helper.request({
      url: helper.formatUrl('wx/delivery/list', { deliveryDone: true, s: keyword, pageIndex: pageIndex }),
      success: ret => this.bindMsgs(ret)
    });

  },
  /* ------------------------------
   绑定显示消息
  ------------------------------ */
  bindMsgs(ret){

    var key = 'msgs';

    // 格式化日期时间
    helper.each(ret.records, (idx, msg) => {

      msg.publishTimeString = helper.dt2str(msg.publishTime);
      msg.createTimeString = helper.dt2str(msg.createTime);

      if (msg.imageUrls) {
        msg.fullImageUrls = [];
        helper.each(msg.imageUrls, (idx, url) => msg.fullImageUrls.push(helper.concatFullImgUrl(url)));
      }

    });

    // 拼接绑定分页数据
    helper.setData(this, key, helper.concatPaging(this, key, ret));

    console.log(this.data.msgs);

  },
  /* ------------------------------
   复制单号
  ------------------------------ */
  copyActualCode(e){

    var actualCode = e.currentTarget.dataset.actualCode;

    wx.setClipboardData({
      data: actualCode,
      success: () => helper.showToast('已复制单号')
    });

    console.log('copyActualCode => ' + actualCode);
  },
  /* ------------------------------
   输入搜索关键词
  ------------------------------ */
  inputKeyword(e){
    // 绑定数据
    this.setData({ keyword: e.detail.value });
    console.log('deliveryMsgsPart.inputKeyword => keyword: ' + this.data.keyword);
  },
  /* ------------------------------
   移除搜索关键词
  ------------------------------ */
  clickCancel(){
    this.setData({ keyword: '' });
  },
  /* ------------------------------
   点击搜索
  ------------------------------ */
  clickSearch(){
    // 查询消息列表
    this.queryMsgs();
  }

}

});
