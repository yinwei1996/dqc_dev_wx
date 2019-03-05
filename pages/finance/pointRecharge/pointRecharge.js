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
 下拉刷新
 ------------------------------ */
onPullDownRefresh(){
  // 查询积分余额
  this.queryPoint();
},
/* ------------------------------
 查询积分余额
------------------------------ */
queryPoint() {
  helper.request({ url: 'wx/account/point', data: { returnAvailableRecharges: true }, success: this.bindPoint });
},
/* ------------------------------
 绑定数据
------------------------------ */
bindPoint(ret){

  helper.each(ret.availableRecharges, (idx, item) => item.priceString = helper.fen2str(item.price, true));
  this.setData(ret);

  // 停止下拉动画
  wx.stopPullDownRefresh();

},
/* ------------------------------
 选中充值项
------------------------------ */
clickItem(e) {

  var
  availableRecharges = this.data.availableRecharges,
  curIdx = e.currentTarget.dataset.idx,
  curItem = availableRecharges[ curIdx ];

  helper.each(availableRecharges, (idx, item) => {
    if (idx !== curIdx)
      item.selected = false;
  });

  if (curItem.selected)
    return;

  // 切换选中状态
  curItem.selected = !curItem.selected;

  // 绑定数据
  this.setData({
    availableRecharges,
    rechargeId: curItem.selected ? curItem.rechargeId : 0,
    anyToRecharge: true
  });

},
/* ------------------------------
 确认充值
------------------------------ */
confirmRecharge(){

  var rechargeId = this.data.rechargeId;

  helper.request({
    loading: true,
    url: 'wx/order/confirmPointRecharge',
    data: { rechargeId },
    success: (order) => {
      // 禁用"充值"按钮
      this.setData({ anyToRecharge: false });
      // 跳转到支付确认页
      helper.navigateFormat('orderPayConfirm', { orderId: order.orderId });
    }
  });

}

})
