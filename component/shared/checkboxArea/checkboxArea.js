/*
 * 组件 - CheckBox区域
 * smsCaptchaArea
 * -----------------------------------
 * 19/02/21 Jerry 新增
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
checked: { type: Boolean, observer(newVal) { this.initChecked( newVal ) } },
label: { type: String, observer(newVal) { this.initLabel( newVal ) } },
text: { type: String, observer(newVal) { this.initText( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  isChecked: false
}, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化勾选状态
  ------------------------------ */
  initChecked(checked) {
    this.setData({ isChecked: checked === true || checked === 'true' });
  },
  /* ------------------------------
   初始化标签
  ------------------------------ */
  initLabel(label) {
    this.setData({ label: label });
  },
  /* ------------------------------
   初始化文本
  ------------------------------ */
  initText(text) {
    this.setData({ text: text });
  },
  /* ------------------------------
   切换勾选状态
  ------------------------------ */
  changeStatus(){

    var args = { isChecked: !this.data.isChecked };

    // 绑定数据
    this.setData(args);
    // 触发事件
    this.triggerEvent('change', args);
  }

}

});
