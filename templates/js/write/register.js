$(function(){
	// 定时器
	var countdown = 60;
	var showTimer = function($btn) {
		if (countdown == 0) {
			$btn.removeAttr("disabled");
			$btn.html("获取验证码");
			countdown = 60;
		} else {
			$btn.attr("disabled", true);
			$btn.html("获取验证码(" + countdown + ")");
			countdown--;
			setTimeout(function() {
				showTimer($btn);
			}, 1000);
		}
	};

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
				$
						.ajax({
							url : '/user/register',
							type : 'POST',
							contentType: "application/json; charset=utf-8",
					        data: JSON.stringify(GetJsonData()),
					        dataType: "json",
							success : function(result, status, xhr) {
								if (result.success) {
									toastr.success('注册成功','',{onHidden: function(){
										window.location.href = "/login.html";
				            		}});
								} else {
									fv.updateMessage("code", 'blank',
											result.message).updateStatus(
											"code", 'INVALID', 'blank');
									$("[name='code']").focus();
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

	var fv1 = $("form").data('formValidation');
	$("form").find(".btn-code").off("click").on(
			"click",
			function() {
				fv1.validateField('mobile');
				if (fv1.isValidField('mobile')) {
					var $that = $(this);
					$.ajax({
						url : '/user/send_register_sms',
						type : 'GET',
						data : {
							mobile : $("input[name='mobile']").val()
						},
						success : function(result, status, xhr) {
							if (result.success) {
								showTimer($that);
							} else {
								fv1.updateMessage("mobile", 'blank',
										result.message).updateStatus("mobile",
										'INVALID', 'blank');
								$("[name='mobile']").focus();
							}
						}
					});
				}
			});
	
	function GetJsonData() {
	    var json = {
    		"mobile" : $("input[name='mobile']").val(),
			"password" : $("input[name='password']").val(),
			"smsCode" : $("input[name='code']").val()
	    };
	    return json;
	}
});