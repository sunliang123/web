$(function() {
	
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
	
	var cancelBtn = {
        label: BootstrapDialog.DEFAULT_TEXTS.CANCEL,
        action: function(dialog) {
            dialog.close();
        }
    }

    var toggleEnable = function($form, $Btn) {
        $form.formValidation().on('err.validator.fv',
        function(e, data) {
            data.element.data('fv.messages').find('.help-block[data-fv-for="' + data.field + '"]').hide().filter('[data-fv-validator="' + data.validator + '"]').show();
            $Btn.toggleEnable(false);
        }).on('success.validator.fv',
        function(e, data) {
            $Btn.toggleEnable(true);
        });
        return $form.data('formValidation');
    }

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
	
	

    var html =  '<li><a name="allDept" class="text-info">所有部门</a></li>';
    var table;
    
    $.get('/user/getUserPermission',function(result){
		if (result.data != undefined) {
			$.each(result.data, function(n, value){
				if (value.authority == 'ROLE_HR') {
					$('#yaoQtons').toggleClass('hidden');
					$('#yaoQtons').prev().toggleClass('hidden');
				}
			});
		}
	});
    
    $.get('/oa/company/getStaffInfo',function(result){
    	var dept = '';
    	var deptId = '';
		if (result.success) {
			if (result.data != undefined) {
				dept = result.data.deptName;
				deptId = result.data.deptId;
				$('#deptNo').html(deptId);
			}
		}
		
		$.get('/oa/company/getDeptInfos',function(result){
			if (result.success) {
				if(result.data != undefined){
					$.each(result.data, function (n, value) {
						if (value.name == dept) {
							html += '<li><a class="text-orange" name="'+value.deptId+'">'+ value.name +'</a><i class="fa fa-trash-o pull-right delDept" aria-hidden="true"></i><i class="fa fa-pencil-square-o pull-right editDept" aria-hidden="true"></i></li>';
						}else{
							html += '<li><a class="text-info" name="'+value.deptId+'">'+ value.name +'</a><i class="fa fa-trash-o pull-right delDept" aria-hidden="true"></i><i class="fa fa-pencil-square-o pull-right editDept" aria-hidden="true"></i></li>';
						}
			        });
//					html += '<a class="btn btn-default" name="createDept"><i class="fa fa-plus" aria-hidden="true"></i> 创建部门</a>';
					$('#deptInnerHTML').append(html);
				}
			}
		});
		showTable(deptId);
	});

	$('#deptInnerHTML').undelegate();
	
	$("#deptInnerHTML").on("click","li a", function(result) {
		var type = result.target.name;
		$("li a").removeClass("text-orange").toggleClass("text-info");
		if (type=='allDept') {
			showTable("");
			$('#deptNo').html("");
		}else{
			showTable(type);
			$('#deptNo').html(type);
		}
		$(this).toggleClass("text-orange");
	 });
	
	$("#deptInnerHTML").on("click",".delDept", function(result) {
		var id = $(result.target).siblings()[0].name;
		var $that = $(this);
		var message = "您确定要删除该部门吗？";
        msgDialog.setMessage(message);
        msgDialog.realize();
        var submitBtn = msgDialog.getButton('msgBox');
        submitBtn.click(function() {
        	$.post('/oa/company/delDeptInfo',{deptId : id},function(result){
        		msgDialog.close();
    			if (result.code == 200) {
    				$that.parent('li').remove();
    				toastr.success('删除成功');
    			}else{
    				toastr.error(result.message);
    			}
    		});
        });
        msgDialog.open();
	 });
	
	$("#deptInnerHTML").on("click",".editDept", function(result) {
		var id = $(result.target).siblings()[0].name;
		var $that = $(this);
		BootstrapDialog.show({
            title: '编辑部门',
            message: ['<form class="form-horizontal form-validation">', '<div class="row">', '<div class="col-md-10 col-md-offset-1">', '<div class="alert alert-success auto hidden"><p></p></div>', '</div>', '<div class="col-md-9 col-md-offset-1">', '<div class="form-group">', '<label for="deptName" class="col-sm-4 control-label"><span class="text-danger">*</span> 部门名称 :</label>', '<div class="col-sm-8"><input type="text" name="deptName" class="form-control" placeholder="请输入部门名称" data-fv-notempty="true" data-fv-blank="true"></div>', '</div>', '</div>', '</div>', '</div>', '</form>'].join(''),
            buttons: [{
                label: BootstrapDialog.DEFAULT_TEXTS.OK,
                cssClass: 'btn-info',
                action: function(dialog) {
                    var $Btn = dialog.getButton($(this).attr("id"));
                    var $form = dialog.$modalBody.find('form');
                    var fv = toggleEnable($form, $Btn);
                    if (fv.validate().isValid()) {
                        $form.ajaxSubmit({
                            type: "post",
                            dataType: "json",
                            url: "/oa/company/editDeptInfo",
                            data:{
                            	deptId : id
                            },
                            success: function(result, statusText, xhr, $form) {
                                if (result.success) {
                                	dialog.close();
                                	$that.parent('li').find('a').html($form.find('input[name="deptName"]').val());
                                	toastr.success('修改成功');
                                } else {
                                    showError(result, fv);
                                }
                            },
                        });
                    }
                }
            },
            cancelBtn]
        });
	 });
	
	function showTable(id){
		if (table != undefined) {
			table.destroy();
		}
		table = $("table").DataTable({
		    "serverSide": true,
		    "ajax": {
	            "url": "oa/company/getStaffInfos",
	            "type": "GET",
	            "data": function (d) {
	            	d.deptId = id;
		            d.startDate = $('input[name="start"]').val();
		            d.endDate = $('input[name="end"]').val();
		            return d;
		        }
	        },
	        "columns": [{
	            "data": "name",
	            "width": "15%"
	        },
	        {
	            "data": "mobile",
	            "width": "15%",
	            "render": function(data, type, row) {
	            	var reg = /1(\d{2})\d{4}(\d{4})/g;
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return data.replace(reg,"1$1****$2");
	            }
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
	            "width": "20%",
	            "render": function(data, type, row) {
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return data;
	            },
	        },
	        {
	            "data": "entryDate",
	            "width": "15%",
	            "render": function(data, type, row) {
	                if (_.isEmpty(data)) {
	                    return '-';
	                }
	                return (new Date(data.replace(/-/g,'/'))).Format("yy-MM-dd");
	            }
	        },
	        {
	            "data": "mobile",
	            "render": function(data, type, row) {
	            	return '<a class="btn btn-sm btn-default" href="/photo.html?headImage='+ row.headImage +'">头像</a>&nbsp;&nbsp;<a class="btn btn-sm btn-default" href="/idcopy.html?frontImage='+ row.frontImage +'&backImage='+ row.backImage +'">身份证</a>&nbsp;&nbsp;<a class="btn btn-sm btn-default" href="/leave.html?leaveProve='+ row.leaveProve +'">离职证明</a>';
	            },
	            "orderable":false,
	            "width": "20%"
	        }],
	        "order": [[ 4, "desc" ]]
	    }).on('init.dt', function () {
	    	$("#recordsTotal").html('<span class="text-record">当前记录 : ' + table.page.info().recordsTotal + ' 条</span>');
	    });
		
		$('input[type="search"]').bind('input porpertychange',function(){
			var filter = $(this).val();
			table.search(filter).draw();
		});
		
		$(".btn-query").on("click",function(e){
			table.draw();
		});
	}
	
	$("#addDept").on('click',function(){
		BootstrapDialog.show({
            title: '添加部门',
            message: ['<form class="form-horizontal form-validation">', '<div class="row">', '<div class="col-md-10 col-md-offset-1">', '<div class="alert alert-success auto hidden"><p></p></div>', '</div>', '<div class="col-md-9 col-md-offset-1">', '<div class="form-group">', '<label for="deptName" class="col-sm-4 control-label"><span class="text-danger">*</span> 部门名称 :</label>', '<div class="col-sm-8"><input type="text" name="deptName" class="form-control" placeholder="请输入部门名称" data-fv-notempty="true" data-fv-blank="true"></div>', '</div>', '</div>', '</div>', '</div>', '</form>'].join(''),
            buttons: [{
                label: BootstrapDialog.DEFAULT_TEXTS.OK,
                cssClass: 'btn-info',
                action: function(dialog) {
                    var $Btn = dialog.getButton($(this).attr("id"));
                    var $form = dialog.$modalBody.find('form');
                    var fv = toggleEnable($form, $Btn);
                    if (fv.validate().isValid()) {
                        $form.ajaxSubmit({
                            type: "post",
                            dataType: "json",
                            url: "/oa/company/addDeptInfo",
                            success: function(result, statusText, xhr, $form) {
                                if (result.success) {
                                	dialog.close();
                                	var addHtml = '<li><a class="text-info" name="'+ result.data.deptId +'">'+ result.data.name +'</a><i class="fa fa-trash-o pull-right delDept" aria-hidden="true"></i><i class="fa fa-pencil-square-o pull-right editDept" aria-hidden="true"></i></li>';
                                	$('#deptInnerHTML').append(addHtml);
                                	toastr.success('添加成功');
                                } else {
                                    showError(result, fv);
                                }
                            },
                        });
                    }
                }
            },
            cancelBtn]/*,
            onhidden: function(dialog){
            	var $form = dialog.$modalBody.find('form');
            	$form.find('select[name="deptName"]').append(yqHtml);
            }*/
        });
	});
	
	$('#datepicker').datepicker();
	
	
	$('#exportEntry').on('click',function(){
		var deptNo = "";
		var deptId = $('#deptNo').html();
		if(deptId == null || deptId == ""){
			
		}else{
			deptNo = parseInt(deptId); 
		}
		
		var startDate = $('input[name="start"]').val();
		var endDate = $('input[name="end"]').val();
		downloadFile("/oa/company/exportStaffInfos?deptId="+deptNo+"&startDate="+startDate+"&endDate="+endDate);
	});
	
	function downloadFile(url) {   
        try{ 
            var elemIF = document.createElement("iframe");   
            elemIF.src = url;   
            elemIF.style.display = "none";   
            document.body.appendChild(elemIF);   
        }catch(e){ 
 
        } 
    }
	
	$('#signOut').on('click',function(){
		var message = "您确定要退出该部门吗？";
        msgDialog.setMessage(message);
        msgDialog.realize();
        var submitBtn = msgDialog.getButton('msgBox');
        submitBtn.click(function() {
        	$.post('/oa/company/quit',function(result){
        		msgDialog.close();
    			if (result.code == 200) {
    				toastr.success('退出成功','',{onHidden: function(){
						window.location.href = "/login.html";
            		}});
    			}else{
    				toastr.error(result.message);
    			}
    		});
        });
        msgDialog.open();
	});

	
	function GetJsonData() {
	    var json = {
    		"mobile" : $("input[name='mobile']").val(),
			"name" : $("input[name='name']").val(),
			"deptId" : parseInt($("select[name='deptName']").val()),
			"role" : $('input[name="role"]:checked').val()
	    };
	    return json;
	}
});