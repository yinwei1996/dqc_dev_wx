/**
 * SKU如何冲泡
 * skuHowTo.js
 * -----------------------------------
 * 18/05/21 Jerry 新增
 */

var
helper = require('../../../utils/helper.js');

Page({

/* ------------------------------
 页面数据
------------------------------ */
data: {
  steps: [
    { text: '取小饼 1 片' },
    { text: '95℃ 热水 330ml' },
    { text: '冲泡 5-7 次' }
  ],
  loops: [
    // 第一泡30S
    { idx: 1, seconds: 0, text: '取小饼一片' },
    { idx: 1, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 1, seconds: 30 },
    // 第二泡45S
    { idx: 2, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 2, seconds: 45 },
    // 第三泡60S
    { idx: 3, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 3, seconds: 60 },
    // 第四泡3min
    { idx: 4, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 4, seconds: 180 },
    // 第五泡6min
    { idx: 5, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 5, seconds: 360 },
    // 第六泡9min
    { idx: 6, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 6, seconds: 540 },
    // 第七泡15min
    { idx: 7, seconds: 0, text: '注入热水', tip: '95℃，330ml' },
    { idx: 7, seconds: 900 }
  ],
  currentLoopIndex: 0
},
/* ------------------------------
 页面加载
------------------------------ */
onLoad: function () {

  // 更新导航
  helper.navTitle('如何冲泡云小茗');

  // 先绘制圆形背景
  this.drawProgressbg();

},
/* ------------------------------
 页面显示
------------------------------ */
onShow: function () {

},
/* ------------------------------
 取消倒计时
------------------------------ */
cancelCountdown: function(){

  if (this.data.lastTipTimeout)
    clearTimeout(this.data.lastTipTimeout);

  if (this.data.lastCircleTimeout)
    clearTimeout(this.data.lastCircleTimeout);

  this.setData({ lastTipTimeout: null, lastCircleTimeout: null, currentSeconds: 0 });

  this.clearCircle();

},
/* ------------------------------
 重置
------------------------------ */
reset: function(){

  this.setData({ currentLoopIndex: 0, buttonText: null });

},
/* ------------------------------
 继续下一循环
------------------------------ */
continueLoop: function(){

  var
  loops = this.data.loops,
  currentIndex = this.data.currentLoopIndex,
  nextLoopIndex = currentIndex + 1,
  currentLoop = loops[ currentIndex ],
  nextLoop = nextLoopIndex < loops.length ? loops[ nextLoopIndex ] : null;

  if (!nextLoop) {
    this.setData({ buttonText: '冲泡结束', currentSeconds: 0 });
    return;
  }

  // 没有倒计时，显示下一步的文字
  if (!nextLoop.seconds) {
    this.setData({ buttonText: nextLoop.text, currentLoopIndex: nextLoopIndex });
    return;
  }

  // 有倒计时，显示timer动画
  this.countdown(nextLoopIndex, nextLoop.seconds, nextLoop.seconds);

},
/* ------------------------------
 倒计时
------------------------------ */
countdown: function(loopIndex, totalSeconds, currentSeconds){

  // 秒数小于等于0
  if (currentSeconds <= 0) {
    // 暂停，等待用户按下按钮
    this.setData({
      currentSeconds: 0,
      currentLoopIndex: loopIndex,
      buttonText: loopIndex < this.data.loops.length - 1 ? ['第', this.data.loops[loopIndex].idx, '次冲泡完成'].join('') : '冲泡结束'
    });
    // 设备震动
    wx.vibrateLong({ });
    return;
  }

  var
  that = this,
  step = ( totalSeconds - currentSeconds ) / totalSeconds * 2;

  //console.log(['totalSeconds =>', totalSeconds, ', currentSeconds =>', currentSeconds, ', step =>', step].join(''));

  that.drawCircle(step);

  // 秒数大于0，设置下一次倒计时
  this.setData({
    currentSeconds: Math.ceil(currentSeconds),
    lastTipTimeout: setTimeout(function(){ that.countdown(loopIndex, totalSeconds, currentSeconds - 1 / 20) }, 50)
  });

},
drawProgressbg: function(withFill){

  // 使用 wx.createContext 获取绘图上下文 context
  var ctx = wx.createCanvasContext('canvasTimerBg');
  // 设置圆环的宽度
  ctx.setLineWidth(9);
  // 设置圆环的颜色
  // 设置圆环端点的形状
  ctx.setLineCap('round');
  //开始一个新的路径
  ctx.beginPath();
  //设置一个原点(110,110)，半径为100的圆的路径到当前路径
  ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);

  //对当前路径进行描边或填充
  if (withFill){
    ctx.setFillStyle('#809253');
    ctx.fill();
  }
  else {
    ctx.setStrokeStyle('#f9f9f9');
    ctx.stroke();
  }

  ctx.draw();

},
drawCircle: function (step){

  var ctx = wx.createCanvasContext('canvasTimerVal');
  // 设置渐变
  var gradient = ctx.createLinearGradient(200, 100, 100, 200);
  gradient.addColorStop('0', '#809253');
  gradient.addColorStop('0.5', '#c7d1ad');
  gradient.addColorStop('1', '#809253');

  ctx.setLineWidth(9);
  ctx.setStrokeStyle(gradient);
  ctx.setLineCap('round')
  ctx.beginPath(); 
  // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
  ctx.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
  ctx.stroke(); 
  ctx.draw();

},
clearCircle: function(){

  var ctx = wx.createCanvasContext('canvasTimerVal');
  ctx.clearRect(0, 0, 220, 220);
  ctx.draw();

}

})
