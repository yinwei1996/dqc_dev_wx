/**
 * 银行卡列表
 * bankcardAll.js
 * -----------------------------------
 * 18/04/26 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: { },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts) {

  // 更新导航
  helper.navTitle('银行卡');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 是否来自提现申请
  this.setData({ withdrawal: 'withdrawal' == opts.from });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function() {

  // 查询银行卡
  this.queryCards();
},
/* ------------------------------
 查询银行卡
------------------------------ */
queryCards: function() {

  helper.request({ url: 'wx/bankcard/list', success: this.bindCards });
},
/* ------------------------------
 绑定显示银行卡
------------------------------ */
bindCards: function(cards) {

  // 绑定数据
  helper.setData(this, { cards: cards }, false);
},
/* ------------------------------
 处理银行卡Click
------------------------------ */
cardClick: function(e) {

  var
  ds = e.currentTarget.dataset,
  action = e.target.dataset.action;

  // （最优先）如果来自"提现申请"页，返回 cardId 至前一页
  if (this.data.withdrawal){
    helper.pageArg('withdrawal', ds.cardId);
    wx.navigateBack(1);
    return;
  }

  // 如果点击了"删除"按钮
  if ('del' == action){
    this.handleCardAction(1, ds);
    return;
  }

  // 隐藏"删除"按钮（如果有）
  this.setData({ opCardId: null });

  // 默认显示ActionSheet
  this.showCardAction(ds);

},
/* ------------------------------
 显示银行卡项ActionSheet
------------------------------ */
showCardAction: function(ds){

  var
  that =this,
  items = [],
  isDefault = ds.isDefault;

  // 0: 删除
  items.push('删除');

  // 1: 设为默认
  if (!isDefault)
    items.push('设为默认');

  wx.showActionSheet({
    itemList: items,
    success: function(ret) { that.handleCardAction(ret.tapIndex, ds) }
  });

},
/* ------------------------------
 处理银行卡ActionSheet Click
------------------------------ */
handleCardAction: function(tapIndex, ds){

  var
  cardId = ds.cardId;

  // 0: 删除
  if (tapIndex == 0){
    this.disableCard(cardId, ds);
    return;
  }

  // 1: 设为默认
  if (tapIndex == 1){
    this.setDefaultCard(cardId);
    return;
  }

},
/* ------------------------------
 跳转到新增银行卡页
------------------------------ */
addCard: function(){
  helper.navigateTo('bankcardModify');
},
/* ------------------------------
 设为默认银行卡
------------------------------ */
setDefaultCard: function(cardId){

  helper.request({
    url: 'wx/bankcard/setDefault',
    data: { cardId: cardId },
    success: this.onShow
  });

},
/* ------------------------------
 禁用银行卡
------------------------------ */
disableCard: function(cardId, ds){

  var
  bankTitle = ds.bankTitle,
  codeMasked = ds.codeMasked;

  helper.request({
    confirm: [ '确认删除 ', bankTitle, ' 尾号 ', codeMasked, ' 的银行卡？' ].join(''),
    url: 'wx/bankcard/setDisabled',
    data: { cardId: cardId },
    success: this.onShow
  });

},
/* ------------------------------
 银行卡项滑动开始
------------------------------ */
cardTouchStart: function(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  cardId = e.currentTarget.dataset.cardId,
  xy = e.touches[0];

  this.setData({
    touchStartCardId: cardId,
    touchStartCardX: xy.clientX,
    touchStartCardY: xy.clientY
  });

  console.log(['touch start => ', cardId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 银行卡项滑动
------------------------------ */
cardTouchMove: function(e){

  if (!e.touches || e.touches.length == 0)
    return;

  var
  cardId = e.currentTarget.dataset.cardId,
  xy = e.touches[0];

  this.setData({
    touchMoveCardId: cardId,
    touchMoveCardX: xy.clientX,
    touchMoveCardY: xy.clientY
  });

  console.log(['touch move => ', cardId, ', x: ', xy.clientX, ', y: ', xy.clientY].join(''));

},
/* ------------------------------
 银行卡项滑动结束
------------------------------ */
cardTouchEnd: function(e){

  var
  cardId = e.currentTarget.dataset.cardId,
  startCardId = this.data.touchStartCardId,
  moveCardId = this.data.touchMoveCardId,
  distanceX,
  distanceY;

  if (!startCardId || startCardId != moveCardId)
    return;

  distanceX = this.data.touchStartCardX - this.data.touchMoveCardX;
  distanceY = this.data.touchStartCardY - this.data.touchMoveCardY;

  // X轴从右到左距离超过一定标准的，显示"删除"操作
  this.setData({ opCardId: distanceX >= 60 ? cardId : null });

  console.log(['touch end => ', startCardId, ', distanceX: ', distanceX, ', distanceY: ', distanceY].join(''));

}

})
