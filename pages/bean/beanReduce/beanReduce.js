/**
 * 云豆抵扣订单金额
 * beanReduce.js
 * -----------------------------------
 * 18/04/25 Jerry 新增
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

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 绑定 orderId
  this.setData({ orderId: opts.orderId });
},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){
  // 查询可用云豆
  this.queryBean();
},
/* ------------------------------
 查询可用云豆
------------------------------ */
queryBean: function(){

  helper.request({
    url: 'wx/bean/beforeUse',
    data: { orderId: this.data.orderId },
    success: this.bindBean
  });

},
/* ------------------------------
 绑定显示可用云豆
------------------------------ */
bindBean: function(ret){

  // 绑定数据
  helper.setData(this, { bean: ret }, false);
},
/* ------------------------------
 输入抵扣云豆数量
------------------------------ */
inputBean: function(e){

  var
  bean = this.data.bean,
  minVal = bean.minVal,
  actualVal = bean.actualVal,
  val = e.detail.value,
  amount;

  // 对 amount 进行 floor，并保留两位小数
  amount = Math.floor( val * bean.rate * 100 ) / 100; 

  bean.val = val;
  bean.amount = amount;

  // 绑定数据
  this.setData({ bean: bean });
},
/* ------------------------------
 跳转回订单确认页
------------------------------ */
redirectOrderConfirm: function(){

  var
  bean = this.data.bean,
  minVal = bean.minVal,
  actualVal = bean.actualVal,
  val = bean.val;

  // 最低限额
  if (val < minVal){

    wx.showModal({
      title: '提示',
      content: [ '最少抵扣 ', minVal, ' 个云豆' ].join(''),
      showCancel: false
    });
    return;
  }

  // 最高限额
  if (val > actualVal){

    wx.showModal({
      title: '提示',
      content: [ '最多抵扣 ', actualVal, ' 个云豆', bean.isLimit ? ' (订单限额)' : '' ].join(''),
      showCancel: false
    });
    return;
  }

  helper.pageArg('orderConfirmBean', this.data.bean);
  wx.navigateBack(1);
}

})
