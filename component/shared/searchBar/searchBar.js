/*
 * 组件 - 搜索栏
 * searchBar
 * -----------------------------------
 * 19/02/27 Jerry 新增
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
  readonly: { type: Boolean, observer(newVal) { this.initReadonly( newVal ) } },
  keyword: { type: String, observer(newVal) { this.initKeyword( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  hiddenHistory: 'hidden'
}, /* data */
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化只读标识
  ------------------------------ */
  initReadonly(readonly) {
    this.setData({ readonly });
  },
  /* ------------------------------
   初始化关键词
  ------------------------------ */
  initKeyword(keyword) {
    this.setData({ keyword, hiddenHistory: !keyword ? '' : 'hidden' });
  },
  /* ------------------------------
   点击搜索框（只读模式时）
  ------------------------------ */
  clickBar(e){
    this.triggerEvent('clickSearchBar');
  },
  /* ------------------------------
   确认是否显示"清除关键词"图标
  ------------------------------ */
  searchInput(e){
    this.setData({ keyword: e.detail.value });
  },
  /* ------------------------------
   输入框聚焦时，绑定显示搜索历史
  ------------------------------ */
  searchFocus(){

    var keyword = this.data.keyword;

    if (keyword)
      return;

    this.setData({
      histories: wx.getStorageSync('searchHistory') || [],
      hiddenHistory: ''
    });

  },
  /* ------------------------------
   清除输入的关键词
  ------------------------------ */
  searchClear(){

    this.setData({
      keyword: '',
      hiddenHistory: ''
    });

  },
  /* ------------------------------
   确认搜索
  ------------------------------ */
  searchConfirm(){

    var keyword = this.data.keyword;

    if (!keyword)
      return;

    // 更新本地搜索历史
    this.refreshHistories(keyword);

    // 隐藏历史搜索关键词浮动层
    this.setData({ hiddenHistory: 'hidden' });

    // 触发 confirm 事件
    this.triggerEvent('confirm', { keyword });

  },
  /* ------------------------------
   返回首页
  ------------------------------ */
  searchCancel(){
    this.triggerEvent('cancel');
    helper.switchTab('index');
  },
  /* ------------------------------
   点击历史关键词
  ------------------------------ */
  clickHistory: function(e){

    var keyword = e.target.dataset.keyword;

    // 绑定数据
    this.setData({ keyword });
    // 确认搜索
    this.searchConfirm();

  },
  /* ------------------------------
   清空本地搜索历史
  ------------------------------ */
  clearHistory: function(){

    wx.removeStorageSync('searchHistory');
    this.setData({ histories: [], hiddenHistory: '' });

  },
  /* ------------------------------
   刷新本地搜索历史
  ------------------------------ */
  refreshHistories: function(keyword){

    if (!keyword)
      return;

    var
    histories = wx.getStorageSync('searchHistory') || [],
    idx;

    for (idx = 0; idx < histories.length; idx++){

      if (histories[idx] != keyword)
        continue;

      histories.splice(idx, 1);
      break;

    }

    histories.unshift(keyword);

    // 将更新的数据保存到本地存储
    wx.setStorageSync('searchHistory', histories);

  }


}

});
