/**
 * 积分充值
 * pointRecharge
 * -----------------------------------
 * 19/02/22 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  anyToRecharge: false
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts) {

  // 更新导航
  helper.navTitle('积分充值');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 100);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
  // 查询积分余额
  this.queryPoint();
},
/* ------------------------------
 查询积分余额
------------------------------ */
queryPoint() {
  //helper.request({ url: 'wx/account/point', data: { returnAvailableRecharges: true }, success: this.bindPoint });
  var ret = {
    normalAmount: 987,
    rechargeItems: [
      { amount: 1000, point: 1000 },
      { amount: 2000, point: 2000 },
      { amount: 50000, point: 50000 },
      { amount: 100000, point: 100000 },
      { amount: 500000, point: 500000 },
      { amount: 1000000, point: 1000000 }
    ]
  };
  this.bindPoint(ret);
},
/* ------------------------------
 绑定数据
------------------------------ */
bindPoint(ret){
  helper.each(ret.rechargeItems, (idx, item) => { item.amountString = helper.fen2str(item.amount, true) });
  this.setData(ret);
},
/* ------------------------------
 选中充值项
------------------------------ */
clickRechargeItem(e) {

  var
  rechargeItems = this.data.rechargeItems,
  curIdx = e.currentTarget.dataset.idx,
  curItem = rechargeItems[ curIdx ];

  helper.each(rechargeItems, (idx, item) => {
    if (idx !== curIdx)
      item.selected = false;
  });

  if (curItem.selected)
    return;

  // 切换选中状态
  curItem.selected = !curItem.selected;

  // 绑定数据
  this.setData({
    rechargeItems: rechargeItems,
    rechargeAmount: curItem.amount,
    anyToRecharge: true
  });

},
/* ------------------------------
 确认充值
------------------------------ */
confirmRecharge(){

  var
    that = this,
    rechargeAmount = this.data.rechargeAmount;

  helper.request({
    loading: true,
    url: 'wx/order/confirmRecharge',
    data: { payableAmount: rechargeAmount },
    success: (order) => {
      // 禁用"充值"按钮
      that.setData({ anyToRecharge: false });
      // 跳转到订单确认页
      helper.navigateFormat('orderConfirm', { orderId: order.orderId });
    }
  });

}

})
