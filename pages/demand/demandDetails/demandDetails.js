/**
 * 求购单-详情页
 * demandDetails.js
 * -----------------------------------
 * 18/11/14
 */


var
  helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
 ------------------------------ */
data: {},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function (opts) {
  helper.navTitle("求购详情");
  
  // 绑定订单编号
  this.setData({ demandId: opts.demandId });

  //查询求购
  this.queryDemand();
},
/* ------------------------------
 查询求购数据
 ------------------------------ */
queryDemand: function(){

  helper.request({
    url: 'wx/demand/details',
    data: { demandId: this.data.demandId },
    success: this.bindDemand
  });

},
/* ------------------------------
 绑定求购数据
 ------------------------------ */
bindDemand:function(ret){

  if (ret.demand.expireTime)
    ret.demand.expireTimeStr = helper.d2str(ret.demand.expireTime);

  helper.each(ret.quotes, function (idx, quote) {
    quote.createTimeStr = helper.d2str(quote.createTime);
  });

  ret.demand.skuImgUrlFull = helper.concatFullImgUrl(ret.demand.skuImgUrl);

  this.setData(ret);
},
/* ------------------------------
 预览上传图片
 ------------------------------ */
previewImgClick: function (e) {

  var current = e.target.dataset.id,
      urls = [];

  urls.push(current);

  wx.previewImage({
    current: current,
    urls: urls
  })

}

})