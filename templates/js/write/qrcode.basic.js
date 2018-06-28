$(function(){
	
	$.get('oa/company/getQrCode',{type:'BASIC'},function(result){
		if (result.success) {
			if(result.data != undefined){
				$('#basic').attr('src','data:image/jpeg;base64,' + result.data);
			}
		}
	});
})