/*
 * 组件 - 会员关注品类设置
 * userCategoryConfigPart
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
data: { anyToSave: false }, /* data */
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
   查询类目列表
  ------------------------------ */
  query() {
    helper.request({
      url: 'wx/cat/list',
      data: { level: 1, includeMapUser: true },
      success: ret => {
        this.refreshCategoryEnabled(ret);
        this.triggerEvent('configQueryDone');
      }
    });
  },
  /* ------------------------------
   选中/取消选中类目
  ------------------------------ */
  clickCategory(e) {

    var
    categories = this.data.categories,
    curCategoryId = e.currentTarget.dataset.categoryId,
    curCategory;

    // 找到当前点击的类目（类目已选中/可用，且ID一致）
    helper.each(categories, (idx, category) => {
      if (( category.userMapped || category.enabled ) && category.categoryId === curCategoryId)
        curCategory = category;
    });

    if (!curCategory)
      return;

    // 切换选中状态
    curCategory.userMapped = !curCategory.userMapped;

    // 绑定数据
    this.refreshCategoryEnabled(categories);

    // 刷新"保存"按钮状态（简单判断）
    this.setData({ anyToSave: true });

  },
  /* ------------------------------
   刷新类目项可选状态
  ------------------------------ */
  refreshCategoryEnabled(categories){

    var
      mapCount = 0,
      enabled;

    // 统计已选中数
    helper.each(categories, (idx, category) => {
      if (category.userMapped)
        mapCount++;
    });

    // 已选中数小于3个，允许继续选中
    enabled = mapCount < 3;

    // 刷新可用状态（排除已选中项）
    helper.each(categories, (idx, category) => {
      if (!category.userMapped)
        category.enabled = enabled;
    });

    // 绑定数据
    this.setData({ categories });

  },
  /* ------------------------------
   保存配置
  ------------------------------ */
  save(){

    var
    categories = this.data.categories,
    categoryIds = [];

    // 找到当前点击的类目（类目已选中/可用，且ID一致）
    helper.each(categories, (idx, category) => {
      if (category.userMapped)
        categoryIds.push(category.categoryId);
    });

    helper.request({
      loading: true,
      url: 'wx/my/cat/save',
      data: { categoryIds: categoryIds.join(',') },
      success: () => {
        // 刷新标志
        this.setData({ anyToSave: false });
        // 触发事件
        this.triggerEvent('configSaved');
      }
    });

  }


}

});
