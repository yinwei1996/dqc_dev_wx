/**
 * 消息列表
 * msgAll
 * -----------------------------------
 * 19/02/23 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  hiddenSysMsgs: 'hidden',
  hiddenDeliveryMsgs: '',
  hiddenActivityMsgs: 'hidden'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts) {

  // 导航标题
  helper.navTitle('消息');

},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
},
/* ------------------------------
 点击导航
------------------------------ */
clickNav(e){

  var
    curNav = e.currentTarget.dataset.nav,
    args = {
      hiddenSysMsgs: 'hidden',
      hiddenDeliveryMsgs: 'hidden',
      hiddenActivityMsgs: 'hidden'
    };

  if (curNav === 'sysMsgs') {
    args.hiddenSysMsgs = '';
  }
  else if (curNav === 'deliveryMsgs') {
    args.hiddenDeliveryMsgs = '';
  }

  // 绑定数据
  this.setData(args);

  console.log('clickNav =>');
  console.log(args);

}

})
