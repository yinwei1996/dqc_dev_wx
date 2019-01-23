/**
 * 银行卡编辑
 * bankcardModify.js
 * -----------------------------------
 * 18/04/26 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  hidden: 'hidden',
  // card 默认留空
  card: { },
  cardBanks: [
    { val: 'ICBC', text: '中国工商银行' },
    { val: 'CCB', text: '中国建设银行' },
    { val: 'ABC', text: '中国农业银行' },
    { val: 'BOC', text: '中国银行' },
    { val: 'CMB', text: '招商银行' },
    { val: 'BCM', text: '交通银行' }
  ]
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts){

  // 更新导航
  helper.navTitle( opts.cardId ? '编辑银行卡' : '新增银行卡' );

  // 是否来自提现申请
  this.setData({ withdrawal: 'withdrawal' == opts.from });

  if (opts.cardId) {
    // 如果传入了cardId，查询银行卡详情
    this.queryCard(opts.cardId);
  }
  else {
    // 没有cardId时，查询用户详情（获取真实姓名）
    this.queryUser();
  }

},
/* ------------------------------
 查询银行卡详情
------------------------------ */
queryCard: function(cardId){

  if (!cardId)
    return;

  helper.request({
    url: 'wx/bankcard/detail',
    data: { cardId: cardId },
    success: this.bindCard
  });

},
/* ------------------------------
 绑定显示银行卡详情
------------------------------ */
bindCard: function(ret){

  // 绑定数据
  helper.setData(this, { card: ret }, false);
},
/* ------------------------------
 查询个人详情
------------------------------ */
queryUser: function(){

  var that = this;

  helper.request({
    url: 'wx/my/detail',
    success: function(user){ helper.setDataProp(that, 'card.cardAccountMasked', user.userNameMasked, false) }
  });

},
/* ------------------------------
 录入发卡银行
------------------------------ */
inputCardBank: function(e){
  this.inputProperty(e, 'cardBank', 'cardBanks');
},
/* ------------------------------
 录入卡号
------------------------------ */
inputCardCode: function(e){
  this.inputProperty(e, 'cardCode');
},
/* ------------------------------
 录入发票属性（私有）
------------------------------ */
inputProperty: function(e, prop, enumName){

  // 更新属性为录入值
  var
  val = e.detail.value,
  card = this.data.card;

  // 文本框值
  card[ prop ] = val;

  // 枚举名称
  if (enumName) {

    // 枚举值
    val = this.data[ enumName ][ val ];
    card[ prop ] = val.val;
    card[ prop + 'Title' ] = val.text;

  }

  // 绑定数据
  this.setData({ card: card });

},
/* ------------------------------
 保存银行卡
------------------------------ */
saveCard: function(){

  var card = this.data.card;

  helper.request({
    url: card.cardId ? 'wx/bankcard/modify' : 'wx/bankcard/add',
    data: card,
    success: this.afterSave
  });

},
/* ------------------------------
 保存银行卡之后，跳转到指定页面
------------------------------ */
afterSave: function(card){

  // 如果来自"订单确认"页，返回 bankcardId 至前一页
  if (this.data.withdrawal){
    helper.pageArg('withdrawal', card.cardId);
    wx.navigateBack(1);
    return;
  }

  // 默认返回银行卡列表
  this.back();

},
/* ------------------------------
 返回上一页面
------------------------------ */
back: function(){

  wx.navigateBack();
}

})
