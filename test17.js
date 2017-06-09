/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) { //将日期以指定的形式返回
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {//生成一系列obj对象，每个日期代表一个属性值
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) { //只生成三个月的数据进行分析
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);//setDate()设置日期月份中的天数，如果超过应有的天数，就会将月份加1
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
console.log(aqiSourceData);
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1, //初始化为-1,第一次就会触发选项改变的值
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  console.log(chartData)
  var data;
  var strHtml="";
  /*var aniBox=document.getElementById("aniBox");*/
  for(data in chartData){
    strHtml+="<div class='aqi-str' style='width:60px;height:"
      +chartData[data]
      +"px;background:"
      +getRandomColor()
      + ";'title'"
      +chartData[data]
      +"'></div>"
    console.log(data);
  }
  document.getElementById('chartBox').innerHTML=strHtml;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var radio=getRadio();
  if(radio==pageState.nowGraTime){
    return 
    // 设置对应数据
  }else{
  // 调用图表渲染函数
    initAqiChartData();
  }  

}


function getRadio(){
  var value;
  var graInput=document.getElementsByName('gra-time');
  for(var i=0;i<graInput.length;i++){
    if (graInput[i].checked) {
      value=graInput[i].value;
      break;
    }
  }
  return value;
}


/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var nowCity=document.getElementById("city-select").value;
  console.log(nowCity)
  if (nowCity==pageState["nowSelectCity"]) {
    return false;
  }else{
    pageState["nowSelectCity"]=nowCity; // 设置对应数据
    chartData = aqiSourceData[nowCity];
    renderChart();// 调用图表渲染函数
  }
}


/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var graInput=document.getElementsByName("gra-time");
  for(var i=0;i<graInput.length;i++){
    graInput[i].onclick = graTimeChange;
  }
}


/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect=document.getElementById("city-select");
  for(var city in aqiSourceData){
    /*console.log(city);*/
    var option=document.createElement("option");
    option.innerHTML=city;
    citySelect.appendChild(option);
  }
  console.log(citySelect);
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange=citySelectChange;
}


/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var city=document.getElementById("city-select").value;
  var radio=getRadio();
  pageState.nowGraTime=radio;
  pageState["nowSelectCity"]=city;

  switch(radio){
    case "day":
      chartData=aqiSourceData[city];
      console.log(city)
      break;
    case "week":
      chartData={};
      var count=0;
      var total=0;
      var week=1;
      var getday;
      for(var time in aqiSourceData[city]){
           getday =new Date(time).getDay();
           if(getday==0){
            count++;
            total+=aqiSourceData[city][time];
            chartData["week"+week]=Math.round(total/count);
            week++;
            count=0;
            total=0;
           }else{
            count++;
            total+=aqiSourceData[city][time];
           }
      }
      chartData["week"+week]=Math.round(total/count);
      break;
    case"month":
      chartData={};
      var count=0;
      var total=0;
      var month=1;
      var getmonth;
      for(var time in aqiSourceData[city]){
        getmonth = new Date(time).getMonth()+1;
        if (getmonth==month) {
          count++;
          total+=aqiSourceData[city][time];
          chartData["month"+month]=Math.round(total/count);
        }else{
          month++;
          count=0;
          total=0;
        }
      }
  }
  renderChart();
}


/**
*获取随机颜色
*/
function getRandomColor(){
  /*return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); */
  return '#' + (function (h) {
        return new Array(7 - h.length).join("0") + h
    })((Math.random() * 0x1000000 << 0).toString(16))
}


/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}


window.onload = function () {
    init();
}
