/*
 * 组件 - 支付方式选择区域
 * payTypesArea
 * -----------------------------------
 * 19/02/23 Jerry 新增
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
  checked: { type: String, observer(newVal) { this.clickType( newVal ) } },
  disablePoint: { type: Boolean, observer(newVal) { this.disablePoint( newVal ) } }
}, /* properties */

/* ------------------------------
 组件的初始数据
------------------------------ */
data: {
  payTypes: [
    { key: 'WechatPay', text: '微信支付', icoName: 'wx_pay_81.png' },
    { key: 'Point', text: '积分支付', icoName: 'point_81.png' }
  ]
}, /* data */

/* ------------------------------
 组件的方法列表
------------------------------ */
methods: {

  /* ------------------------------
   选中付款方式
  ------------------------------ */
  disablePoint(disabled){

    console.log('disabled => ' + disabled);

    var
      payTypes = this.data.payTypes;

    helper.each(payTypes, (idx, type) => {
      if (type.key === 'Point')
        type.disabled= disabled === true;
    });

    this.setData({ payTypes });

  },
  /* ------------------------------
   选中付款方式
  ------------------------------ */
  clickType(e){

    var
      isClick = typeof e.currentTarget === 'object',
      payTypes = this.data.payTypes,
      curKey = isClick ? e.currentTarget.dataset.key : e,
      curType;

    helper.each(payTypes, (idx, payType) => {

      // 找到对应选中项，其他项取消选中 
      if (curKey === payType.key)
        curType = payType;
      else
        payType.selected = false;

    });

    // 已选中的不做处理
    if (curType.selected)
      return;

    // 切换选中状态
    curType.selected = !curType.selected;

    // 绑定数据
    this.setData({
      payTypes,
      key: curType.selected ? curType.key : ''
    });

    // 来自Click时，触发事件
    if (isClick)
      this.triggerEvent('change', { key: this.data.key });

  }

}

});
