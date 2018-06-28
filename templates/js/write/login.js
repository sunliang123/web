$(function(){
	
	$('form').formValidation({
		err : {
			container : function($field, validator) {
				return $('form').find('.login-error');
			}
		}
	}).on(
			'success.form.fv',
			function(e) {
				e.preventDefault();
				var $form = $(e.target),fv = $form.data('formValidation');
				$.ajax({
					url : '/login',
					type : 'POST',
					data : $form.serialize(),
					success : function(result, status, xhr) {
						if (result.success) {
							window.location.href = "/home.html";
						} else {
							fv.updateMessage("password", 'blank',
									result.message).updateStatus("password",
									'INVALID', 'blank');
							$("[name='password']").focus();
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
});