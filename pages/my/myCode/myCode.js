/**
 * 我的二维码
 * myCode.js
 * -----------------------------------
 * 18/03/28 Jerry 新增
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
onLoad: function(){

  var
  user = helper.getUser(),
  wxUser = helper.getWxUser();

  // 更新导航
  helper.navTitle('我的二维码');

  // 绑定显示用户信息
  this.setData({ user: user, wxUser: wxUser });

  // 查询个人二维码
  this.queryCode();
},
/* ------------------------------
 查询个人二维码 
------------------------------ */
queryCode: function(){

  helper.request({
    url: 'wx/my/qrcode',
    success: this.bindCode
  });

},
/* ------------------------------
 绑定显示个人二维码 
------------------------------ */
bindCode: function(ret){

  helper.setData(this, { codeUrl: ret.url }, false);
},
/* ------------------------------
 保存二维码之前获取授权
------------------------------ */
saveCode: function(){

  wx.authorize({
    scope: 'scope.writePhotosAlbum',
    success: this.saveCodeImpl,
    fail: function(){
      // 保存失败
      wx.showModal({
        title: '提示',
        content: '您未授权云小茗保存图片到系统相册，相关功能暂不可用。',
        showCancel: false,
        confirmText: '知道了'
      });

    }
  });

},
/* ------------------------------
 保存二维码到系统相册
------------------------------ */
saveCodeImpl: function(){

  var codeUrl = this.data.codeUrl;

  // 下载二维码到本地
  wx.downloadFile({
    url: codeUrl,
    success: function(ret){
      // 保存图片到系统相册
      wx.saveImageToPhotosAlbum({
        filePath: ret.tempFilePath,
        success: function(){ wx.showToast({ title: '已保存图片', icon: 'success' }) }
      });
    }
  });

},
/* ------------------------------
 跳转到个人中心 
------------------------------ */
redirectMyCenter: function(){
  helper.redirectTo('myCenter');
},
/* ------------------------------
 显示ActionSheet 
------------------------------ */
showActionSheet: function(){

  wx.showActionSheet({
    itemList: ['保存图片'],
    success: this.handleActionSheetClick
  });

},
/* ------------------------------
 处理地址Click
------------------------------ */
handleActionSheetClick: function(ret){

  var
  tapIndex = ret.tapIndex,
  that = this;

  // 0: 编辑
  if (tapIndex == 0){
    this.saveCode();
    return;
  }

}

})
