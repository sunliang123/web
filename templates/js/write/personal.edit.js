$(function(){
	var html = '';
	
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
	
	$(".form_datetime").datepicker();
	
	$.get('/oa/company/getStaffInfo',function(result){
		var deptId='';
		if (result.success) {
			if (result.data != undefined) {
				deptId = result.data.deptId;
				$("#rname").val(result.data.name);
				$("#idCard").val(result.data.idCard);
				$("select[name='dept']").val(result.data.deptName);
				$("#position").val(result.data.position);
				$("#mobile").val(result.data.mobile);
				$("input[name='entryDate']").val(result.data.entryDate);
			}
		}
		$.get('/oa/company/getDeptInfos',function(result){
			if (result.success) {
				if(result.data != undefined){
					$.each(result.data, function (n, value) {
						if (deptId == value.deptId) {
							html += '<option value='+value.deptId+' selected>'+value.name+'</option>';
						}else{
							html += '<option value='+value.deptId+'>'+value.name+'</option>';
						}
			        });
					$('select[name="dept"]').append(html);
				}
			}
		});
	});
	
	
	$("form").formValidation({
		err : {
			container : function($field, validator) {
				return $('form').find('.login-error');
			}
		},

	}).on(
			'success.form.fv',
			function(e) {
				e.preventDefault();
				var $form = $(e.target), fv = $form.data('formValidation');
				if($('#crtified').html() && $('#bjname').html() != $('input[name="name"]').val()){
					fv.updateMessage("name", 'blank','姓名已实名不能修改').updateStatus(
							"name", 'INVALID', 'blank');
					$("[name='name']").focus();
					return false;
				}
				$.ajax({
						url : '/oa/company/editStaffInfo',
						type : 'POST',
						contentType: "application/json; charset=utf-8",
				        data: JSON.stringify(GetJsonData()),
				        dataType: "json",
						success : function(result, status, xhr) {
							if (result.success) {
//									toastr.success('修改成功','',{onHidden: function(){
									window.location.href = "/personal.html?show";
//				            		}});
							} else {
								fv.updateMessage("idCard", 'blank',
										result.message).updateStatus(
										"idCard", 'INVALID', 'blank');
								$("[name='idCard']").focus();
							}
						}
					});
			}).on(
			'err.validator.fv',
			function(e, data) {
				data.element.data('fv.messages').find(
						'.help-block[data-fv-for!="' + data.field + '"]')
						.hide();
				data.element.data('fv.messages').find(
						'.help-block[data-fv-for="' + data.field + '"]').hide()
						.filter('[data-fv-validator="' + data.validator + '"]')
						.show();
			});
	
	function GetJsonData() {
	    var json = {
    		"name" : $("input[name='name']").val(),
			"idCard" : $("input[name='idCard']").val(),
			"deptId" : parseInt($("select[name='dept']").val()),
			"position" : $("input[name='position']").val(),
			"entryDate" : new Date(($("input[name='entryDate']").val()).replace(/-/g,   "/"))
	    };
	    return json;
	}
});