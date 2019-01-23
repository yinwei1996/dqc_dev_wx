/**
 * SKU分类
 * skuClassify.js
 * -----------------------------------
 * 18/11/08 Jerry 更新
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  types: null,
  curType: null,
  typeImg:'../../../image/classify/wjgj.jpg'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function () {

  helper.setScrollViewHeight(this);
  this.queryTypes();

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function () {
  // 页面显示
},
/* ------------------------------
 处理搜索框Click
 ------------------------------ */
handleSearchClick: function(){
  helper.navigateTo('skuSearch');
},
/* ------------------------------
 查询类型列表
 ------------------------------ */
queryTypes: function () {
  helper.request({ url: 'wx/cat/list', success: this.bindTypes });
},
/* ------------------------------
 绑定显示类型列表
 ------------------------------ */
bindTypes: function (types) {

  var curType = types[0];
  this.setData({ types: types, curType: curType });

  // 查询首个子分类
  this.queryChildTypes();

},
/* ------------------------------
 查询子分类
------------------------------ */
queryChildTypes: function() {

  var
    parentType = this.data.curType.typeId,
    url = helper.formatUrl('wx/cat/list', { withChildren: true, parentType: parentType });

  helper.request({ url: url, success: this.bindChildTypes });
},
/* ------------------------------
 绑定显示子类型列表
 ------------------------------ */
bindChildTypes: function (types) {

  helper.each(types, function(idx, nav){
    helper.bindFullImgUrl(nav.children, 'typeImageUrl', 'fullTypeImageUrl');
  });

  // 先清空子分类绑定，将scroll-view的滚动条重置，再绑定新的子分类
  this.setData({ childTypes: [] });
  this.setData({ childTypes: types });

},
/* ------------------------------
 切换一级分类
------------------------------ */
clickNavItem: function (e) {

  var
    that = this,
    ds = e.currentTarget.dataset,
    newNavItem = this.data.types[ ds.idx ],
    typeName = ds.typeName;

  if (this.data.curType.typeId == ds.typeId)
    return;

  this.setData({ curType: newNavItem });

  // 查询子分类
  this.queryChildTypes();

  // 二级分类title图片按照一级typeName
  if(typeName == "五金工具") {
    that.setData({ typeImg : '../../../image/classify/wjgj.jpg' })
  }
  if(typeName == "工业原料") {
    that.setData({ typeImg : '../../../image/classify/gyyl.jpg' })
  }
  if(typeName == "建材装饰") {
    that.setData({ typeImg : '../../../image/classify/jczs.jpg' })
  }
  if(typeName == "智能安防") {
    that.setData({ typeImg : '../../../image/classify/znaf.jpg' })
  }
  if(typeName == "电工电气") {
    that.setData({ typeImg : '../../../image/classify/dgdq.jpg' })
  }
  if(typeName == "电子元件") {
    that.setData({ typeImg : '../../../image/classify/dzyj.jpg' })
  }
  if(typeName == "照明工业") {
    that.setData({ typeImg : '../../../image/classify/zmgy.jpg' })
  }
  if(typeName == "办公文教") {
    that.setData({ typeImg : '../../../image/classify/bgwj.jpg' })
  }
  if(typeName == "包装用品") {
    that.setData({ typeImg : '../../../image/classify/bzyp.jpg' })
  }
  if(typeName == "劳动保护") {
    that.setData({ typeImg : '../../../image/classify/ldbh.jpg' })
  }
  if(typeName == "农业食材") {
    that.setData({ typeImg : '../../../image/classify/nysc.jpg' })
  }
  if(typeName == "企业服务") {
    that.setData({ typeImg : '../../../image/classify/qyfw.jpg' })
  }

},
/* ------------------------------
 处理链接Click
 ------------------------------ */
clickLnk: function(e){

  var
    ds = e.currentTarget.dataset,
    typeName = ds.typeName;

  if (!typeName)
    return;

    helper.navigateFormat('skuSearch', { keyword: typeName });

}

});