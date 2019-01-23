/**
 * 个人中心
 * myCenter.js
 * -----------------------------------
 * 18/03/14 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  imageUrl4: 'https://sdzs.oss-cn-hangzhou.aliyuncs.com/kj/taobaole2/index1.jpg?Expires=1846566461&OSSAccessKeyId=LTAIoxjpR7pRkyNj&Signature=wkqtU8ZH6JJx2%2BU3OZo0rBr6Qdg%3D',
  imageUrl5: 'https://sdzs.oss-cn-hangzhou.aliyuncs.com/kj/taobaole2/index2.jpg?Expires=1846566490&OSSAccessKeyId=LTAIoxjpR7pRkyNj&Signature=%2B7VOmtA%2BY1ih8JeaIejBir4QwKU%3D',
  imageUrl6: 'https://sdzs.oss-cn-hangzhou.aliyuncs.com/kj/taobaole2/index3.jpg?Expires=1846566583&OSSAccessKeyId=LTAIoxjpR7pRkyNj&Signature=8ybNbsyMDbcSxvYPNGkv2lPsIKE%3D'
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function(){
  // 更新导航
  helper.navTitle('关于合采');
},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function(){

}
});