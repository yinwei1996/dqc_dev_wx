/*
 * 组件 - 一级类目导航
 * skuCategoryNav
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
  categories: { type: Object, observer(newVal) { this.initCategories( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: { }, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化类目列表
  ------------------------------ */
  initCategories(categories) {
    this.setData({ categories });
  },
  /* ------------------------------
   点击类目
   ------------------------------ */
  clickCategory(e){
    helper.navigateFormat('activityAll', { categoryId: e.currentTarget.dataset.categoryId });
  }

}

});
