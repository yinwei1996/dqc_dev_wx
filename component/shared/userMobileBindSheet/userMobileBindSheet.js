/*
 * 组件 - 会员手机号绑定Sheet
 * userMobileBindSheet
 * -----------------------------------
 * 19/03/07 Jerry 新增
*/

var
helper = require('../../../utils/helper.js');

Component({
options: {
  addGlobalClass: true
},
/* ------------------------------
 组件的属性列表
------------------------------ */
properties: {
  tip: { type: String, observer(newVal) { this.initTip( newVal ) } },
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  hidden: 'hidden',
  anyToSave: false
}, /* data */
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化提示信息
  ------------------------------ */
  initTip(tip) {
    this.setData({ tip });
  },
  /* ------------------------------
   显示Sheet
  ------------------------------ */
  showSheet(){
    this.setData({ hidden: '' });
  },
  /* ------------------------------
   关闭Sheet
  ------------------------------ */
  closeSheet(){
    this.setData({ hidden: 'hidden', anyToSave: false });
    this.triggerEvent('sheetClosed');
  },
  /* ------------------------------
   输入手机号/验证码
  ------------------------------ */
  inputText(e){
    this.setData(e.detail);
    this.setData({ anyToSave: helper.isMobile(this.data.mobile) && /^[0-9a-z]{6}$/ig.test(this.data.captcha) });
  },
  /* ------------------------------
   绑定手机号
  ------------------------------ */
  save(){

    helper.request({
      loading: true,
      url: 'wx/bindMobile',
      data: { mobile: this.data.mobile, smsCaptcha: this.data.captcha },
      success: () => this.closeSheet()
    });

  }

}

});
