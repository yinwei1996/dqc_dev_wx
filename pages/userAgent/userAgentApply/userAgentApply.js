/**
 * 会员代理申请
 * userAgentApply.js
 * -----------------------------------
 * 18/06/07 Jerry 新增
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
  helper.navTitle('申请成为代理发货人');

  // 查询数据
  this.prepare(helper.parseQueryArgs(opts.q));
},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

  // 清除遗留的timeout
  if (this.data.lastTimeout)
    clearTimeout(this.data.lastTimeout);

},
/* ------------------------------
 查询数据
------------------------------ */
prepare: function(args){

/*
  if (!args || !args.type || !args.u) {

    args = {
      type: "PartnerDelivery",
      u: "4cbfb637768546baabf20ea1cd8536c2"
    };

  }
*/

  helper.request({
    url: 'wx/agent/prepare',
    data: { type: args.type, userId: args.u },
    success: this.bind,
    error: this.error
  });

},
/* ------------------------------
 绑定显示数据
------------------------------ */
bind: function(ret){
  helper.setData(this, { agent: ret }, false);
},
/* ------------------------------
 提交申请
------------------------------ */
add: function(){

  helper.request({
    url: 'wx/agent/add',
    data: this.data.agent,
    success: this.bindApproveStatus,
    error: this.error
  });

},
/* ------------------------------
 取消申请
------------------------------ */
cancel: function(){

  helper.request({
    confirm: '确认取消申请？',
    url: 'wx/agent/cancel',
    data: this.data.agentId,
    success: this.bindApproveStatus
  });

},
/* ------------------------------
 处理业务错误
------------------------------ */
error: function(ret){

  wx.showModal({
    title: '提示',
    content: ret.errorMsg,
    showCancel: false,
    success: function(confirm){
      if (confirm)
        helper.switchTab('index');
    }
  });

},
/* ------------------------------
 轮询申请审核状态
------------------------------ */
queryApproveStatus: function(){

  helper.request({
    ignoreNavLoading: true,
    url: 'wx/agent/recentApprove',
    data: { agentId: this.data.agentId },
    success: this.bindApproveStatus
  });

},
/* ------------------------------
 绑定显示审核状态
------------------------------ */
bindApproveStatus: function(agent){

  // 除"等待审核"以外，其他都跳转到代理详情页
  if ('WaitingApprove' != agent.approveStatus){
    helper.redirectFormat('userAgentDetail', { agentId: this.data.agentId });
    return;
  }

  // 其他情况，继续轮询（不设次数）
  this.setData({
    agentId: agent.agentId,
    approveStatus: agent.approveStatus,
    approveExpireMinutes: agent.approveExpireMinutes,
    lastTimeout: setTimeout(this.queryApproveStatus, 1500)
  });

},
/* ------------------------------
 跳转到个人中心
------------------------------ */
redirectMyCenter: function(){
  helper.switchTab('myCenter');
}

})
