$(function(){
    //备份jquery的ajax方法
    var _ajax = $.ajax;

    //重写jquery的ajax方法
    $.ajax = function(opt) {
        //备份opt中error和success方法
        var fn = {
            error: function(xhr, textStatus, errorThrown) {},
            success: function(data, textStatus, xhr) {}
        }
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }

        //扩展增强处理
        var _opt = $.extend(opt, {
            error: function(xhr, textStatus, errorThrown) {
                //错误方法增强处理
                if (xhr.status == 'undefined') {
                    return;
                }
                BootstrapDialog.closeAll();
                switch (xhr.status) {
                case 403:
                    BootstrapDialog.alert({
                        message:
                        '对不起，您没有访问权限。',
                        type: BootstrapDialog.TYPE_DANGER,
                    });
                    break;
                case 404:
                    BootstrapDialog.alert({
                        message:
                        '对不起，您访问的资源不存在。',
                        type: BootstrapDialog.TYPE_DANGER,
                    });
                    break;
                case 500:
                    BootstrapDialog.alert({
                        message:
                        '服务器异常，请稍后再试。',
                        type: BootstrapDialog.TYPE_DANGER,
                    });
                    break;
                }
                fn.error(xhr, textStatus, errorThrown);
            },
            success: function(data, textStatus, xhr) {
                if (_.isString(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {}
                }
                //成功回调方法增强处理
                if (data.code != 'undefined') {
                    switch (data.code) {
                    case 10999:
                        BootstrapDialog.closeAll();
                        BootstrapDialog.alert({
                            message:
                            '未登录或已超时，请重新登录。',
                            type: BootstrapDialog.TYPE_INFO,
                            callback: function() {
                                window.location.href = "/login.html";
                            }
                        });
                        return false;
                    case 10998:
                        BootstrapDialog.closeAll();
                        BootstrapDialog.alert({
                            message:
                            '您得帐号在另一处被登录。',
                            type: BootstrapDialog.TYPE_INFO,
                            callback: function() {
                                window.location.href = "/login.html";
                            }
                        });
                        return false;
                    case 403:
                        BootstrapDialog.closeAll();
                        BootstrapDialog.alert({
                            message:
                            '对不起，您没有权限访问',
                            type: BootstrapDialog.TYPE_WARNING,
                            callback: function() {
                                window.location.href = "/home.html";
                            }
                        });
                        return false;
                    /*case 13210:
                        BootstrapDialog.closeAll();
                        BootstrapDialog.alert({
                            message:'该用户尚未注册，请点击<a href="#" class="link">注册</a>',
                            type: BootstrapDialog.TYPE_WARNING,
                            callback: function() {
                                window.location.href = "/home.html";
                            }
                        });
                        return false;*/
                    }

                }
                fn.success(data, textStatus, xhr);
            }
        });
        return _ajax(_opt);
    };

   /* //表单验证默认设置
    $.extend($.fn.formValidation.DEFAULT_OPTIONS, {
        err: {
            clazz: 'animated flipInX',
        },
    });*/

    //弹出窗默认设置
    $.extend(BootstrapDialog.defaultOptions, {
        closeByBackdrop: false,
    });
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DEFAULT] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_PRIMARY] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_SUCCESS] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DANGER] = '系统提示';
    BootstrapDialog.DEFAULT_TEXTS['OK'] = '确 定';
    BootstrapDialog.DEFAULT_TEXTS['CANCEL'] = '取 消';
    BootstrapDialog.DEFAULT_TEXTS['CONFIRM'] = '提 交';
 
	$("[name='isRealname']").click(function(){
		 BootstrapDialog.alert({
	            message: '根据相关法律要求，信息查询需要实名认证，欢迎“<a href="secure" class="link">认证</a>”后使用',
	            type: BootstrapDialog.TYPE_INFO,
	            callback: function() {
	                window.location.href = "/secure";
	            }
	     });
	});
	
	$("[name='isCompany']").click(function(){
		BootstrapDialog.alert({
            message: '根据相关法律要求，信息查询需要企业认证，欢迎“<a href="company" class="link">认证</a>”后使用',
            type: BootstrapDialog.TYPE_INFO,
            callback: function() {
                window.location.href = "/company";
            }
        });
	});
	
	$(".logout").on('click',
		    function() {
		        $.get("/logout",
		        function(result) {
		            if (result.success) {
		                window.location.href = "/login.html";
		            }
		        });
		    });
});