/**
 * 求购详情页
 * myDemandDetail.js
 * -----------------------------------
 * 18/11/15
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {hidden: 'hidden'},
/* ------------------------------
 页面加载
 ------------------------------ */
onLoad: function(opts){

  // 更新导航标题
  helper.navTitle('求购信息');

  var demandId = opts.demandId;

  // 绑定求购id
  this.setData({demandId: demandId});

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 查询采购单数据
  this.queryDemandQuote();

},
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow: function (){

},
/* ------------------------------
 查询采购单数据
 ------------------------------ */
queryDemandQuote: function() {

  helper.request({
    url: 'wx/demand/myDetail',
    data: { demandId: this.data.demandId },
    success: this.bindDemand
  });
},
/* ------------------------------
 绑定数据
 ------------------------------ */
bindDemand: function(ret){

  // 截至时间 装换
  helper.bindD2Str(ret, 'expireTime');
  helper.bindD2Str(ret, 'createTime');
  helper.bindD2Str(ret.quotes, 'createTime');

  // 绑定SKU图片完整URL
  ret.demand.skuImgUrlFull = helper.concatFullImgUrl(ret.demand.skuImgUrl);
  helper.bindFullImgUrl(ret.quotes, 'skuImgUrl');

  this.setData({ demand: ret.demand, quotes: ret.quotes })
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

},
/* ------------------------------
 阅读报价单
 ------------------------------ */
readQuoteClick: function (e) {

  var that = this;

  helper.request({
    url: 'wx/demand/quote/doRead',
    data: { quoteId: e.currentTarget.dataset.id },
    success: function(ret){
      console.log(ret);
      // 刷新页面
      that.queryDemandQuote();
    }
  });

},
/* ------------------------------
 商品上架
 ------------------------------ */
upLineClick: function (e) {
  console.log(e)
  var
      that = this,
      demandId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认上架吗!' ].join(''),
    url: '/wx/demand/upLine',
    data: { demandId: demandId },
    success: function(ret){
      // 刷新页面
      that.onShow();
    }
  });

},
/* ------------------------------
 商品下架
 ------------------------------ */
downLineClick: function (e) {

  var
      that = this,
      demandId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认下架吗!' ].join(''),
    url: '/wx/demand/downLine',
    data: { demandId: demandId },
    success: function(){

      // 查询采购单数据
      that.queryDemandQuote();
    }
  });

},
/* ------------------------------
 确认合作
 ------------------------------ */
receiveDoneClick: function (e) {

  var
      that = this,
      quoteId = e.target.dataset.id;

  helper.request({
    confirm: [ '确认合作吗!' ].join(''),
    url: '/wx/demand/quote/receiveDone',
    data: { quoteId: quoteId },
    success: function(){

      // 查询采购单数据
      that.queryDemandQuote();
    }
  });

}


})
