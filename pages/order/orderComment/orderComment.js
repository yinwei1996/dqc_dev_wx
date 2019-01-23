/**
 * 订单评价
 * orderComment.js
 * -----------------------------------
 * 18/04/09 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: { hidden: 'hidden' },
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(opts) {

  // 更新导航标题
  helper.navTitle('评价晒单');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 绑定订单编号
  this.setData({ orderId: opts.orderId });

  // 查询评价
  this.queryComments();

},
/* ------------------------------
 查询评价
------------------------------ */
queryComments: function(){

  helper.request({
    url: 'wx/order/comment/list',
    data: { orderId: this.data.orderId },
    success: this.bindComments
  });

},
/* ------------------------------
 绑定显示评价
------------------------------ */
bindComments: function(ret){

  // 字典形式处理
  var maps = { };

  helper.each(ret, function(idx, map){

    // 拼接SKU完整URL
    map.fullImgUrl = helper.concatFullImgUrl(map.imgUrl);

    // 拼接评价图片完整URL
    map.comment.fullImgUrls = {};
    map.comment.fullImgUrlsCount = 0;

    helper.each(map.comment.imgUrls, function(idx, imgUrl){
      map.comment.fullImgUrls[ idx ] = { idx: idx, url: helper.concatFullImgUrl(imgUrl, true) };
      map.comment.fullImgUrlsCount += 1;
    });

    // 评价时间
    if (map.comment.createTime)
      map.comment.createTimeString = helper.dt2str(map.comment.createTime);

    maps[ map.sysNo ] = map;
  });

  helper.setData(this, { maps: maps }, false);
},
/* ------------------------------
 保存评价
------------------------------ */
saveComment: function(sysNo){

  var
  maps = this.data.maps,
  map = maps[ sysNo ],
  comment = map.comment,
  imgIds = [];

  // 将 comment.fullImgUrls.fileId 拼接到 comment.imgIds（逗号分隔字符串）
  helper.each(comment.fullImgUrls, function(idx, item){
    imgIds.push(item.fileId);
  });

  comment.imgIds = imgIds.join(',');

  helper.request({
    url: 'wx/order/comment/add',
    data: comment,
    success: this.bindComments
  });

},
/* ------------------------------
 同步评价星级
------------------------------ */
inputCommentVal: function(sysNo, action){

  var
  maps = this.data.maps,
  map = maps[ sysNo ],
  val = null;

  if ('star1' == action)
    val = 20;
  else if ('star2' == action)
    val = 40;
  else if ('star3' == action)
    val = 60;
  else if ('star4' == action)
    val = 80;
  else if ('star5' == action)
    val = 100;

  if (!val)
    return;

  map.comment.commentVal = val;
  this.setData({ maps: maps });
},
/* ------------------------------
 同步评价内容
------------------------------ */
inputCommentMemo: function(e){

  var
  sysNo = e.currentTarget.dataset.no,
  maps = this.data.maps,
  map = maps[ sysNo ];

  map.comment.commentMemo = e.detail.value;
  this.setData({ maps: maps });
},
/* ------------------------------
 处理评价Click
------------------------------ */
clickMap: function(e){

  var
  sysNo = e.currentTarget.dataset.no,
  readonly = e.currentTarget.dataset.readonly,
  action = e.target.dataset.action,
  idx = e.target.dataset.idx;

  // 选择星级
  if (!readonly && [ 'star1', 'star2', 'star3', 'star4', 'star5' ].indexOf(action) >= 0){
    this.inputCommentVal(sysNo, action);
    return;
  }

  // 选择图片
  if (!readonly && 'chooseImages' == action){
    this.chooseImages(sysNo);
    return;
  }

  // 显示图片操作菜单
  if ('showImageOps' == action){
    this.showImageOps(sysNo, idx, readonly);
    return;
  }

  // 保存评论
  if (!readonly && 'save' == action){
    this.saveComment(sysNo);
    return;
  }

}, 
/* ------------------------------
 选择图片
------------------------------ */
chooseImages: function(sysNo){

  var
  that = this,
  map = this.data.maps[ sysNo ];

  wx.chooseImage({
    // 最多传5张图片
    count: 5 - map.comment.fullImgUrlsCount || 0,
    // 压缩图
    sizeType: [ 'compressed' ],
    success: function(ret) { that.bindImages(ret, sysNo) }
  });

},
/* ------------------------------
 绑定显示临时图片
------------------------------ */
bindImages: function(ret, sysNo){

  var
  maps = this.data.maps,
  map = maps[ sysNo ];

  // 初始化 sysNo 到 comment
  if (!map.comment)
    map.comment = { sysNo: sysNo };

  // 先显示带loading图片（object形式，按key寻找）
  if (!map.comment.fullImgUrls) {
    map.comment.fullImgUrls = {};
    map.comment.fullImgUrlsCount = 0;
  }

  helper.each(ret.tempFilePaths, function(idx, tempFilePath){
    map.comment.fullImgUrls[ idx ] = { idx: idx, fileId: null, isTemp: true, url: tempFilePath };
    map.comment.fullImgUrlsCount += 1;
  });

  // 绑定显示临时图片
  this.setData({ maps: maps });

  // 串联上传图片
  this.uploadImages(sysNo, ret.tempFilePaths);

},
/* ------------------------------
 上传图片
------------------------------ */
uploadImages: function(sysNo, tempFilePaths){

  if (!tempFilePaths || tempFilePaths.length == 0)
    return;

  var
  that = this,
  tempFilePath = tempFilePaths.shift();

    helper.uploadFile({
      url: 'wx//order/comment/upload',
      filePath: tempFilePath,
      name: tempFilePath,
      success: function(ret){
        // 更新标记
        that.replaceTempImage(sysNo, tempFilePath, ret);
        // 继续上传图片
        that.uploadImages(sysNo, tempFilePaths);
      }
    });

},
replaceTempImage: function(sysNo, tempUrl, newUrls){

  // newUrls 被解析成 ""xxxx"" ？需要去掉开头和结尾的 "
  newUrls = newUrls.replace(/^"/ig, '').replace(/"$/ig, '');

  var
  maps = this.data.maps,
  map = maps[ sysNo ],
  idx = newUrls.indexOf('|'),
  fileId = newUrls.substr(0, idx),
  imgUrl = newUrls.substr(idx + 1);

  helper.each(map.comment.fullImgUrls, function(idx, item){

    if (item.url == tempUrl){
      // idx 不变，用于操作定位
      item.fileId = fileId;
      // 更新 isTemp 标志位
      item.isTemp = false;
      return false;
    }

  });

  this.setData({ maps: maps });

},
/* ------------------------------
 显示图片操作菜单
------------------------------ */
showImageOps: function(sysNo, idx, readonly){

  var that = this;

  // 如果是只读，直接显示图片预览
  if (readonly){
    that.handleImageOps(0, sysNo, idx);
    return;
  }

  // 否则显示ActionSheet
  wx.showActionSheet({
    itemList: [ '显示大图', '删除图片' ],
    success: function(ret) {
      that.handleImageOps(ret.tapIndex, sysNo, idx);
    }
  });

},/* ------------------------------
 处理图片操作菜单Click
------------------------------ */
handleImageOps: function(tapIndex, sysNo, idx){

  var
  maps = this.data.maps,
  map = maps[ sysNo ];

  // 0: 编辑
  if (tapIndex == 0){
    wx.previewImage({ urls: [ map.comment.fullImgUrls[ idx ].url ] });
    return;
  }

  // 1: 删除
  if (tapIndex == 1){

    // 删除属性
    delete map.comment.fullImgUrls[ idx ];
    // 更新图片数
    map.comment.fullImgUrlsCount -= 1;
    // 绑定数据
    this.setData({ maps: maps });
    return;
  }

}

})
