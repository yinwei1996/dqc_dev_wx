/**
 * 全局处理 some test
 * app.js
 * -----------------------------------
 * 18/03/20 Jerry 新增
 */

App({

/* ------------------------------
 全局参数（留空，不能删）
------------------------------ */
globalData: {},
/* ------------------------------
 APP初始化
------------------------------ */
onLaunch: function(opts){

    console.log('onLaunch ->');
    console.log(opts);

  // 尝试解析参数，处理用户推荐注册
  if (opts && opts.query) {

    if (opts.query.q)
      require('utils/helper.js').tryLoginByQrCode(opts.query.q, opts.scene);
    else if (opts.query.r)
      require('utils/helper.js').tryLoginByShare(opts);

  }

}

})