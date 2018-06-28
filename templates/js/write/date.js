$(function(){
	//时间插件默认设置
    $.extend($.fn.datepicker.defaults, {
        language: 'zh-CN',
        autoclose: true,
        clearBtn: true,
    });
    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        today: "今日",
        clear: "清除",
        format: "yyyy-mm-dd",
        titleFormat: "yyyy年mm月",
        weekStart: 1
    };
    //表格插件默认设置
    $.fn.dataTable.ext.errMode = 'throw';
    $.extend($.fn.dataTable.defaults, {
        info: false,
        lengthChange: false,
        serverSide: true,
        autoWidth: false,
        stripeClasses: ["odd", "even"],
        language: {
            search: "_INPUT_<span class='glyphicon glyphicon-search form-control-feedback'></span>",
            searchPlaceholder: "请输入查询条件",
            zeroRecords: "<i class='fa fa-frown-o'></i> 未找到相关记录",
            infoEmpty: "<i class='fa fa-frown-o'></i> 未找到相关记录",
            emptyTable: "<i class='fa fa-frown-o'></i> 未找到相关记录",
            paginate: {
                first: "首页",
                last: "尾页",
                previous: "上页",
                next: "下页",
            }
        },
    });
    
    
    Date.prototype.Format = function(fmt) {
	    var o = { 
	        "M+": this.getMonth() + 1, 
	        //月份 
	        "d+": this.getDate(), 
	        //日 
	        "h+": this.getHours(), 
	        //小时 
	        "m+": this.getMinutes(), 
	        //分 
	        "s+": this.getSeconds(), 
	        //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), 
	        //季度 
	        "S": this.getMilliseconds() //毫秒 
	    }; 
	    if (/(y+)/.test(fmt)) { 
	        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
	    } 
	    for (var k in o) { 
	        if (new RegExp("(" + k + ")").test(fmt)) { 
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
	        } 
	    } 
	    return fmt; 
	}
});