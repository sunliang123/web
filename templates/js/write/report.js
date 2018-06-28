$(function(){
	
	var msgDialog = new BootstrapDialog({
        closable: true,
        closeByBackdrop: false,
        closeByKeyboard: true,
        type: BootstrapDialog.TYPE_INFO,
        buttons: [{
            id: 'msgBox',
            cssClass: 'btn-info',
            label: '确认',
        },
        {
            label: '取消',
            action: function(dialogItself) {
                dialogItself.close();
            }
        }]
    });
	
		var table = $("table").DataTable({
		    "serverSide": true,
		    "ajax": {
	            "url": "oa/company/getReportPushInfos",
	            "type": "GET"
	        },
	        "columns": [{
	            "data": "name",
	            "width": "10%"
	        },
	        {
	            "data": "deptName",
	            "width": "15%",
	            "render": function(data, type, row) {
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return data;
	            }
	        },
	        {
	            "data": "position",
	            "width": "15%",
	            "render": function(data, type, row) {
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return data;
	            }
	        },
	        {
	            "data": "type",
	            "width": "15%",
	            "render": function(data, type, row) {
	                if (data== 0) {
	                    return '<span class="text-basic">基础版</span>';
	                }
	                if (data== 1) {
	                	return '<span class="text-standard">标准版</span>';
					}
	                if (data== 2) {
	                	return '<span class="text-senior">高级版</span>';
					}
	                return '--';
	            }
	        },
	        {
	            "data": "createdDate",
	            "width": "15%",
	            "render": function(data, type, row) {
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return (new Date(data.replace(/-/g,'/'))).Format("yy-MM-dd");
	            }
	        },
	        {
	            "data": "reportId",
	            "render": function(data, type, row) {
	                return '　<a class="btn btn-sm btn-default" href="/photo.html?headImage='+ row.headImage +'">头像</a>　<a class="btn btn-sm btn-default" href="/idcopy.html?frontImage='+ row.frontImage +'&backImage='+ row.backImage +'">身份证</a>　<a class="btn btn-sm btn-default" href="/leave.html?leaveProve='+ row.leaveProve +'">离职证明</a>　';
	            },
	            "orderable":false,
	            "width": "15%"
	        },
	        {
	            "data": "reportId",
	            "render": function(data, type, row) {
                    return '<a  href="/result.html?reportId=' + data + '" target="_blank" class="btn btn-success btn-sm">查看</a> &nbsp;<a  data-id="' + row.pushId + '" class="btn btn-primary btn-sm admission"> 录取 </a> &nbsp;<a  data-id="' + row.pushId + '" class="btn btn-danger btn-sm cutoff">删除</a>';
	            },
	            "width": "15%",
	            "orderable":false
	        }],
	        "order": [[ 4, "desc" ]]
	    }).on('init.dt', function () {
	    	$(".recordsTotal").html('<span class="text-record">当前记录 : ' + table.page.info().recordsTotal + ' 条</span>');
	    	
	    	$(".admission").on("click", function () {
                var pushId = $(this).data('id');
                var message = "您确定要录入吗？";
                msgDialog.setMessage(message);
                msgDialog.realize();
                var submitBtn = msgDialog.getButton('msgBox');
                submitBtn.click(function() {
                	$.ajax({
                        url: '/oa/company/agreeReportPushInfo',
                        type: 'POST',
                        data: {
                            pushId : pushId
                        },
                        success: function(result, status, xhr) {
                            if (result.success) {
                            	msgDialog.close();
                            	table.ajax.reload();
                            	toastr.success('录入成功');
                            }else{
                            	msgDialog.close();
                            	toastr.error(result.message);
                            }
                        }
                    });
               
                });
                msgDialog.open();
        	});
	    	
	    	$(".cutoff").on("click", function () {
                var pushId = $(this).data('id');
                var message = "您确定要删除这条信息吗？";
                msgDialog.setMessage(message);
                msgDialog.realize();
                var submitBtn = msgDialog.getButton('msgBox');
                submitBtn.click(function() {
	                $.ajax({
	                    url: '/oa/company/delReportPushInfo',
	                    type: 'POST',
	                    data: {
	                    	pushId : pushId
	                    },
	                    success: function(result, status, xhr) {
	                        if (result.success) {
	                        	msgDialog.close();
	                        	table.ajax.reload();
	                        	toastr.success('删除成功');
	                        }else{
	                        	msgDialog.close();
	                        	toastr.error('删除失败');
	                        }
	                    }
	                });
               
                });
                msgDialog.open();
        	});
	    	
	    });
	    
	    
});