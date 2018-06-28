$(function(){
	var leaveImg = (window.location.search).split("=")[1];
	
	$('#leaveImg img').attr('src', 'http://lzzm.zxcioc.com/'+ leaveImg);


	$.get('/oa/company/getStaffInfo',function(result){
		if (result.success) {
			if (result.data != undefined) {
				if(document.getElementById("div-print")!=null){
			    	watermark({
			    	    watermark_txt: result.data.companyName +" "+ result.data.name +" "+ getNowDate()
			    	});
				}
			}
		}
	});
});





function getNowDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    
    var currentdate = year + month + strDate + hour + minute + second;
    return currentdate;
}



//生成水印
function watermark(settings, page_width, page_height) {
var defaultSettings = {
    watermark_txt: "text",
    watermark_x: 120,
    watermark_y: 60,
    watermark_rows: 50,
    watermark_cols: 2,
    watermark_x_space: 160,
    watermark_y_space: 100,
    watermark_color: '#000',
    watermark_alpha: 0.1,
    watermark_fontsize: '16px',
    watermark_font: '微软雅黑',
    watermark_width: 280,
    watermark_height: 50,
    watermark_angle: 45
};
// 采用配置项替换默认值，作用类似jquery.extend
if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (var key in src) {
        if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
        else if (src[key]) defaultSettings[key] = src[key];
    }
}
var oTemp = document.createDocumentFragment();

// 获取页面最大宽度
var page_width = document.getElementById("div-print").offsetWidth;
// 获取页面最大长度
var page_height = document.getElementById("div-print").offsetHeight;


// 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
if (defaultSettings.watermark_cols == 0 || 　　　　 (parseInt(defaultSettings.watermark_x　　　　 + defaultSettings.watermark_width * defaultSettings.watermark_cols　　　　 + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1))　　　　 > page_width)) {
    defaultSettings.watermark_cols = 　　　　　　parseInt((page_width　　　　　　　　　　 - defaultSettings.watermark_x　　　　　　　　　　 + defaultSettings.watermark_x_space)　　　　　　　　　　 / (defaultSettings.watermark_width　　　　　　　　　　 + defaultSettings.watermark_x_space));
    defaultSettings.watermark_x_space = 　　　　　　parseInt((page_width　　　　　　　　　　 - defaultSettings.watermark_x　　　　　　　　　　 - defaultSettings.watermark_width　　　　　　　　　　 * defaultSettings.watermark_cols)　　　　　　　　　　 / (defaultSettings.watermark_cols - 1));
}
// 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
if (defaultSettings.watermark_rows == 0 || 　　　　 (parseInt(defaultSettings.watermark_y　　　　 + defaultSettings.watermark_height * defaultSettings.watermark_rows　　　　 + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1))　　　　 > page_height)) {
    defaultSettings.watermark_rows = 　　　　　　parseInt((defaultSettings.watermark_y_space　　　　　　　　　　　 + page_height - defaultSettings.watermark_y)　　　　　　　　　　　 / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
    defaultSettings.watermark_y_space = 　　　　　　parseInt((page_height　　　　　　　　　　 - defaultSettings.watermark_y　　　　　　　　　　 - defaultSettings.watermark_height　　　　　　　　　　 * defaultSettings.watermark_rows)　　　　　　　　　 / (defaultSettings.watermark_rows - 1));
}
var x;
var y;
for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

        var mask_div = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;
        mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
        // 设置水印div倾斜显示
        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = "999";
        // mask_div.style.border="solid #eee 1px";
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        oTemp.appendChild(mask_div);
    };
};
document.getElementById("div-print").appendChild(oTemp);
}