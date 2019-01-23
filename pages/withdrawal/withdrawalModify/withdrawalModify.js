/**
 * 申请提现
 * withdrawalModify.js
 * -----------------------------------
 * 18/04/26 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts) {

  var that = this;

  // 更新导航标题
  helper.navTitle('申请提现');

  // 查询详情
  this.queryWithdrawal();

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 确认是否有传入的银行卡
  var
  that = this,
  cardId = helper.pageArg('withdrawal');

  if (cardId) {
    // 银行卡
    this.bindCard(cardId);
  }

},
/* ------------------------------
 查询提现详情
------------------------------ */
queryWithdrawal: function(){

  helper.request({
    url: 'wx/withdrawal/beforeAdd',
    success: this.bindWithdrawal
  });

},
/* ------------------------------
 绑定显示提现详情
------------------------------ */
bindWithdrawal: function(withdrawal){

  // 绑定数据
  helper.setData(this, { withdrawal: withdrawal }, false);

  // 如果没有默认银行卡，跳转到银行卡新增页
  if (!withdrawal.card)
    this.selectCard();

},
/* ------------------------------
 选择银行卡
------------------------------ */
selectCard: function(){

  // 有备选银行卡时，跳转到银行卡列表页；
  // 没有银行卡时，跳转到银行卡新增页。
  helper.navigateFormat( this.data.withdrawal.card ? 'bankcardAll' : 'bankcardModify', { from: 'withdrawal' } );

},
/* ------------------------------
 绑定银行卡
------------------------------ */
bindCard: function(cardId){

  var that = this;

  helper.request({
    url: 'wx/bankcard/detail',
    data: { cardId: cardId },
    success: function (ret) { helper.setDataProp(that, 'withdrawal.card', ret) }
  });
},
/* ------------------------------
 输入提现金额
------------------------------ */
inputAmount: function(e){

  var
  withdrawal = this.data.withdrawal,
  rate = withdrawal.rate;

  withdrawal.payableAmount = e.detail.value;
  withdrawal.payableVal = rate > 0 ? withdrawal.payableAmount / rate : 0;

  // 绑定数据
  this.setData({ withdrawal: withdrawal });
},
/* ------------------------------
 保存提现申请
------------------------------ */
save: function(){

  var
  withdrawal = this.data.withdrawal,
  cardId = ( withdrawal.card || {} ).cardId,
  payableAmount = withdrawal.payableAmount;

  helper.request({
    url: 'wx/withdrawal/add',
    data: { cardId: cardId, payableAmount: payableAmount },
    success: this.afterSave
  });

},
/* ------------------------------
 保存申请之后，跳转到详情页
------------------------------ */
afterSave: function(withdrawal){

  helper.redirectFormat('withdrawalDetail', { withdrawalId: withdrawal.withdrawalId });
}

})
