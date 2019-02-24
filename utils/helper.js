/**
 * 帮助类
 * helper.js
 * -----------------------------------
 * 18/03/20 Jerry 新增
 */

(function(){

var
/* ------------------------------
 全局参数
------------------------------ */
__cfg = {
  // 正式版
  host: 'https://www.hecai360.com/',
  // 体验版
  //host: 'https://sandbox2.hecai360.com/',
  // 开发版
  host: 'http://localbox.hecai360.com/',
  host: 'http://localhost/',
  header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
},
/* ------------------------------
 常用页面路径定义
------------------------------ */
__pagePath = {
  // 首页
  index: '/pages/common/index/index',
  // 个人
  login: '/pages/common/userLogin/userLogin',

  userConfig: '/pages/common/userConfig/userConfig',
  userCategoryConfig: '/pages/common/userCategoryConfig/userCategoryConfig',
  userShareModeConfig: '/pages/common/userShareModeConfig/userShareModeConfig',
  userWxPayTypeConfig: '/pages/common/userWxPayTypeConfig/userWxPayTypeConfig',

  userSaleCountAll: '/pages/common/userSaleCountAll/userSaleCountAll',
  userExServiceAll: '/pages/common/userExServiceAll/userExServiceAll',

  msgAll: '/pages/common/msgAll/msgAll',

  pointLogAll: '/pages/finance/pointLogAll/pointLogAll',
  pointRecharge: '/pages/finance/pointRecharge/pointRecharge',

  myCenter: '/pages/my/myCenter/myCenter',
  myCode: '/pages/my/myCode/myCode',
  myCart: '/pages/my/myCart/myCart',
  // SKU
  skuDetail: '/pages/sku/skuDetail/skuDetail',
  skuSearch: '/pages/sku/skuSearch/skuSearch',
  skuCategory: '/pages/sku/skuCategory/skuCategory',
  skuCommentAll: '/pages/sku/skuCommentAll/skuCommentAll',
  skuHowTo: '/pages/sku/skuHowTo/skuHowTo',
  // 品牌
  brandDetail: '/pages/brand/brandDetail/brandDetail',
  // 活动
  activityDetail: '/pages/activity/activityDetail/activityDetail',
  // 订单
  orderAll: '/pages/order/orderAll/orderAll',
  orderConfirm: '/pages/order/orderConfirm/orderConfirm',
  orderPayConfirm: '/pages/order/orderPayConfirm/orderPayConfirm',
  orderPayResult: '/pages/order/orderPayResult/orderPayResult',
  orderDetail: '/pages/order/orderDetail/orderDetail',
  orderTrace: '/pages/order/orderTrace/orderTrace',
  orderComment: '/pages/order/orderComment/orderComment',
  // 发票
  invoiceModify: '/pages/invoice/invoiceModify/invoiceModify',
  // 退换货
  rmaAll: '/pages/rma/rmaAll/rmaAll',
  rmaOrders: '/pages/rma/rmaOrders/rmaOrders',
  rmaModify: '/pages/rma/rmaModify/rmaModify',
  rmaDetail: '/pages/rma/rmaDetail/rmaDetail',
  // 优惠券
  couponAll: '/pages/coupon/couponAll/couponAll',
  // 收货地址
  addressAll: '/pages/address/addressAll/addressAll',
  addressModify: '/pages/address/addressModify/addressModify',
  // 银行卡
  bankcardAll: '/pages/bankcard/bankcardAll/bankcardAll',
  bankcardModify: '/pages/bankcard/bankcardModify/bankcardModify',
  // 提现
  withdrawalAll: '/pages/withdrawal/withdrawalAll/withdrawalAll',
  withdrawalModify: '/pages/withdrawal/withdrawalModify/withdrawalModify',
  withdrawalDetail: '/pages/withdrawal/withdrawalDetail/withdrawalDetail',

//   消息
  message: '/pages/my/message/message'

},
/* ------------------------------
 tab页面定义（用于确认是否使用 switchTab 方式跳转）
------------------------------ */
__tabPath = [ 'myCart', 'myCenter', 'msgAll' ],
/* ------------------------------
 对外接口对象
------------------------------ */
__me = {

/* ------------------------------
 更新导航名称
------------------------------ */
navTitle(title, showLoading){

  // 更新导航标题
  wx.setNavigationBarTitle({ title: title });

  // 显示"正在处理"
  if (showLoading)
    wx.showNavigationBarLoading();

},
/* ------------------------------
 显示或隐藏导航"正在处理"
------------------------------ */
navLoading(showLoading){

  // 显示"正在处理"
  if (showLoading) {
    wx.showNavigationBarLoading();
    return;
  }

  wx.hideNavigationBarLoading();

},
/* ------------------------------
 显示提示
------------------------------ */
showToast(title, icon){
  wx.showToast({ title: title, icon: icon || 'success', mask: true });
},
/* ------------------------------
 隐藏提示
------------------------------ */
hideToast(){
  wx.hideToast();
},
/* ------------------------------
 显示"正在处理"
------------------------------ */
showLoading(title){
  wx.showLoading({ title: title || '加载中', mask: true });
},
/* ------------------------------
 隐藏"正在处理"
------------------------------ */
hideLoading(){
  wx.hideLoading();
},
/* ------------------------------
 返回当前已登录的用户SessionId
------------------------------ */
getSessionId(){
  return wx.getStorageSync('sessionId');
},
/* ------------------------------
 返回当前已登录的用户信息
------------------------------ */
getUser(page){

  var user = wx.getStorageSync('user');

  // 返回值可能是空字符串，所以要强制设为null
  if (!user)
    user = null;

  if (page && typeof page.setData == 'function')
    page.setData({ user: user });

  return user;

},
/* ------------------------------
 更新当前已登录的用户信息
------------------------------ */
setUser(user){
  wx.setStorageSync('user', user);
},
/* ------------------------------
 返回当前已登录的微信用户信息
------------------------------ */
getWxUser(){
  return wx.getStorageSync('wxUser');
},
/* ------------------------------
 存取页面参数
------------------------------ */
pageArg(key, val){

  var globalData = getApp().globalData;

  if (!globalData.pageArg)
    globalData.pageArg = {};

  if ('undefined' == typeof val){

    // 取值
    var val = globalData.pageArg[ key ];
    // 清掉原值
    globalData.pageArg[ key ]  = null;

    // 返回值
    return val;
  }

  // 存值
  globalData.pageArg[ key ] = val;

},
/* ------------------------------
 计算并绑定ScrollViewHeight
------------------------------ */
setScrollViewHeight(page, otherHeight, prop){

  // 默认高度参照 @bar-height 值
  if (undefined == otherHeight)
    otherHeight = 80;

  prop = prop || 'scrollViewHeight';

  wx.getSystemInfo({
    success: function(inf){

      var data = {};
      data[ prop ] = ( ( inf.windowHeight / ( inf.screenWidth / 750 ) ) - otherHeight ) + 'rpx';
      __me.setData(page, data);

    }
  });

},
/* ------------------------------
 page.setData方法安全封装
------------------------------ */
setData(){

  var
  args = arguments,
  page = args[0],
  data,
  isHidden;

  if ( 'string' == typeof args[1] ) {
    data = {};
    data[ args[1] ] = args[2];
    isHidden = args.length >= 4 ? args[3] : null;
  }
  else {
    data = args[1];
    isHidden = args.length >= 3 ? args[2] : null;
  }

  // 如果opts的任意值为 undefined，通过 setData 会报错，所以 undefined 统一设为 null
  for (var key in data) {
    if (typeof data[ key ] == 'undefined')
      data[ key ]  = null;
  }

  // 不能默认 isHidden 为 false，有时会在业务数据查询绑定之前，做了其他数据的绑定
  if (true === isHidden || false === isHidden)
    data.hidden = isHidden ? 'hidden' : '';

  // 调用原生方法
  page.setData(data);

},
/* ------------------------------
 同步页面数据的指定属性
------------------------------ */
setDataProp(page, propNamesString, val, isHidden){

  if (!propNamesString)
    throw 'propNamesString is null';

  var
  localData = page.data,
  propNames = propNamesString.split(/\./);

  // 目前只支持2级
  if (propNames.length != 2)
    throw '只支持2级属性名称';

  localData[ propNames[0] ][ propNames[1] ] = val;

  // 绑定数据
  __me.setData(page, localData, isHidden);

},
/* ------------------------------
 设置页面隐藏/显示
 ------------------------------ */
setHidden(page, isHidden){
  page.setData({ hidden: isHidden ? 'hidden' : '' });
},
/* ------------------------------
 wx.request封装（带Session）
 ------------------------------ */
request(opts){

  // 如果需要向用户确认？
  if (opts.confirm){

    wx.showModal({
      title: '提示',
      content: opts.confirm,
      success: function(ret) {

        if (!ret.confirm)
          return;

        // 用户点击确认，再重新发起请求
        delete opts.confirm;
        __me.request(opts);

      }
    });

    return;
  }

  var
  fullUrl = __cfg.host + opts.url,
  method = opts.method || 'POST',
  sessionId = __me.getSessionId(),
  header = {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    'cookie': 'SOURCE=WECHAT;SESSION_ID=' + sessionId
  };

  // 如果传入了data，要将 data 值为 null 的key去掉，避免传给服务器 'null' 字符串
  if (opts.data)
    for (var dataKey in opts.data){
      if (null == opts.data [ dataKey ])
        delete opts.data [ dataKey ];
    }

  // 导航显示"正在处理"
  if (!opts.ignoreNavLoading)
    __me.navLoading(true);

  // 如果要求显示Toast
  if (opts.loading)
    __me.showLoading(typeof opts.loading == 'string' ? opts.loading : null);

  wx.request({
    url: fullUrl,
    data: opts.data,
    header: header,
    method: method,
    success: function(ret) {

      // 导航隐藏"正在处理"
      if (!opts.ignoreNavLoading)
        __me.navLoading(false);

      // 如果要求显示Toast
      if (opts.loading)
        __me.hideLoading();

      // 业务错误
      if (ret.data && ret.data.errorCode){

        // 报错时，默认都移除可能有的loading提示
        __me.navLoading(false);
        __me.hideLoading();

        if (typeof opts.error == 'function'){
          opts.error(ret.data);
          return;
        }

        wx.showModal({
          title: '提示',
          content: ret.data.errorMsg || '系统出错了',
          showCancel: false
        });
        return;
      }

      // 401：要求登录，跳转到登录页
      if ('401' == ret.statusCode){
        __me.navigateTo('login');
        return;
      }

      // 执行业务回调
      opts.success(ret.data);

    }
  });

},
uploadFile(opts){

  var
  fullUrl = __cfg.host + opts.url,
  // header = {
  //   'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  //   'cookie': 'YNITTC_SOURCE=WECHAT;YNITTC_SESSION_ID=' + __me.getSessionId()
  // };
  header = {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    'cookie': 'SOURCE=WECHAT;SESSION_ID=' + __me.getSessionId()
  };

  wx.uploadFile({
    header: header,
    url: fullUrl,
    filePath: opts.filePath,
    name: opts.name,
    success: function(ret){
      // 执行业务回调
      opts.success(ret.data);
    }
  });

},
/* ------------------------------
 wx.navigateFormat 简单调用
------------------------------ */
navigateFormat(baseUrl, urlArgs, loginRequired){
  __me.navigateTo(__me.formatUrl(baseUrl, urlArgs), loginRequired);
},
/* ------------------------------
 wx.redirectFormat 简单调用
------------------------------ */
redirectFormat(baseUrl, urlArgs, loginRequired){
  __me.redirectTo(__me.formatUrl(baseUrl, urlArgs), loginRequired);
},
/* ------------------------------
 wx.navigateTo 简单调用
------------------------------ */
navigateTo(inf, loginRequired){

  var
  keyOrUrl,
  key,
  url,
  fullUrl,
  type;

  if (typeof inf == 'object'){
    keyOrUrl = inf.url;
    type = inf.type;
  }
  else {
    keyOrUrl = inf;
  }

  // 如果 keyOrUrl 包含 / ，按 fullUrl 处理，否则取 __pagePath 的对应值
  if (!keyOrUrl)
    throw 'keyOrUrl is null';

  if (keyOrUrl.indexOf('/') < 0){

    var
    indexOfQueryString = keyOrUrl.indexOf('?'),
    queryString = null;

    if (indexOfQueryString >= 1) {
      key = keyOrUrl.substr(0, indexOfQueryString);
      // queryString 是带有 ? 前缀的
      queryString = keyOrUrl.substr(indexOfQueryString);
    }
    else {
      key = keyOrUrl;
    }

    url = __pagePath[ key ];

    if (!url)
      throw 'url key match nothing';

    fullUrl = queryString ? url + queryString : url;

    // 根据 url key 确认是否要强制使用 tab 方式跳转
    if (__tabPath.indexOf( key ) >= 0)
      type = 'tab';

  }
  else {

    // 包含 / 的，按 fullUrl 处理
    fullUrl = keyOrUrl;

    // url = fullUrl 去掉 queryString
    url = fullUrl.replace(/\?.+/ig, '');
  }

  // redirect 方式跳转
  if ('redirect' == type){
    wx.redirectTo({ url: fullUrl });
    return;
  }

  // tab 方式跳转
  if ('tab' == type){

    // tab 目前不支持 queryString，所以只传入 url，
    // fullUrl 通过 pageArg 设置
    __me.pageArg[ key ] = fullUrl;

    wx.switchTab({ url: url });
    return;
  }

  // navigate 方式跳转
  wx.navigateTo({ url: fullUrl });

},
/* ------------------------------
 wx.redirectTo 简单调用
------------------------------ */
redirectTo(url, loginRequired){
  __me.navigateTo({ url: url, type: 'redirect' }, loginRequired);
},
/* ------------------------------
 wx.switchTab 简单调用
------------------------------ */
switchTab(url, loginRequired){
  __me.navigateTo({ url: url, type: 'tab' }, loginRequired);
},
/* ------------------------------
 微信注册
------------------------------ */
wxRegister(opts){
  __me.showLoading();
  wx.login({ success: (ret) => __me.afterWxLogin('wx/register', ret.code, opts || {}) });
},
/* ------------------------------
 微信登录
------------------------------ */
wxLogin(opts){
  __me.showLoading();
  wx.login({ success: (ret) => __me.afterWxLogin('wx/login', ret.code, opts || {}) });
},
/* ------------------------------
 业务登录
------------------------------ */
afterWxLogin(url, code, opts){

  var
  // 业务登录用的data
  data = {
    wechatCode: code,
    // 手机号
    mobile: opts.mobile,
    // 短信验证码
    smsCaptcha: opts.smsCaptcha,
    // 推荐会员
    fromUser: opts.fromUser,
    // 场景值
    scene: opts.scene,
    // ShareTicket
    shareTicket: opts.shareTicket
  };

  // 发起请求
  __me.request({
    url: url,
    data: data,
    success: (ret) => {

      // 保存到本地缓存
      wx.setStorageSync('sessionId', ret.token);
      wx.setStorageSync('user', ret.user);

      // 这里要强制将 wxUser 移除，以便后续操作更新 wxUser
      wx.removeStorageSync('wxUser');

      // 尝试获取微信用户信息，如果获取不到，跳转到登录页
      __me.wxGetUserInfo(opts);

    }
  });

},
/* ------------------------------
 尝试获取微信用户信息
------------------------------ */
wxGetUserInfo(opts){

  wx.getSetting({
    success: (settings) => {

      // 未授权获取用户信息，跳转到登录页
      if (!settings.authSetting['scope.userInfo']) {
        __me.navigateTo('login');
        return;
      }

      // 已授权获取用户信息
      wx.getUserInfo({
        withCredentials: true,
        success: (ret) => { __me.wxBindUserInfo(ret, opts) }
      });

    }
  });

},
/* ------------------------------
 同步微信用户信息
------------------------------ */
wxBindUserInfo(e, opts){

  var
  // 微信用户信息
  // 两个渠道：1. wxGetUserInfo；2. login页的按钮Click
  wxUser = e.userInfo || e.detail.userInfo;

  __me.request({
    url: 'wx/my/bind',
    data: { encryptedData: e.encryptedData || e.detail.encryptedData, iv: e.iv || e.detail.iv },
    success: (ret) => {

      // 保存到本地缓存
      wx.setStorageSync('wxUser', wxUser);

      // 如果有回调
      if (opts && 'function' == typeof opts.success){
        opts.success();
        return;
      }

      // 隐藏提示
      __me.hideLoading();

      // 如果来自注册/登录页的按钮Click，返回到上一页
      if (opts.fromButtonClick){
        console.log('wxBindUserInfo.success => fromButtonClick, will navigate back');
        wx.navigateBack();
        return;
      }

      // 其他情况目前不做操作

    }
  });

},
/* ------------------------------
 退出账号
------------------------------ */
logout(opts){

  wx.removeStorageSync('sessionId');
  wx.removeStorageSync('user');
  wx.removeStorageSync('wxUser');

  if (opts && typeof opts.success == 'function')
    opts.success();

},
/* ------------------------------
 尝试扫描二维码登录/注册
------------------------------ */
parseQueryArgs(q){

  // 这里返回空对象
  if (!q)
    return {};

  var
  r = /\b([a-z0-9]+)=([^&]+)/ig,
  m,
  queryOpts = {},
  queryString = decodeURIComponent(q);

  // 解析参数
  while (m = (r.exec(queryString)))
    queryOpts[ m[1] ] = m[2];

  // 打印日志
  console.log('decoded query args from parseQueryArgs ->');
  console.log(queryOpts);

  return queryOpts;

},
/* ------------------------------
 尝试扫描二维码登录/注册
------------------------------ */
tryLoginByQrCode(q, scene){

  var queryOpts = __me.parseQueryArgs(q);

  // r 参数（扫描他人二维码）
  if (queryOpts['r']) {

    // 通过统一的接口处理
    __me.tryLoginByShare({
      query: { r: queryOpts['r'] },
      scene: scene || '',
      shareTicket: ''
    });

    return;
  }

  // t 参数（PC端扫码登录）
  if (queryOpts['t']) {

    wx.showModal({
      title: '提示',
      content: '确认扫码登录合采网？',
      success: function(ret) {

        if (!ret.confirm)
          return;

        __me.request({
          loading: true,
          url: 'wx/scanTempLoginToken',
          data: { tokenKey: queryOpts['t'] },
          success: function() { }
        });

      }
    });

  }

},
/* ------------------------------
 尝试通过分享信息登录/注册
------------------------------ */
tryLoginByShare(opts){

  if (!opts || !opts.query || !opts.query.r)
    return;

  // 判断 r 关键词
  var fromUser = opts.query.r;

  // fromUser 不为空时，尝试 login（附带 fromUser）
  __me.wxLogin({ fromUser: fromUser, scene: opts.scene, shareTicket: opts.shareTicket });

},
/* ------------------------------
 准备支付
------------------------------ */
preparePay(opts){

  __me.request({
    loading: true,
    url: 'wx/pay/prepare',
    data: opts,
    success: ret => __me.payRequest(opts.orderId, opts.payType, ret)
  });

},
/* ------------------------------
 发起实际支付
------------------------------ */
payRequest(orderId, payType, ret){

  // 如果免单，跳转到付款结果页
  if (ret.isFree) {
    __me.paySuccess(orderId);
    return;
  }

  // 如果是积分支付 TODO 1902
  if (payType === 'Point') {
    return;
  }

  // 默认发起微信支付
  ret[ 'success' ]  = ret => __me.paySuccess(orderId);
  ret[ 'fail' ]  = ret => __me.payFail(ret, orderId);

  // 发起支付请求
  wx.requestPayment(ret);

},
/* ------------------------------
 支付成功
------------------------------ */
paySuccess(orderId){

  // 每隔1秒轮询订单付款状态
  __me.payCheck(orderId, 1);

},
/* ------------------------------
 支付失败
------------------------------ */
payCheck(orderId, currentCount){

  var maxTryCount = 10;

  __me.request({
    loading: true,
    url: 'wx/order/checkPaid',
    data: { orderId },
    success: ret => {

      // 已付款，或已超过最大轮询次数，跳转到付款结果页
      if (ret.paid || currentCount > maxTryCount){
        __me.redirectFormat('orderPayResult', { orderId });
        return;
      }

      // 否则继续轮询
      setTimeout( () => __me.payCheck(orderId, currentCount+1), 1000);

    }
  });

},
/* ------------------------------
 支付失败
------------------------------ */
payFail(ret, orderId){

  var msg = ret.errMsg;

  __me.redirectFormat(
    'orderPayResult',
    { orderId: orderId, isCancel: 'requestPayment:fail cancel' == msg ? 'true' : '' });

},
/* ------------------------------
 将手机号中间4位进行星号处理
------------------------------ */
maskMobile(mobile){

  if (!mobile)
    return;

  var m = /(\w+)?(\w{4})(\w{4})/.exec(mobile);
  if (!m)
    return;

  return [m[1] || '', '****', m[3]].join('');

},
/* ------------------------------
 检查是否有效手机号
------------------------------ */
isMobile(val){
  return /^1[345789][0-9]{9}$/ig.test(val);
},
/* ------------------------------
 拼接分页业务数据
------------------------------ */
concatPaging(page, keyForOriData, newData){

  var oriData = page.data[ keyForOriData ];

  // 如果新分页数据的 pageIndex == 1（首页）时，视为重新查询
  // 需要将 oridata 清空（保证对应的view竖向滚动条复位，并正确显示分页加载提示）
  if (newData.pageIndex == 1) {
    oriData = null;
    __me.setData(page, keyForOriData, oriData);
  }

  if (oriData) {

    // 其他情况，如果 oriData 的 pageIndex 大于或者与 newData 的 pageIndex 一致（重复查询），
    // 这时返回 oridata（因为包含了之前已拼接的全部业务数据）
    if (oriData.pageIndex >= newData.pageIndex)
      return oriData;

    // 将新旧数据列表拼在一起
    newData.records = oriData.records.concat(newData.records);

  }

  // 返回 newData
  return newData;
},
/* ------------------------------
 拼接分页业务数据
------------------------------ */
concatPagingData(oriData, newData){

  if (oriData) {

    // 其他情况，如果 oriData 的 pageIndex 大于或者与 newData 的 pageIndex 一致（重复查询），
    // 这时返回 oridata（因为包含了之前已拼接的全部业务数据）
    if (oriData.pageIndex >= newData.pageIndex)
      return oriData;

    // 将新旧数据列表拼在一起
    newData.records = oriData.records.concat(newData.records);

  }

  // 返回 newData
  return newData;
},
/* ------------------------------
 获取下一个分页索引
------------------------------ */
nextPageIndex(existPagingData, isPaging){

  if (isPaging && existPagingData) {

    // 非滚动到底（适用于tab切换，切换后不做处理）或 数据已经全部加载，
    // 不做查询
    if ('scrollend' !== isPaging || !existPagingData.pagingAvailable)
      return -1;

    // 返回已有分页数据的pageIndex（从0索引）
    return existPagingData.pageIndex;

  }

  // 默认返回0
  return 0;
},
/* ------------------------------
 拼接图片完整URL
------------------------------ */
concatFullImgUrl(imgUrl, useHost){

  if (!imgUrl)
    imgUrl = '';

  if (imgUrl.indexOf('https://') == 0 || imgUrl.indexOf('http://') == 0)
    return imgUrl;

  if (imgUrl.indexOf('/') == 0)
    imgUrl = imgUrl.substr(1);

  var host = useHost || !__cfg.imgHost ? __cfg.host : __cfg.imgHost;

  if (host.substr(host.length - 1) == '/')
    return host + imgUrl;

  return host + '/' + imgUrl;

},
/* ------------------------------
 绑定图片完整URL
------------------------------ */
bindFullImgUrl(objs, oriProp, newProp){

  var idx, obj, imgUrl;

  if (!oriProp)
    oriProp = 'imgUrl';

  if (!newProp)
    newProp = 'fullImgUrl';

  for (idx = 0; idx < objs.length; idx++){

    obj = objs[ idx ];
    imgUrl = obj[ oriProp ];

    if (!imgUrl || obj [ newProp ])
      continue;

    obj[ newProp ]  = this.concatFullImgUrl(imgUrl);
  }

  return objs;

},
/* ------------------------------
 获取分享路径
------------------------------ */
getSharePath(page, key, args){

  var
  url = __pagePath[ key ],
  user;

  if (!url)
    throw 'url key match nothing';

  // 取得当前登录用户的信息
  user = page.data.user || __me.getUser(page);

  // 如果没有用户信息，报错
  if (!user)
    throw 'user is null';

  if (!args)
    args = {};

  // 加上当前登录用户的信息
  args[ 'r' ] = user.userId;

  // 拼接完整URL
  url = __me.formatUrl(url, args);

  console.log('final share url => ' + url);

  return url;

},
/* ------------------------------
 Each实现
------------------------------ */
each(array, callback){

  if (!array || typeof array != 'object')
    return;

  if (array.length){

    // 按数组处理
    for (var idx = 0; idx < array.length; idx++){
      if ( false === callback.call(array, idx, array[ idx ]) )
        break;
    }

    return;
  }

  // 按object处理
  for (var key in array){
    if ( false === callback.call(array, key, array[ key ]) )
      break;
  }

},
/* ----------------------------------------
* 拼接URL
* url不能为null
---------------------------------------- */
formatUrl (url, args, opts) {

  if (undefined === url)
    throw 'url为空，formatUrl失败';

  url = url || '';

  if (!args)
    return url;

  // 如果传入的args是字符串，拼接url后直接返回
  if (typeof args == 'string')
    return [url, args.length > 0 && args.indexOf('?') != 0 ? '?' : '', args].join('');

  var b = [], v, m, filter;

  for (var key in args) {

    v = args[key];

    // 如果url已经有key了，则将url的key=v删除
    // 无论v是什么情况
    url = url.replace(new RegExp('([\&]+)?' + key + '=.+?(&|$)', 'i'), '');

    if (null == v)
      continue;

    v = v.toString();
    if (v.length == 0)
      continue;

    if (opts && true === opts.ignoreZero && '0' === v)
      continue;

    b.push(key + '=' + v);
  }

  return b.length == 0
    ? url.replace(/\?$/ig, '')
    : [ url, url.indexOf('?') >= 0 ? '&' : '?', b.join('&') ].join('');

},
/* ------------------------------
 去掉字符串左右两边的空格
------------------------------ */
trim(str){
  return ( str || '' ).replace(/^\s+/ig, '').replace(/\s+$/ig, '');
},
/* ------------------------------
 将日期转为yyyy-MM-dd格式字符串
------------------------------ */
d2str(d, opts){

  d = __me.obj2dt(d);

  if (!d)
    return '';

  if (!opts)
    opts = {};

  var
  year = d.getFullYear(),
  month = d.getMonth() + 1,
  day = d.getDate(),
  buffer = [];

  // 年
  if (!opts.ignoreYear)
    buffer.push([ year, opts.yearEndfix ? '年' : '-' ].join(''));

  // 月
  if (!opts.ignoreMonth)
    buffer.push([ month < 10 ? '0' : '', month, opts.monthEndfix ? '月' : '-' ].join(''));

  // 日
  if (!opts.ignoreDay)
    buffer.push([ day < 10 ? '0' : '', day, opts.dayEndfix ? '日' : '' ].join(''));

  // 星期
  if (opts.showWeek) {

    var
    dayOfWeek = d.getDay(),
    quotes = buffer.length > 0;

    if (quotes)
      buffer.push(' (');

    buffer.push([ '日', '一', '二', '三', '四', '五', '六' ].slice(dayOfWeek, dayOfWeek+1));

    if (quotes)
      buffer.push(')');

  }

  return buffer.join('').replace(/-$/ig, '');

},
/* ----------------------------------------
* 将object转为日期
---------------------------------------- */
obj2dt(obj) {

  if ( !obj || ( 'object' == typeof obj && obj instanceof Date ) )
    return obj;

  if ('number' == typeof obj)
    return new Date(obj);

  // 默认按 string 处理
  var
  d = {},
  mDate = /^([0-9]{4})[\/\-]([0-9]{1,2})[\/\-]([0-9]{1,2})\b/ig.exec(obj),
  mTime = /\b(\d{1,2}):(\d{1,2})(:(\d{1,2}))?(\.(\d{1,3}))?$/ig.exec(obj);

  if (!mDate)
    return null;

  d.year = parseInt(mDate[1]);
  d.month = parseInt(mDate[2]);
  d.day = parseInt(mDate[3]);

  if (mTime) {

    d.hours = parseInt(mTime[1]);
    d.minutes = parseInt(mTime[2]);

    if (mTime.length >= 4)
      d.seconds = parseInt(mTime[3]);

    if (mTime.length >= 5)
      d.ms = parseInt(mTime[4]);

  }

  // month 从0开始，所以减1
  return new Date(d.year, d.month - 1, d.day, d.hours || 0, d.minutes || 0, d.seconds || 0, d.ms || 0);

},
/* ----------------------------------------
* 增减日期
---------------------------------------- */
dtAdd(obj, num, unit) {

  var
  d = __me.obj2dt(obj),
  ret = d ? new Date(d.getTime()) : null;

  if (!ret)
    return ret;

  // 天
  if (!unit || 'day' == unit) {
    ret.setDate( d.getDate() + num );
    return ret;
  }

  // 周
  if ('week' == unit) {
    ret.setDate( d.getDate() + (num * 7) );
    return ret;
  }

  // 月份
  if ('month' == unit) {

    var
    dayN = ret.getDate(),
    // 需要先确认dayN是否月份最后一天
    yearN = ret.getFullYear(),
    monthN = ret.getMonth(),
    isLeapYear = ((yearN % 4 === 0) && (yearN % 100 !== 0)) || (yearN % 400 === 0),
    daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthN],
    isLastDay = dayN == daysInMonth;

    ret.setDate(1);
    ret.setMonth(ret.getMonth() + num);

    // 再确认新日期的相关信息
    yearN = ret.getFullYear();
    monthN = ret.getMonth();
    isLeapYear = ((yearN % 4 === 0) && (yearN % 100 !== 0)) || (yearN % 400 === 0);
    daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthN];

    // 如果原始日期已经是月份最后一天，如：2月29日，4月30日，
    // 则新日期，也需对应到新月份的最后一天，如：3月31日，5月31日
    ret.setDate(isLastDay ? daysInMonth : Math.min(dayN, daysInMonth));
    return ret;
  }

  // 年份
  if ('year' == unit) {

    var
    dayN = ret.getDate(),
    // 需要先确认dayN是否月份最后一天
    yearN = ret.getFullYear(),
    monthN = ret.getMonth(),
    isLeapYear = ((yearN % 4 === 0) && (yearN % 100 !== 0)) || (yearN % 400 === 0),
    daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthN],
    isLastDay = dayN == daysInMonth;

    ret.setDate(1);
    ret.setFullYear(ret.getFullYear() + num);

    // 再确认新日期的相关信息
    yearN = ret.getFullYear();
    monthN = ret.getMonth();
    isLeapYear = ((yearN % 4 === 0) && (yearN % 100 !== 0)) || (yearN % 400 === 0);
    daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthN];

    // 如果原始日期已经是月份最后一天，如：2月29日，4月30日，
    // 则新日期，也需对应到新月份的最后一天，如：3月31日，5月31日
    ret.setDate(isLastDay ? daysInMonth : Math.min(dayN, daysInMonth));
    return ret;
  }

  // 分钟
  if ('minute' == unit) {
    ret.setMinutes(d.getMinutes() + num);
    return ret;
  }

  return ret;

},
/* ------------------------------
 将日期转为yyyy-MM-dd H:mm格式字符串
------------------------------ */
dt2str(d, includeSeconds){

  d = __me.obj2dt(d);

  if (!d) {
    return '';
  }

  var
  year = d.getFullYear(),
  month = d.getMonth() + 1,
  day = d.getDate(),
  hours = d.getHours(),
  minutes = d.getMinutes(),
  seconds = d.getSeconds(),
  str;

  str = [year, '-', month < 10 ? '0' : '', month, '-', day < 10 ? '0' : '', day, ' ', hours < 10 ? '0' : '', hours, ':', minutes < 10 ? '0' : '', minutes].join('');

  if (includeSeconds)
    str += [':', seconds < 10 ? '0' : '', seconds].join('');

  return str;

},
/* ------------------------------
 将秒数转为hh:mm:ss格式字符串
------------------------------ */
seconds2Str(totalSeconds){

  var
    buffer = [],
    days = parseInt( totalSeconds / 86400 ),
    hours = parseInt( ( totalSeconds % 86400 ) / 3600 ),
    minutes = parseInt( ( ( totalSeconds % 86400 ) % 3600 ) / 60 ),
    seconds = parseInt( ( ( totalSeconds % 86400 ) % 3600 ) % 60 );

    // 天（后面带一个空格）
    if (days > 0)
      buffer.push(days + '天 ');

    // 小时
    if (hours < 10)
      buffer.push('0');

    buffer.push(hours + ':');

    // 分
    if (minutes < 10)
      buffer.push('0');

    buffer.push(minutes + ':');

    // 秒
    if (seconds < 10)
      buffer.push('0');

    buffer.push(seconds);

    return buffer.join('');
},
/* ------------------------------
 将日期转为yyyy-MM-dd格式字符串
------------------------------ */
bindD2Str(objs, oriProp, newProp){

  if (!objs || objs.length == 0 || !oriProp)
    return;

  if (!newProp)
    newProp = oriProp + 'String';

  __me.each(objs, function(idx, obj){
    obj[ newProp ] = __me.d2str( obj[ oriProp ] );
  });

},
/* ------------------------------
 将日期转为yyyy-MM-dd H:mm格式字符串
------------------------------ */
bindDt2Str(objs, oriProp, newProp){

  if (!objs || objs.length == 0 || !oriProp)
    return;

  if (!newProp)
    newProp = oriProp + 'String';

  __me.each(objs, function(idx, obj){
    obj[ newProp ] = __me.dt2str( obj[ oriProp ] );
  });

},
/* ------------------------------
 * 返回可读性较强的日期时间字符串。
 * 之后的日期：仅显示日期 MM-dd
 * 后天：显示 后天
 * 明天：显示 明天
 * 今天：显示 今天
 * 昨天：显示 昨天
 * 前天：显示 前天
 * 之前的日期：仅显示日期 MM-dd (不是今年的日期，额外显示年份)
 ------------------------------ */
