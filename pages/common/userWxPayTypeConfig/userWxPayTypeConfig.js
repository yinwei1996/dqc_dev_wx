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
  anyToSave: false,
  payTypes: [
    { key: 'WechatPay', text: '微信支付', icoName: 'wx_pay_81.png' },
    { key: 'Point', text: '积分支付', icoName: 'point_81.png' }
  ]
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
  helper.request({ url: 'wx/my/detail', success: this.bindUser });
},
/* ------------------------------
 绑定显示个人详情
------------------------------ */
bindUser(user){

  var
    args = {
      user: user,
      payTypes: this.data.payTypes,
      anyToSave: false
    };

  // 选中的付款方式
  helper.each(args.payTypes, (idx, payType) => {
    payType.selected = payType.key === user.wxPayType;
  });

  // 绑定数据
  this.setData(args);

},
/* ------------------------------
 选中付款方式
------------------------------ */
clickPayType(e){

  var
    payTypes = this.data.payTypes,
    curKey = e.currentTarget.dataset.key,
    curPayType;

  helper.each(payTypes, (idx, payType) => {

    // 找到对应选中项，其他项则默认取消选中 
    if (curKey === payType.key)
      curPayType = payType;
    else
      payType.selected = false;

  });

  // 已选中的不做处理
  if (curPayType.selected)
    return;

  // 切换选中状态
  curPayType.selected = !curPayType.selected;

  // 绑定数据
  this.setData({
    payTypes: payTypes,
    payTypeKey: curPayType.selected ? curPayType.key : '',
    anyToSave: curPayType.selected
  });

},
/* ------------------------------
 保存支付方式
------------------------------ */
savePayType(){

  var
  that = this,
  payTypeKey = this.data.payTypeKey;

  if (!payTypeKey) {
    helper.showToast('请选择支付方式', 'none');
    return;
  }

  helper.request({
    loading: true,
    url: 'wx/my/setPayType',
    data: { payType: payTypeKey },
    success: (user) => { that.bindUser(user) }
  });

}

})
