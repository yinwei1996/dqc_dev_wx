/**
 * 申请提现详情
 * withdrawalDetail.js
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

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 绑定提现编号
  helper.setData(this, { withdrawalId: opts.withdrawalId });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){
  // 查询详情
  this.queryWithdrawal();
},
/* ------------------------------
 查询提现详情
------------------------------ */
queryWithdrawal: function(){

  var withdrawalId = this.data.withdrawalId;

  helper.request({
    url: 'wx/withdrawal/detail',
    data: { withdrawalId: withdrawalId },
    success: this.bindWithdrawal
  });

},
/* ------------------------------
 绑定显示提现详情
------------------------------ */
bindWithdrawal: function(withdrawal){

  // 申请时间、实付时间
  withdrawal.createTimeString = helper.dt2str(withdrawal.createTime);
  withdrawal.payTimeString = helper.dt2str(withdrawal.payTime);

  // 绑定数据
  helper.setData(this, { withdrawal: withdrawal }, false);

},
/* ------------------------------
 选择银行卡
------------------------------ */
handleCardSelect: function(){

  // 有备选银行卡时，跳转到银行卡列表页；
  // 没有银行卡时，跳转到银行卡新增页。
  helper.navigateFormat( this.data.withdrawal.card ? 'bankcardAll' : 'bankcardModify', { from: 'withdrawal' } );

},
/* ------------------------------
 保存提现申请
------------------------------ */
saveWithdrawal: function(){

  var
  withdrawal = this.data.withdrawal;

  helper.request({
    url: withdrawal.withdrawalId ? 'wx/withdrawal/modify' : 'wx/withdrawal/add',
    data: withdrawal,
    success: function(){ helper.redirectFormat('withdrawalDetail', { withdrawalId: withdrawal.withdrawalId }) }
  });

},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}

})