bindDt2readable(objs, oriProp, newProp){

  if (!objs || objs.length == 0 || !oriProp)
    return;

  if (!newProp)
    newProp = oriProp + 'String';

  __me.each(objs, function(idx, obj){

    // 转为date对象，并获取当前日期，并比较相差天数
    var d = __me.obj2dt(obj[ oriProp ]),
        now = new Date(),
        daysDiff = __me.dateDiff(now, d);

    // 负数，之前的日期；正数，之后的日期；0，当天
    if (daysDiff == 0)
      return obj[ newProp ] = '今天';

    if (daysDiff == -1)
      return obj[ newProp ] = '昨天';

    if (daysDiff == -2)
      return obj[ newProp ] = '前天';

    if (daysDiff == 1)
      return obj[ newProp ] = '明天';

    if (daysDiff == 2)
      return obj[ newProp ] = '后天';

    return obj[ newProp ] = __me.dateToDateString(d, now.getFullYear() == d.getFullYear());

  });

},
/*-------------------------------------
 * 获取2个日期的间隔
 -----------------------------------------*/
dateDiff (d1, d2, unit) {

    if (!d1) throw '传入参数d1转为日期失败';
    if (!d2) throw '传入参数d2转为日期失败';

    //单位转换为天并返回
    unit = unit || 'day';

    if ('month' === unit) {
      return ( d2.getFullYear() * 12 + d2.getMonth() ) - ( d1.getFullYear() * 12 + d1.getMonth() );
    }

    if ('day' === unit) {

      // 清掉时分秒及毫秒
      var tmpD1 = new Date(d1.getTime()), tmpD2 = new Date(d2.getTime());
      tmpD1.setHours(0);
      tmpD1.setMinutes(0);
      tmpD1.setSeconds(0);
      tmpD1.setMilliseconds(0);
      tmpD2.setHours(0);
      tmpD2.setMinutes(0);
      tmpD2.setSeconds(0);
      tmpD2.setMilliseconds(0);

      // 得到以毫秒为单位的差
      return (tmpD2.getTime() - tmpD1.getTime()) / 3600000 / 24;
    }

    if ('hour' === unit) {
      return Math.round((d2.getTime() - d1.getTime()) / 1000 / 60 / 60, 0);
    }

    if ('minute' === unit) {
      return Math.round((d2.getTime() - d1.getTime()) / 1000 / 60, 0);
    }

    if ('second' === unit) {
      return Math.round((d2.getTime() - d1.getTime()) / 1000, 0);
    }

    throw '未支持的日期间隔换算单位 - ' + unit;
},
/* ----------------------------------------
 * 将日期类型解析为字符串(仅日期部分)
 -----------------------------------------*/
dateToDateString (d, noYear) {

  if (!d) return '';

  var year = true === noYear ? '' : d.getFullYear() + '-', month = d.getMonth() + 1, day = d.getDate();
  return [year, month < 10 ? '0' : '', month, '-', day < 10 ? '0' : '', day].join('');
},
/* ----------------------------------------
 * 将以分为单位的金额转为字符串显示
 -----------------------------------------*/
fen2str (val, ignoreZeroAfterDot) {

  if (!val)
    val = 0;

  var valString = '' + val;

  if (valString.length === 1)
    valString = '00' + valString;
  else if (valString.length === 2)
    valString = '0' + valString;

  valString = valString.replace(/([0-9]{2})$/ig, '.$1');

  return ignoreZeroAfterDot === true
    ? valString.replace(/\.00$/ig, '')
    : valString;

}

};

module.exports = __me;

})()
