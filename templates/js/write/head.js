$(function(){
	$.get("/user/getUserInfo", function(result) {
		if (result.success) {
			if (result.data != undefined) {
				var name = result.data.name;
				var avatar = result.data.avatar;
				var isCertified = result.data.isCertified;
				$("#name").html("您好，" + result.data.name + "");

				$.get("/oa/company/getCompanyStatus", function(result) {
					if (result.success) {
						if (result.data != undefined) {
							if (window.location.pathname != "/company.html") {
								
								if(result.data.status == 0 || result.data.status==2){
									BootstrapDialog.alert({
							            message: '根据相关法律要求，信息查询需要企业认证，欢迎“<a href="/company.html" class="link">认证</a>”后使用',
							            type: BootstrapDialog.TYPE_INFO,
							            callback: function() {
							                window.location.href = "/company.html";
							            }
							        });
								}
							}else{
								if(result.data.status == 2) {
									$("#errorX").html(result.data.failureReason);
									
									$("#companyName").val(result.data.companyName);
									$("#compayScale").val(result.data.compayScale);
									$("#rname").val(result.data.name);
									$("#idCard").val(result.data.idCard);
									$("#dept").val(result.data.dept);
									$("#position").val(result.data.position);
								}
							}
							if(result.data.status == 3) {
								$('.companyName').html("[ "+ result.data.companyName + " ]");
								if ($(".myName").length != 0) {
									$(".myName").html(name);
								}
								if ($("input[name='dqrName']").length != 0) {
									$("input[name='dqrName']").val(name);
								}
								if ($("input[name='dqCompanyName']").length != 0) {
									$("input[name='dqCompanyName']").val(result.data.companyName);
								}
								
								if(!isCertified){
									$("#isCertified").html("未实名");
									$("#isCertified").removeClass("label-success").addClass("label-default");
									$.get('/oa/company/getStaffInfo',function(result){
										if (result.success) {
											if (result.data != undefined) {
												if ($(".myName").length != 0) {
													$(".myName").html(result.data.name);
												}
												$("#name").html("您好，" + result.data.name + "");
											}
										}
									});
								}else{
									if (window.location.pathname == "/personal-edit.html") {
										$('#crtified').html(isCertified);
										$('#bjname').html(name);
									}
								}
								if($("#finalImg").length != 0){
									$('#finalImg').attr('src','http://p68lxneny.bkt.clouddn.com/' + avatar)
								}
							}
						}
					}
				});
			}
		}
	});
});