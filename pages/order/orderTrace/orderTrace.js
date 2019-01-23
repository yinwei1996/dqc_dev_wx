/**
 * 订单跟踪
 * orderTrace.js
 * -----------------------------------
 * 18/04/09 Jerry 新增
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

  // 更新导航标题
  helper.navTitle('查看物流');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 250);

  // 绑定数据
  this.setData({ orderId: opts.orderId });

  // 查询物流
  this.queryTrace();

},
/* ------------------------------
 查询物流
------------------------------ */
queryTrace: function(){

  helper.request({
    url: 'wx/delivery/trace',
    data: { orderId: this.data.orderId },
    success: this.bindTrace
  });

},
/* ------------------------------
 绑定显示物流
------------------------------ */
bindTrace: function(ret){

  var
  data = {
    orderCode: ret.orderCode,
    deliveryCompany: ret.deliveryCompanyName,
    deliveryCode: ret.deliveryCode,
    logs: ret.logs
  };

  helper.setData(this, data, false);

},
/* ------------------------------
 跳转到订单详情
------------------------------ */
redirectOrderDetail: function(){
  helper.redirectFormat('orderDetail', { orderId: this.data.orderId });
}

})
