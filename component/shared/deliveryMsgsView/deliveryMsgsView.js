/**
 * 物流消息列表
 * deliveryMsgAll
 * -----------------------------------
 * 19/02/23 Jerry 新增
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
data: {
  tabNavItems: [
    { key: 'activity', text: '活动推荐' },
    { key: 'notice', text: '公告通知' }
  ],
  tab: 'activity'
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
    helper.setScrollViewHeight(this, 260);
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
   视图滚动到底部
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
    pageIndex = helper.nextPageIndex( existMsgs, paging );

    if (pageIndex < 0)
      return;

    helper.request({
      url: helper.formatUrl('wx/delivery/list', { deliveryDone: true }),
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
  }

}

});
