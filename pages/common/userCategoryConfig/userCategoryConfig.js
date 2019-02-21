/**
 * 关注品类设置
 * userCategoryConfig
 * -----------------------------------
 * 19/02/21 Jerry 更新
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
onLoad(opts) {

  // 更新导航
  helper.navTitle('关注品类设置');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this, 220);

},
/* ------------------------------
 页面显示
------------------------------ */
onShow() {
  // 查询类目列表
  this.queryCategories();
},
/* ------------------------------
 查询类目列表
------------------------------ */
queryCategories() {
  helper.request({ url: 'wx/cat/list', data: { level: 1, includeMapUser: true }, success: this.refreshCategoryEnabled });
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
  helper.each(categories, function(idx, category){
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
  helper.each(categories, function(idx, category){

    if (category.userMapped)
      mapCount++;

  });

  // 已选中数小于3个，允许继续选中
  enabled = mapCount < 3;

  // 刷新可用状态（排除已选中项）
  helper.each(categories, function(idx, category){

    if (!category.userMapped)
      category.enabled = enabled;

  });

  // 绑定数据
  this.setData({ categories: categories });

},
/* ------------------------------
 保存配置
------------------------------ */
saveConfig(){

  var
  that = this,
  categories = this.data.categories,
  categoryIds = [];

  // 找到当前点击的类目（类目已选中/可用，且ID一致）
  helper.each(categories, function(idx, category){
    if (category.userMapped)
      categoryIds.push(category.categoryId);
  });

  helper.request({
    loading: true,
    url: 'wx/my/cat/save',
    data: { categoryIds: categoryIds.join(',') },
    success: () => { that.setData({ anyToSave: false }) }
  });

}

})
