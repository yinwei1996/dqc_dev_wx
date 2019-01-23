/**
 * 会员代理详情
 * userAgentDetail.js
 * -----------------------------------
 * 18/06/09 Jerry 新增
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

  // 更新导航
  helper.navTitle('代理发货人');

  // 绑定数据
  if (opts.agentId)
    this.setData({ agentId: opts.agentId });

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 查询详情
  this.queryAgent();
},
/* ------------------------------
 查询详情
------------------------------ */
queryAgent: function(){

  helper.request({
    url: 'wx/agent/detail',
    data: { agentId: this.data.agentId },
    success: this.bindAgent
  });

},
/* ------------------------------
 绑定显示详情
------------------------------ */
bindAgent: function(ret){
  helper.setData(this, { agent: ret }, false);
},
/* ------------------------------
 取消申请
------------------------------ */
cancel: function(){

  helper.request({
    confirm: '确认结束代理？',
    url: 'wx/agent/cancel',
    data: this.data.agent,
    success: this.bindAgent
  });

},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}

})
