/*
 * 组件 - 会员关注品类Sheet
 * userCategoryConfigSheet
 * -----------------------------------
 * 19/03/06 Jerry 新增
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
data: { hidden: 'hidden' }, /* data */
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

    if (!this.userCategoryConfigPart)
      this.userCategoryConfigPart = this.selectComponent('#userCategoryConfigPart');

    this.userCategoryConfigPart.query();

  },
  /* ------------------------------
   关闭Sheet
  ------------------------------ */
  closeSheet(){
    this.setData({ hidden: 'hidden' });
    this.triggerEvent('sheetClosed');
  },
  /* ------------------------------
   配置已保存（接收事件）
  ------------------------------ */
  configSaved(){
    // 关闭Sheet
    this.closeSheet();
  }

}

});
