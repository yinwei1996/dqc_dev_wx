/**
 * 求购中心页
 * demandCenter.less
 * -----------------------------------
 * 18/11/20
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
onLoad: function(opts){

},
/* ------------------------------
 每次页面显示时，刷新数据
------------------------------ */
onShow: function (){

  // 更新导航标题
  helper.navTitle('求购中心');

},
/* ------------------------------
 跳转到"求购信息"
 ------------------------------ */
handleDemandClick: function(){
  helper.navigateTo("myDemandAll","demandCenter")
},
/* ------------------------------
 跳转到"发出的求购报价"
 ------------------------------ */
handleQuoteClick: function(){
  helper.navigateTo("myDemandQuoteAll","demandCenter")
},
/* ------------------------------
 跳转到"发布求购"
 ------------------------------ */
handleModifyClick: function(){
  helper.navigateTo("demandModify","demandCenter")
}

})
