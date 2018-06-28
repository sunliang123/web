$(function() {
	
	
	/*$.get("/oa/company/getCompanyStatus", function(result) {
		if (result.data.status==1) {
    		window.location.href = "/company-succ.html";
		}
    	if (result.data.status==3) {
    		window.location.href = "/home.html";
		}
    });*/

    var uploading = false;
    var businessLicense = '';

    var showError = function(result, fv) {
        if (result.message != undefined) {
            toastr["error"](result.message);
        }
        if (result.data != undefined) {
            for (var item in result.data) {
                fv.updateMessage(item, 'blank', result.data[item]).updateStatus(item, 'INVALID', 'blank');
                $("[name='" + item + "']").focus();
            }
        }
    }

    $('form').formValidation().on('success.form.fv',  function(e) {
        e.preventDefault();
        var $form = $(e.target),
        fv = $form.data('formValidation');
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/oa/company/submit",
            contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(GetJsonData()),
            success: function(result, statusText, xhr, $form) {
                if (result.success) {
                    window.location.href = "/company-succ.html";
                } else {
                    showError(result, fv);
                }
            },
        });

    }).on('err.validator.fv', function(e, data) {
        data.element.data('fv.messages').find('.help-block[data-fv-for!="' + data.field + '"]').hide();
        data.element.data('fv.messages').find('.help-block[data-fv-for="' + data.field + '"]').hide().filter('[data-fv-validator="' + data.validator + '"]').show();
    });

    $('input[type="file"]').change(function(e) {
        var form = $('form')[0];
        var file = e.target;
        if (uploading) {
            alert("文件正在上传中，请稍候");
            return false;
        }

        if (form == undefined || form == null) {
            alert("图片不能为空");
            return false;
        }
        $.ajax({
            url: '/oa/company/upload',
            type: 'POST',
            cache: false,
            data: new FormData(form),
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function() {
                //在此限制图片的大小
                var imgSize = file.size;
                console.log(imgSize);
                //35160  计算机存储数据最为常用的单位是字节(B)
                //在此处我们限制图片大小为2M
                if (imgSize > 2 * 1024 * 1024) {
                    alert('上传的图片的大于2M,请重新选择');
                    return false;
                }
                uploading = true;
                $("#submit").attr({ disabled: "disabled" });
            },
            success: function(data) {
                if (data != undefined) {
                    if (data.code == 200) {
                    	businessLicense = data.message;
                        // $("#logo").attr("src", data.msg);
                    } else {
                        toastr["error"](result.message);
                    }
                }
            },
            complete: function() {
                uploading = false;
                $("#submit").removeAttr("disabled");
            },
            error: function() {
                alert("请链接网络");
            }
        });
    });
    
    function GetJsonData() {
	    var json = {
    		"name" : $("input[name='name']").val(),
			"idCard" : $("input[name='idCard']").val(),
			"dept" : $("input[name='dept']").val(),
			"position" : $("input[name='position']").val(),
			"companyName" : $("input[name='companyName']").val(),
			"compayScale" : $("select[name='compayScale']").val(),
			"businessLicense": businessLicense
	    };
	    return json;
	}
    
});