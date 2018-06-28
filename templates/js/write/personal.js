$(function(){
	
	var pathname = window.location.search;
	if (pathname == '?show') {
		toastr.success('修改成功'/*,'',{onHidden: function(){
			window.location.href = "/personal.html";
		}}*/);
	}
	
	var businessLicense;
	$.get('/oa/company/getStaffInfo',function(result){
		if (result.success) {
			if (result.data != undefined) {
				$("#idCard").html(result.data.idCard);
				$("#companyname").html(result.data.companyName);
				$("#dept").html(result.data.deptName);
				$("#entryDate").html(result.data.entryDate);
				$("#position").html(result.data.position);
				
			}
		}
	});
	
	$.get('oa/company/getCompanyInfo',function(result){
		if (result.success) {
			if (result.data != undefined) {
				businessLicense = result.data.businessLicense;
				
				$("#creditCode").html(result.data.creditCode);
				$("#industry").html(result.data.industry);
				$("#compayScale").html(result.data.compayScale + " （ 人 ）");
				$("#regLocation").html(result.data.regLocation);
			}
		}
		$('#businessLicense').popover({
	        html:true,
	        content:"<img height='270' width='190' src='http://yyzz.zxcioc.com/"+ businessLicense +"'>"
	    });
	});
	
});
    //弹出框水平垂直居中
    (window.onresize = function () {
        var win_height = $(window).height();
        var win_width = $(window).width();
        if (win_width <= 768){
            $(".tailoring-content").css({
                "top": (win_height - $(".tailoring-content").outerHeight())/2,
                "left": 0
            });
        }else{
            $(".tailoring-content").css({
                "top": (win_height - $(".tailoring-content").outerHeight())/2,
                "left": (win_width - $(".tailoring-content").outerWidth())/2
            });
        }
    })();

    //弹出图片裁剪框
    $("#replaceImg").on("click",function () {
        $(".tailoring-container").toggle();
    });
    //图像上传
    function selectImg(file) {
        if (!file.files || !file.files[0]){
            return;
        }
        var reader = new FileReader();
        reader.onload = function (evt) {
            var replaceSrc = evt.target.result;
            //更换cropper的图片
            $('#tailoringImg').cropper('replace', replaceSrc,false);//默认false，适应高度，不失真
        }
        reader.readAsDataURL(file.files[0]);
    }
    //cropper图片裁剪
    $('#tailoringImg').cropper({
        aspectRatio: 1/1,//默认比例
        preview: '.previewImg',//预览视图
        guides: false,  //裁剪框的虚线(九宫格)
        autoCropArea: 0.5,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        movable: false, //是否允许移动图片
        dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true,  //是否允许移动剪裁框
        resizable: true,  //是否允许改变裁剪框的大小
        zoomable: false,  //是否允许缩放图片大小
        mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
        rotatable: true,  //是否允许旋转图片
        crop: function(e) {
            // 输出结果数据裁剪图像。
        }
    });
    //旋转
    $(".cropper-rotate-btn").on("click",function () {
        $('#tailoringImg').cropper("rotate", 45);
    });
    //复位
    $(".cropper-reset-btn").on("click",function () {
        $('#tailoringImg').cropper("reset");
    });
    //换向
    var flagX = true;
    $(".cropper-scaleX-btn").on("click",function () {
        if(flagX){
            $('#tailoringImg').cropper("scaleX", -1);
            flagX = false;
        }else{
            $('#tailoringImg').cropper("scaleX", 1);
            flagX = true;
        }
        flagX != flagX;
    });
    
    var uploading =false;
    //裁剪后的处理
    $("#sureCut").on("click",function () {
        if ($("#tailoringImg").attr("src") == null ){
            return false;
        }else{
            var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
            var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
            $("#finalImg").prop("src",base64url);//显示为图片的形式
            
            var form = document.forms[0];  
            var formData = new FormData(form);  
            var img_name=$("#chooseImg").val();  
            formData.append("file",convertBase64UrlToBlob(base64url),img_name);//img是input的name属性，与后台的对应即可
            if (uploading) {
                alert("文件正在上传中，请稍候");
                return false;
            }
            $.ajax({
                url : "user/uploadAvatar",  
                type : "POST",  
                data : formData,  
                dataType:"json",  
                processData : false,
                contentType : false,
                beforeSend: function() {
                    //在此限制图片的大小
                    var imgSize = $("#chooseImg")[0].size;
                    console.log(imgSize);
                    //35160  计算机存储数据最为常用的单位是字节(B)
                    //在此处我们限制图片大小为2M
                    if (imgSize > 2 * 1024 * 1024) {
                        alert('上传的图片的大于2M,请重新选择');
                        return false;
                    }
                    uploading = true;
                    $("#sureCut").attr({ disabled: "disabled" });
                },
                success:function(data){  
                	$("#finalImg").prop("src",base64url);//显示为图片的形式
                },
                complete: function() {
                    uploading = false;
                    $("#sureCut").removeAttr("disabled");
                },
            });  
            
            function convertBase64UrlToBlob(urlData){  
                var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
                //处理异常,将ascii码小于0的转换为大于0  
                var ab = new ArrayBuffer(bytes.length);  
                var ia = new Uint8Array(ab);  
                for (var i = 0; i < bytes.length; i++) {  
                    ia[i] = bytes.charCodeAt(i);  
                }  
                return new Blob( [ab] , {type : 'image/png'});  
            }
            

            //关闭裁剪框
            closeTailor();
        }
    });
    //关闭裁剪框
    function closeTailor() {
        $(".tailoring-container").toggle();
    }

