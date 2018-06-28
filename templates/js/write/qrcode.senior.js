$(function(){
	
	$.get('oa/company/getQrCode',{type:'SENIOR'},function(result){
		if (result.success) {
			if(result.data != undefined){
				$('#senior').attr('src','data:image/jpeg;base64,' + result.data);
			}
		}
	});
})