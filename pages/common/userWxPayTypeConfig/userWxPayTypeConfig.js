/**
 * 默认微信支付方式
 * userWxPayTypeConfig
 * -----------------------------------
 * 19/02/21 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  anyToSave: false
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle('默认支付方式');

  // 查询会员详情
  this.queryUser();

},
/* ------------------------------
 查询个人详情
------------------------------ */
queryUser(){
  helper.request({ url: 'wx/my/detail', success: user => this.bindUser(user) });
},
/* ------------------------------
 绑定个人详情
------------------------------ */
bindUser(user){
  this.setData({ user, anyToSave: false });
},
/* ------------------------------
 支付方式变更
------------------------------ */
changePayType(e){

  var key = e.detail.key;
  this.setData({ key, anyToSave: true });
  console.log('userWxPayTypeConfig.changePayType => key: ' + key);

},
/* ------------------------------
 保存支付方式
------------------------------ */
savePayType(){

  var key = this.data.key;

  if (!key) {
    helper.showToast('请选择支付方式', 'none');
    return;
  }

  helper.request({
    loading: true,
    url: 'wx/my/setPayType',
    data: { payType: key },
    success: user => this.bindUser(user)
  });

}

})
