/**
 * 系统消息列表
 * sysMsgAll
 * -----------------------------------
 * 19/02/23 Jerry 更新
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
    this.queryMsgs( !isSame );
  },
  /* ------------------------------
   查询消息列表
  ------------------------------ */
  queryMsgs(paging){

    var
    tab = this.data.tab,
    existLogs = this.data[ tab + '_msgs' ],
    pageIndex = helper.nextPageIndex( existLogs, paging ),
    queryUrl,
    queryArgs;

    if (pageIndex < 0)
      return;

    if ('activity' == tab){
      queryUrl = 'wx/act/list';
      queryArgs = { approveStatus: 'Enabled', onlyAttention: true, recommend: true };
    }
    else if ('notice' == tab){
      queryUrl = 'wx/content/list';
      queryArgs = { };
    }

    queryArgs[ 'pageIndex' ] = pageIndex || 0;

    helper.request({
      url: helper.formatUrl(queryUrl, queryArgs),
      success: ret => this.bindMsgs(ret)
    });

  },
  /* ------------------------------
   绑定显示消息
  ------------------------------ */
  bindMsgs(ret){

    var
    key = this.data.tab + '_msgs';

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

  },
  /* ------------------------------
   点击消息
  ------------------------------ */
  clickMsg(e){

    var
      key = this.data.tab + '_msgs',
      msgs = this.data[ key ],
      curIdx = parseInt(e.currentTarget.dataset.idx),
      curMsg = msgs.records[ curIdx ],
      curImageUrl = e.target.dataset.imageUrl;

    // 如果有图片Url，预览图片
    if (curImageUrl) {
      wx.previewImage({ urls: curMsg.fullImageUrls || [ curMsg.firstImageUrl ], current: curImageUrl });
      return;
    }

  }

}

});
