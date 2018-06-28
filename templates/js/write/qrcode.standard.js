$(function(){
	
	$.get('oa/company/getQrCode',{type:'STANDARD'},function(result){
		if (result.success) {
			if(result.data != undefined){
				$('#standard').attr('src','data:image/jpeg;base64,' + result.data);
			}
		}
	});
})