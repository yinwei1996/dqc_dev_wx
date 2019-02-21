/**
 * 转发配置
 * userShareModeConfig
 * -----------------------------------
 * 19/02/21 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 初始数据
------------------------------ */
data: {
  hiddenModeSheet: 'hidden',
  hiddenPriceSheet: 'hidden',
  anyModeToSave: false,
  anyPriceToSave: false,
  modes: [
    { key: 'TextUpPrimary', text: '上文下图一主三副', imageName: 'mode_1_200.png' },
    { key: 'ImageUpPrimary', text: '上图下文一主三从', imageName: 'mode_2_200.png' },
    { key: 'TextUpAverage', text: '上文下图平均分割', imageName: 'mode_3_200.png' },
    { key: 'ImageUpAverage', text: '上图下文平均分割', imageName: 'mode_4_200.png' }
  ],
  prices: [
    { key: '5', text: '+5元' },
    { key: '10', text: '+10元' },
    { key: '15', text: '+15元' }
  ]
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad(opts){

  // 更新导航
  helper.navTitle('转发设置');

  // 查询会员详情
  this.queryUser();

},
/* ------------------------------
 查询个人详情
------------------------------ */
queryUser(){
  helper.request({ url: 'wx/my/detail', success: this.bindUser });
},
/* ------------------------------
 绑定显示个人详情
------------------------------ */
bindUser(user, anyModeToSave, anyPriceToSave){

  var
    args = {
      user: user,
      modes: this.data.modes,
      prices: this.data.prices,
      priceCustom: this.data.priceCustom || ''
    },
    anyPriceSelected = false;

  // 格式化加价金额（以元为单位，所以去掉小数点）
  user.sharePriceString = ('' + (user.sharePrice || '')).replace(/00$/ig, '');

  // 转发模式保存标识
  if (typeof anyModeToSave === 'boolean')
    args.anyModeToSave = anyModeToSave;

  // 转发加价金额保存标识
  if (typeof anyPriceToSave === 'boolean')
    args.anyPriceToSave = anyPriceToSave;

  // 选中的转发模式
  helper.each(args.modes, (idx, mode) => {
    mode.selected = mode.key === user.shareMode;
  });

  // 选中的转发加价金额
  helper.each(args.prices, (idx, price) => {

    if (price.key === user.sharePriceString)
      price.selected = anyPriceSelected = true;
    else
      price.selected = false;

  });

  if (!anyPriceSelected)
    args.priceCustom = user.sharePriceString || '';

  // 绑定数据
  this.setData(args);

},
/* ------------------------------
 显示转发模式Sheet
------------------------------ */
clickMode(){
  this.setData({ hiddenModeSheet: '', hiddenPriceSheet: 'hidden' });
},
/* ------------------------------
 显示转发加价Sheet
------------------------------ */
clickPrice(){
  this.setData({ hiddenModeSheet: 'hidden', hiddenPriceSheet: '' });
},
/* ------------------------------
 隐藏Sheet
------------------------------ */
hideSheet(){
  this.setData({ hiddenModeSheet: 'hidden', hiddenPriceSheet: 'hidden' });
},
/* ------------------------------
 选中/取消选中转发模式
------------------------------ */
clickModeItem(e){

  var
    modes = this.data.modes,
    curKey = e.currentTarget.dataset.key,
    curMode;

  helper.each(modes, (idx, mode) => {

    // 找到对应选中项，其他项则默认取消选中 
    if (curKey === mode.key)
      curMode = mode;
    else
      mode.selected = false;

  });

  // 切换选中状态
  curMode.selected = !curMode.selected;

  // 绑定数据
  this.setData({
    modes: modes,
    modeKey: curMode.selected ? curMode.key : '',
    anyModeToSave: curMode.selected
  });

},
/* ------------------------------
 选中/取消选中转发加价
------------------------------ */
clickPriceItem(e){

  var
    prices = this.data.prices,
    curKey = e.currentTarget.dataset.key,
    curPrice;

  helper.each(prices, (idx, price) => {

    // 找到对应选中项，其他项则默认取消选中 
    if (curKey === price.key)
      curPrice = price;
    else
      price.selected = false;

  });

  // 切换选中状态
  curPrice.selected = !curPrice.selected;

  // 绑定数据
  this.setData({
    prices: prices,
    priceKey: curPrice.selected ? curPrice.key : '',
    priceCustom: '',
    anyPriceToSave: curPrice.selected
  });

},
/* ------------------------------
 输入自定义加价金额
------------------------------ */
inputPriceCustom(e){

  var
    prices = this.data.prices,
    val = e.detail.value;

  // 取消已选中加价项
  helper.each(prices, (idx, price) => { price.selected = false });

  if (val === '') {
    val = '';
  }
  else if ( !/^[0-9]+?$/ig.test(val) || parseInt(val.replace(/\./ig, '')) <= 0 ) {
    // 格式不匹配或小于等于0报错
    val = '';
    helper.showToast('自定义加价金额输入有误', 'none');
  }

  // 绑定数据
  this.setData({
    prices: prices,
    priceKey: '',
    priceCustom: val,
    anyPriceToSave: val
  });

},
/* ------------------------------
 保存转发模式
------------------------------ */
saveMode(){

  var
  that = this,
  modeKey = this.data.modeKey;

  if (!modeKey) {
    helper.showToast('请选择转发模式', 'none');
    return;
  }

  helper.request({
    loading: true,
    url: 'wx/my/setShareMode',
    data: { shareMode: modeKey },
    success: (user) => { that.bindUser(user, false) }
  });

},
/* ------------------------------
 保存转发加价金额
------------------------------ */
savePrice(){

  var
  that = this,
  priceKey = this.data.priceCustom || this.data.priceKey;

  if (!priceKey) {
    helper.showToast('请选择转发加价金额', 'none');
    return;
  }

  helper.request({
    loading: true,
    url: 'wx/my/setSharePrice',
    // sharePrice 客户端是以元为单位，传到服务器以分为单位，所以补00
    data: { sharePrice: priceKey + '00' },
    success: (user) => { that.bindUser(user, null, false) }
  });

}

})
