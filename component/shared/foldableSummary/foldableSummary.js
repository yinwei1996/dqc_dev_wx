/**
 * 可折叠摘要
 * foldableSummary
 * -----------------------------------
 * 19/03/05 Jerry 新增
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
  text: { type: String, observer(newVal) { this.initText( newVal ) } },
  rowCount: { type: Number, observer(newVal) { this.initRowCount( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  // 行高(rpx)，经验值：平均每行高度为 36.25 ~ 38 rpx
  rowHeight: 37,
  rowCount: 5
},
/* ------------------------------
 组件生命周期
------------------------------ */
lifetimes: {

  ready() {

    var query = this.createSelectorQuery();
    query.select('#foldableSummaryText').boundingClientRect(rect => this.refreshFoldable(rect)).exec();

  }

},
/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   初始化摘要文本
  ------------------------------ */
  initText(text){
    this.setData({ text });
  },
  /* ------------------------------
   初始化最大行数
  ------------------------------ */
  initRowCount(rowCount){
    this.setData({ rowCount });
    console.log('initRowCount => ' + this.data.rowCount);
  },
  /* ------------------------------
   刷新折叠状态
  ------------------------------ */
  refreshFoldable(rect){

    if (!rect || !rect.height)
      return;

    wx.getSystemInfo({
      success: inf => {

        // 经验值：平均每行高度为 36.25 ~ 38 rpx

        var
          totalHeight = rect.height * 750 / inf.screenWidth,
          // 四舍五入
          actualRowCount = ( totalHeight / this.data.rowHeight ).toFixed(0);

        console.log('foldableSummary.refreshFoldable => text: ' + this.data.text);
        console.log('foldableSummary.refreshFoldable => totalHeight: ' + totalHeight + 'rpx, actualRowCount: ' + actualRowCount);

        this.setData({ showMore: actualRowCount > this.data.rowCount });

      }
    });

  },
  /* ------------------------------
   显示全文
  ------------------------------ */
  showAll(){
    this.setData({ showAll: true });
  },
  /* ------------------------------
   隐藏全文
  ------------------------------ */
  hideAll(){
    this.setData({ showAll: false });
  }

}

});
