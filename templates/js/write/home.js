$(function() {
	
	$.get("/user/getUserInfo", function(result) {
		if (result.success) {
			if (result.data != undefined) {
				var avatar = result.data.avatar;
				$("#name").html("您好，" + result.data.name + "");

				$.get("/oa/company/getCompanyStatus", function(result) {
					if (result.success) {
						if (result.data != undefined) {
							if(result.data.status == 0){
								BootstrapDialog.alert({
						            message: '根据相关法律要求，信息查询需要企业认证，欢迎“<a href="/company.html" class="link">认证</a>”后使用',
						            type: BootstrapDialog.TYPE_INFO,
						            callback: function() {
						                window.location.href = "/company.html";
						            }
						        });
							}
							if (result.data.status == 0) {
								$(".authenticate").html('未认证');
								$('.companyname').html('申请企业认证，获取更多权益 未认证');
								
							} else if (result.data.status == 1) {
								$(".authenticate").html('审核中');
								$('.companyname').html('企业认证审核中，请耐心等待');
								$(".user-img").attr('href','/company-succ.html');
								$(".authenticate").attr('href','/company-succ.html');
							} else if (result.data.status == 2) {
								$(".authenticate").html('修改认证信息');
								$('.companyname').html('认证申请未通过，请修改对应信息后重新提交');
								$(".user-img").attr('href','/company.html');
								$(".authenticate").attr('href','/company.html');
							} else if (result.data.status == 3) {
								$(".authenticate").html('已审核');
								$('.companyname').html(result.data.companyName);
								$('.companyName').html("[ "+ result.data.companyName + " ]");
								if (avatar!=undefined && avatar != null) {
									$("#avatar").attr('src','http://avatar.zxcioc.com/'+ avatar);
								}
								$.get('/oa/company/getStaffInfo',function(result){
									if (result.success) {
										if (result.data != undefined) {
											$("#name").html("您好，" + result.data.name + "");
										}
									}
								});
							}
						}
					}
				});
			}
		}
	});
});