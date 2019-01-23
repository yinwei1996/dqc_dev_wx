/**
 * SKU评价
 * skuCommentAll.js
 * -----------------------------------
 * 18/04/02 Jerry 新增
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
onLoad: function (opts) {

  // 更新导航标题
  helper.navTitle('商品评价');

  // 设置scroll-view高度
  helper.setScrollViewHeight(this);

  // 绑定SKU编号
  this.setData({ skuId: opts.skuId });

  // 查询SKU评价
  this.queryComments();

},
/* ------------------------------
 视图滚动到底部
------------------------------ */
scrollToLower: function(){

  // 分页查询（标识scrollend）
  this.queryComments('scrollend');
},
/* ------------------------------
 查询评价
------------------------------ */
queryComments: function(paging){

  var
  skuId = this.data.skuId,
  existComments = this.data.comments,
  pageIndex = helper.nextPageIndex( existComments, paging );

  if (pageIndex < 0)
    return;

  helper.request({
    url: [ 'wx/sku/comments?skuId=', skuId, '&pageIndex=', pageIndex || 0 ].join(''),
    success: this.bindComments
  });

},
/* ------------------------------
 绑定显示评价
------------------------------ */
bindComments: function(ret){

  var
  recs = ret.comments.records,
  localData = {};

  // 计算星星数
  this.bindStars(recs);

  // 绑定创建时间字符串
  this.bindDateTimeString(recs);

  // 绑定FullImgUrls
  for (var idx = 0; idx < recs.length; idx++){

    if (!recs[ idx ].imgUrls)
      continue;

    recs[ idx ].fullImgUrls = [];

    for (var idx2 = 0; idx2 < recs[ idx ].imgUrls.length; idx2++)
      recs[ idx ].fullImgUrls.push( helper.concatFullImgUrl( recs[ idx ].imgUrls[ idx2 ] ) );

  }

  // 汇总数据只绑定一次
  if (ret.total)
    localData.commentTotal = ret.total;

  // 评价列表
  localData.comments = helper.concatPaging(this, 'comments', ret.comments);

  // 绑定数据
  helper.setData(this, localData, false);

},
/* ------------------------------
 计算星星数
------------------------------ */
bindStars: function(comments){

  for (var idx = 0; idx < comments.length; idx++){

    var
    comment = comments[ idx ],
    starCount = comment.commentVal / 20,
    stars = [];

    for (var starIdx = 0; starIdx < starCount; starIdx++)
      stars.push(true);

    for (var starIdx = 0; starIdx < 5 - stars.length; starIdx++)
      stars.push(false);

    comment.stars = stars;

  }

},
/* ------------------------------
 计算星星数
------------------------------ */
bindDateTimeString: function(comments){

  for (var idx = 0; idx < comments.length; idx++){

    var comment = comments[ idx ];

    if (!comment.createTime)
      continue;

    comments[ idx ].createTimeString = helper.dt2str(comment.createTime);
  }

},
/* ------------------------------
 大图预览
------------------------------ */
commentImagePreview: function(e){

  var url = e.currentTarget.dataset.src;

  if (!url)
    return;

  wx.previewImage({ urls: [ url ] });

}

})
