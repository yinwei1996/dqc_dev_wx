/**
 * 增值服务列表
 * userExServiceAll
 * -----------------------------------
 * 19/02/22 Jerry 新增
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
  helper.navTitle('购买服务');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 100);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
  // 查询可用服务
  this.queryServices();
},
/* ------------------------------
 下拉刷新
------------------------------ */
onPullDownRefresh(){
  // 查询可用服务
  this.queryServices();
},
/* ------------------------------
 查询可用服务
------------------------------ */
queryServices() {
  helper.request({ url: 'wx/exServ/onSaleList', success: this.bindServices });
},
/* ------------------------------
 绑定数据
------------------------------ */
bindServices(ret){

  helper.each(ret, (idx, serv) => {
    serv.priceString = helper.fen2str(serv.price);
    serv.userExpireTimeString = helper.d2str(serv.userExpireTime);
  });

  // 绑定数据
  this.setData({ services: ret });

  // 如果是通过下拉操作触发的，收起下拉
  wx.stopPullDownRefresh();

},
/* ------------------------------
 选中服务项
------------------------------ */
clickServiceItem(e) {

  var
    services = this.data.services,
    curIdx = parseInt(e.currentTarget.dataset.idx),
    curServ = services[ curIdx ];

  helper.each(services, (idx, serv) => {
    if (idx !== curIdx)
      serv.selected = false;
  });

  // 切换选中状态
  curServ.selected = !curServ.selected;

  // 绑定数据
  this.setData({
    services,
    serviceId: curServ.serviceId,
    anyToConfirm: curServ.selected
  });

},
/* ------------------------------
 确认购买
------------------------------ */
confirmBuy(){

  var serviceId = this.data.serviceId;

  helper.request({
    loading: true,
    url: 'wx/order/confirmExService',
    data: { serviceId },
    success: order => {
      // 禁用"充值"按钮
      this.setData({ anyToRecharge: false });
      // 跳转到支付确认页
      helper.navigateFormat('orderPayConfirm', { orderId: order.orderId });
    }
  });

}

})
