$(function(){
	var zgxlhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>最高学历</em></a>';
	var zyzghtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>资格证书</em></a>';
	var gstzhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>工商投资</em></a>';
	var sfalhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>司法案例</em></a>';
	var sfzxhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>司法执行</em></a>';
	var sfsxhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>司法失信</em></a>';
	var swxzhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>税务行政</em></a>';
	var cqgghtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>催欠公告</em></a>';
	var wdyqhtml = '<a class="quit-line-tit"><img class="hidden-xs" src="img/report-tit.jpg"><img class="hidden visible-xs" src="img/report-tit-xs.jpg"><em>网贷逾期</em></a>';
	
	var reportId= (window.location.search).split("=")[1];
	$(".reportId").html("报告编号： "+reportId);
	$("#scdate").html("生成日期："+ getNowFormatDate());
	$.get('/oa/company/getReportInfo',{reportId:reportId},function(result){
		if (result.success) {
			if (result.data != undefined) {
				var type = result.data.type;
				if (type==0) {
					$("#banben").html("|入职筛查报告[基础版]");
				}else if(type==1){
					$("#banben").html("|入职筛查报告[标准版]");
				}else if(type==2){
					$("#banben").html("|入职筛查报告[高级版]");
				}
				$('#zhscore').html('报告综合得分：'+result.data.score+'分');
				if (result.data.personInfo == undefined || result.data.personInfo == null) {
//					$('#isPerson').toggleClass("hidden");
					$('div[data-name="personNYZ"]').toggleClass("hidden");
				}else {
					$('div[data-name="personYZ"]').toggleClass("hidden");
					if (result.data.personInfo.photo == "") {
						$('div[data-tx="headImg"] img').attr('src' , 'http://www.qq22.com.cn/uploads/allimg/c161207/14Q04LI3KF-T229.jpg');
					}else{
						$('div[data-tx="headImg"] img').attr('src' , 'http://idcard.zxcioc.com/'+ result.data.personInfo.photo);
					}
					$("#headImage").attr('href','/photo.html?headImage='+ result.data.personInfo.photo);
					$("#zjzp").attr('href','/idcopy.html?frontImage='+ result.data.personInfo.frontImage +'&backImage='+ result.data.personInfo.backImage +'');
					$("#lzzm").attr('href','/leave.html?leaveProve='+ result.data.personInfo.leaveProve);
					$('#xm').html('姓名：'+result.data.personInfo.name);
					$('#xb').html(result.data.personInfo.gender == 2 ? '性别：女' : '性别：男');
					$('#csny').html('出生年月：'+result.data.personInfo.birthday);
					$('#sfz').html('身份证号：'+result.data.personInfo.idCard);
					$('#jgdz').html('籍贯地址：'+result.data.personInfo.originalAddress);
				}
				
				//手机实名
				if(result.data.mobileInfo == undefined || result.data.mobileInfo == null){
					$('div[data-name="mobileN"]').toggleClass("hidden");
				}else{
					if (result.data.mobileInfo.identical) {
						$('div[data-name="mobileY"]').toggleClass("hidden");
					}else{
						$('div[data-name="mobileN"]').toggleClass("hidden");
					}
					$('#sjh').html('手机号：'+result.data.mobileInfo.mobile);
					$('#gsd').html('归属地：'+result.data.mobileInfo.areaName);
				}
				//学历 type==0 没有学历，资格证书；type==1没有关联投资 type == 2全都有
				if (type == 1 || type == 2) {
					var count = 0;
					//学历
					if(result.data.educationInfo == undefined || result.data.educationInfo == null || result.data.educationInfo==""){
						$('div[data-name="eductionN"]').toggleClass("hidden");
					}else{
						$('div[data-name="eductionY"]').toggleClass("hidden");
						/*zgxlhtml += '<div class="row">'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>毕业学校：'+ result.data.educationInfo.graduate +'</p>'+
											'<p>入学年份：'+ result.data.educationInfo.enrolDate +'</p>'+
											'<p>学历类型：'+ result.data.educationInfo.studyStyle +'</p>'+
											'<p>985： 是 '+
											'<i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>'+
											'<i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>'+
											'<i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>'+
											'<i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>'+
											'<i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>'+
											'</p>'+
											'<p>学历：</p>'+
											'<p>毕业结论：</p>'+
											'<p>院校性质：</p>'+
											'<p>一流学校：</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>院校网址：</p>'+
											'<p>毕业时间：</p>'+
											'<p>层次：</p>'+
											'<p>211：</p>'+
											'<p>专业：</p>'+
											'<p>所在城市：</p>'+
											'<p>主管部门：</p>'+
											'<p>一流学科：</p>'+
										'</div>'+
									'</div>'+
									'<div id="c" data-name="highest" class="result result-suc"></div>'
						
						
						$('div[data-name="eductionY"]').append(zgxlhtml);*/
						
						
						$('#byxx').html('毕业学校：' + result.data.educationInfo.graduate);
						$('#rxnf').html('入学年份：' + result.data.educationInfo.enrolDate);
						$('#xllx').html('学历类型：' + result.data.educationInfo.studyStyle);
						$('#xl').html('学历：' + result.data.educationInfo.educationDegree);
						$('#byjl').html('毕业结论：' + result.data.educationInfo.studyResult);
						$('#bysj').html('毕业时间：' + result.data.educationInfo.graduateTime);
						$('#zy').html('专业：' + result.data.educationInfo.specialityName);
						if (result.data.educationInfo.schoolInfo !="") {
							$('#yxxz').html('院校性质：' + result.data.educationInfo.schoolInfo.nature);
							$('#isjyb').html(result.data.educationInfo.schoolInfo.is985 == true ? '985：是 <i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>' : '985：否');
							$('#ylxx').html(result.data.educationInfo.schoolInfo.topUniversity == true ? "一流学校：是" : "一流学校：否" );
							$('#yxwz').html((result.data.educationInfo.schoolInfo.url == null || "") ? "院校网址：--": "院校网址：--"+ result.data.educationInfo.schoolInfo.url +"");
							$('#cc').html('层次：' + result.data.educationInfo.schoolInfo.level);
							$('#iseyy').html(result.data.educationInfo.schoolInfo.is211 == true ? '211：是 <i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i><i style="color:#ffd200" class="fa fa-star" aria-hidden="true"></i>' : '211：否');
							$('#szcs').html('所在城市：' + result.data.educationInfo.schoolInfo.address);
							$('#bmzg').html('主管部门：' + result.data.educationInfo.schoolInfo.dept);
							$('#ylxk').html(result.data.educationInfo.schoolInfo.topSubject == true ? "一流学科：是" : "一流学科：否");
						}
						if(result.data.educationInfo.schoolInfo.is985 == true && result.data.educationInfo.schoolInfo.is211 == true){
							$('div[data-name="highest"]').html('<i class="fa fa-check-circle" aria-hidden="true"></i> 最高学历已认证，国家985（名牌）211（重点）');
						}else if(result.data.educationInfo.schoolInfo.is985 == true){
							$('div[data-name="highest"]').html('<i class="fa fa-check-circle" aria-hidden="true"></i> 最高学历已认证，国家985（名牌）');
						}else if(result.data.educationInfo.schoolInfo.is211 == true){
							$('div[data-name="highest"]').html('<i class="fa fa-check-circle" aria-hidden="true"></i> 最高学历已认证，国家211（重点）');
						}else{
							$('div[data-name="highest"]').html('<i class="fa fa-check-circle" aria-hidden="true"></i> 最高学历已认证，'+ result.data.educationInfo.educationDegree +'');
						}
					}
					
					//资格证书
					if(result.data.ostaInfos == undefined || result.data.ostaInfos == null || result.data.ostaInfos.length == 0){
						$('div[data-name="ostainN"]').toggleClass("hidden");
					}else{
						$('div[data-name="ostainY"]').toggleClass("hidden");
						$.each(result.data.ostaInfos, function (n, value) {
							count = n;
							var rq = value.banZhengRiQi;
							if (rq == null) {
								rq = "";
							}
							zyzghtml += '<div class="row row-report">'+
											'<p class="quit-txt"><b>证书详情</b></p>'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>证书编号：'+ value.certificateID +'</p>'+
												'<p>全国月平均工资（元）：'+ value.avgNationalSalary +'</p>'+
												'<p>发证机构：'+ value.submitOrgName +'</p>'+
											'</div>'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>职业名称：'+ value.occupation +'</p>'+
												'<p>发证日期：'+ rq +'</p>'+
												'<p>级别：'+ value.level +'</p>'+
											'</div>'+
										'</div>';
						});
						if((count +1)==1){
							zyzghtml += '<div class="row row-report">'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
										'</div>'+
										'<div id="d" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 当前已查得一项证书</div>';
						}
						if((count +1)==2){
							zyzghtml += '<div class="row row-report">'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
										'</div>'+
										'<div id="d" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 当前已查得二项证书</div>';
						}
						if((count +1)==3){
							zyzghtml += '<div class="row row-report">'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
										'</div>'+
										'<div id="d" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 当前已查得三项证书</div>';
						}
						if((count +1)==4){
							zyzghtml += '<div class="row row-report">'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate.jpg"></div>'+
											'</div>'+
										'</div>'+
										'<div id="d" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 当前已查得四项证书</div>';
						}
						if((count +1)==5){
							zyzghtml += '<div class="row row-report">'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
											'<div class="col-md-5ths col-xs-5ths">'+
												'<div class="certificate"><img src="img/certificate-in.jpg"></div>'+
											'</div>'+
										'</div>'+
										'<div id="d" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 当前已查得五项证书</div>';
						}
						
						
						$('div[data-name="ostainY"]').append(zyzghtml);
					}
					//关联投资
					if (type == 2) {
						//企业股东
						if(result.data.enterpriseInfo == undefined || result.data.enterpriseInfo == null){
							$('div[data-name="enterpriseN"]').toggleClass("hidden");
						}else{
							$('div[data-name="enterpriseY"]').toggleClass("hidden");
							if(result.data.enterpriseInfo.corporateShareholders == undefined || result.data.enterpriseInfo.corporateShareholders == null || result.data.enterpriseInfo.corporateShareholders.length == 0){
								
							}else{
								$.each(result.data.enterpriseInfo.corporateShareholders, function (n, value) {
									gstzhtml += '<div class="row row-report" >'+
													'<p class="quit-txt"><b>企业股东</b></p>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>查询人姓名：'+ value.ryName +'</p>'+
														'<p>注册号：'+ value.regNo +'</p>'+
														'<p>企业状态：'+ value.entStatus +'</p>'+
														'<p>注册资本(万元)：'+ value.regCap +'</p>'+
														'<p>认缴出资额(万元)：'+ value.subConam +'</p>'+
													'</div>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>企业(机构)名称：'+ value.entName +'</p>'+
														'<p>企业(机构)类型：'+ value.entType +'</p>'+
														'<p>注册资本币种：'+ value.regCapCur +'</p>'+
														'<p>认缴出币种：'+ value.currency +'</p>'+
													'</div>'+
												'</div>';
								});
							}
							
							//企业主要管理人员
							if(result.data.enterpriseInfo.corporateManagers == undefined || result.data.enterpriseInfo.corporateManagers == null || result.data.enterpriseInfo.corporateManagers.length == 0){
								
							}else{
								$.each(result.data.enterpriseInfo.corporateManagers, function (n, value) {
									gstzhtml += '<div class="row row-report">'+
													'<p class="quit-txt"><b>企业主要管理人员</b></p>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>查询人姓名：'+ value.ryName +'</p>'+
														'<p>注册号：'+ value.regNo +'</p>'+
														'<p>注册资本(万元)：'+ value.regCap +'</p>'+
														'<p>企业状态：'+ value.entStatus +'</p>'+
													'</div>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>企业(机构)名称：'+ value.entName +'</p>'+
														'<p>企业(机构)类型：'+ value.entType +'</p>'+
														'<p>注册资本币种：'+ value.regCapCur +'</p>'+
														'<p>职务：'+ value.position +'</p>'+
													'</div>'+
												'</div>';
								});
							}
							
							//企业法定代表人
							if(result.data.enterpriseInfo.corporates == undefined || result.data.enterpriseInfo.corporates == null || result.data.enterpriseInfo.corporates.length == 0){
								
							}else{
								$.each(result.data.enterpriseInfo.corporates, function (n, value) {
									gstzhtml += '<div class="row row-report">'+
													'<p class="quit-txt"><b>企业法定代表人</b></p>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>查询人姓名：'+ value.ryName +'</p>'+
														'<p>注册号：'+ value.regNo +'</p>'+
														'<p>注册资本(万元)：'+ value.regCap +'</p>'+
														'<p>企业状态：'+ value.entStatus +'</p>'+
													'</div>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>企业(机构)名称：'+ value.entName +'</p>'+
														'<p>企业(机构)类型：'+ value.entType +'</p>'+
														'<p>注册资本币种：'+ value.regCapCur +'</p>'+
													'</div>'+
												'</div>';
								});
							}
							
							//行政处罚历史记录
							if(result.data.enterpriseInfo.caseInfos == undefined || result.data.enterpriseInfo.caseInfos == null || result.data.enterpriseInfo.caseInfos.length == 0){
								
							}else{
								$.each(result.data.enterpriseInfo.caseInfos, function (n, value) {
									gstzhtml += '<div class="row row-report">'+
													'<p class="quit-txt"><b>行政处罚历史记录</b></p>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>案发时间：'+ value.caseTime +'</p>'+
														'<p>案由：'+ value.caseReason +'</p>'+
														'<p>案值：'+ value.caseVal +'</p>'+
														'<p>案件类型：'+ value.caseType +'</p>'+
														'<p>执行类别：'+ value.exeSort +'</p>'+
														'<p>案件结果：'+ value.caseResult +'</p>'+
														'<p>处罚决定文书：'+ value.penDecNo +'</p>'+
														'<p>处罚决定书签发日期：'+ value.penDecIssDate +'</p>'+
														'<p>做出行政处罚决定机关名：'+ value.penAuth +'</p>'+
													'</div>'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
														'<p>主要违法事实：'+ value.illegFact +'</p>'+
														'<p>处罚依据：'+ value.penBasis +'</p>'+
														'<p>处罚种类：'+ value.penType +'</p>'+
														'<p>处罚结果：'+ value.penResult +'</p>'+
														'<p>处罚金额：'+ value.penAm +'</p>'+
														'<p>处罚执行情况：'+ value.penExeSt +'</p>'+
														'<p>证件号：'+ value.cardNO +'</p>'+
														'<p>当事人：'+ value.name +'</p>'+
													'</div>'+
												'</div>';
								});
							}
							gstzhtml += '<div id="e" class="result result-suc"><i class="fa fa-check-circle" aria-hidden="true"></i> 工商投资信息已排查</div>';
							
							$('div[data-name="enterpriseY"]').append(gstzhtml);
						}
					}
				}
				
				//高危记录
				if (result.data.riskAssessInfo == undefined || result.data.riskAssessInfo == null || result.data.riskAssessInfo == "") {
					
				}else{
					if (result.data.riskAssessInfo.result ==2) {
						$('div[data-name="fxian"]').html('<i class="fa fa-check-circle" aria-hidden="true"></i> 高危评估结果：低风险');
					}else{
						$('.low').toggleClass("hidden");
						$('.high').toggleClass("hidden");
						$('div[data-name="fxian"]').toggleClass("result-fail");
						$('div[data-name="fxian"]').html('<i class="fa fa-question-circle" aria-hidden="true"></i> 高危评估结果：高风险');
					}
				}
				
				//风险六项 
				if(result.data.riskInfo == undefined || result.data.riskInfo == null || result.data.riskInfo == ""){
					
				}else{
					// 司法案例
					if (result.data.riskInfo.alCount > 0) {
						$('div[data-name="riskalY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskAlsInfos, function (n, value) {
							sfalhtml += '<div class="row row-report">'+
							
												'<p class="quit-txt"><b>标题：'+ value.bt +'</b></p>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>当事人姓名：'+ value.dsrxm +'</p>'+
												'<p>证件号码：'+ value.zjhm +'</p>'+
												'<p>性别：'+ value.xb +'</p>'+
												'<p>案件类型：'+ value.ajlx +'</p>'+
												'<p>审结日期：'+ value.sjrq +'</p>'+
												
											'</div>'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
												
												'<p>出生日期：'+ value.sr +'</p>'+
												'<p>法院名称：'+ value.fymc +'</p>'+
												'<p>案件字号：'+ value.ajzh +'</p>'+
												'<p>审理程序：'+ value.slcx +'</p>'+
												'<p>案由：'+ value.ay +'</p>'+
											'</div>'+
											
											'<div class="col-md-12 col-xs-12 quit-txt">'+
												'<p>判决结果：'+ value.pjjg +'</p>'+
												'</div>'+
											
										'</div>';
						});
						sfalhtml += '<div id="f" class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.alCount +'条司法案例记录！</div>';
						$('div[data-name="riskalY"]').append(sfalhtml);
					}else{
						$('div[data-name="riskalN"]').toggleClass("hidden");
					}
					
					// 司法执行
					if (result.data.riskInfo.zxCount > 0) {
						$('div[data-name="riskzxY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskZxsInfos, function (n, value) {
								sfzxhtml += '<div class="row row-report">'+

													'<p class="quit-txt"><b>被执行人：'+ value.bzxr +'</b></p>'+

													'<div class="col-md-6 col-xs-6 quit-txt">'+
													'<p>证件号码：'+ value.zjhm +'</p>'+
													'<p>案件状态：'+ value.ajzt +'</p>'+
													'<p>立案时间：'+ value.lasj +'</p>'+
													
												'</div>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
													'<p>案号：'+ value.ah +'</p>'+
													'<p>执行标的：'+ value.zxbd +'</p>'+
													'<p>执行法院：'+ value.zxfy +'</p>'+
												'</div>'+
											'</div>';
						});
						sfzxhtml += '<div id="g" class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.zxCount +'条司法执行记录！</div>';
						$('div[data-name="riskzxY"]').append(sfzxhtml);
					}else{
						$('div[data-name="riskzxN"]').toggleClass("hidden");
					}
					
					// 司法失信
					if (result.data.riskInfo.sxCount > 0) {
						$('div[data-name="risksxY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskSxsInfos, function (n, value) {
								sfsxhtml += '<div class="row row-report">'+
													'<div class="col-md-6 col-xs-6 quit-txt">'+
													'<p>被执行人：'+ value.bzxr +'</p>'+
													'<p>证件号码：'+ value.zjhm +'</p>'+
													'<p>性别：'+ value.xb +'</p>'+
													'<p>执行法院：'+ value.zxfy +'</p>'+
													'<p>发布时间：'+ value.fbsj +'</p>'+
													'<p>执行依据单位：'+ value.yjdw +'</p>'+
													'<p>已履行内容：'+ value.ylx +'</p>'+
												'</div>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
													'<p>执行依据文号：'+ value.yjwh +'</p>'+
													'<p>案号：'+ value.ah +'</p>'+
													'<p>年龄：'+ value.nl +'</p>'+
													'<p>省份：'+ value.sf +'</p>'+
													'<p>立案时间：'+ value.lasj +'</p>'+
													'<p>被执行人履行情况：'+ value.lxqk +'</p>'+
													'<p>未履行内容：'+ value.wlx +'</p>'+
												'</div>'+
												'<div class="col-md-12 col-xs-12 quit-txt">'+
												'<p>失信被执行人行为具体情形：'+ value.xwjtqx +'</p>'+
												'<p>生效法律文书确定的义务：'+ value.flwsyw +'</p>'+
												'</div>'+
											'</div>';
						});
						sfsxhtml += '<div id="h" class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.sxCount +'条司法失信记录！</div>';
						$('div[data-name="risksxY"]').append(sfsxhtml);
					}else{
						$('div[data-name="risksxN"]').toggleClass("hidden");
					}
					
					// 税务行政
					if (result.data.riskInfo.swCount > 0) {
						$('div[data-name="riskswxzY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskSwsInfos, function (n, value) {
							swxzhtml += '<div class="row row-report">'+
												'<p class="quit-txt"><b>标题：'+ value.bt +'</b></p>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>证件号码：'+ value.zjhm +'</p>'+
												'<p>法人姓名：'+ value.frxm +'</p>'+
											'</div>'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>公告时间：'+ value.ggsj +'</p>'+
												'<p>被执行人：'+ value.bzxr +'</p>'+
											'</div>'+
											
											'<div class="col-md-12 col-xs-12 quit-txt">'+
												'<p>经营地点：'+ value.jydd +'</p>'+
											'</div>'+
										'</div>';
						});
						swxzhtml += '<div id="i" class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.swCount +'条税务行政记录！</div>';
						$('div[data-name="riskswxzY"]').append(swxzhtml);
					}else{
						$('div[data-name="riskswxzN"]').toggleClass("hidden");
					}
					
					// 催欠公告
					if (result.data.riskInfo.cqggCount > 0) {
						$('div[data-name="riskcqY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskCqsInfos, function (n, value) {
							cqgghtml += '<div class="row row-report">'+
											'<p class="quit-txt"><b>标题：'+ value.bt +'</b></p>'+
											'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>被催欠人：'+ value.bcqr +'</p>'+
											'<p>状态：'+ value.zt +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>催欠金额：'+ value.cqje +'</p>'+
											'<p>发布时间：'+ value.fbsj +'</p>'+
										'</div>'+
									'</div>'+
									'<div class="row row-report">'+
										'<p class="quit-txt"><b>负责人</b></p>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>负责人姓名：'+ value.fzrXm +'</p>'+
											'<p>手机号码：'+ value.fzrSjhm +'</p>'+
											'<p>座机：'+ value.fzrZj +'</p>'+
											'<p>详细地址：'+ value.fzrXxdz +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>职务：'+ value.fzrZw +'</p>'+
											'<p>发布时间：'+ value.fzrFbjs +'</p>'+
											'<p>电子邮件：'+ value.fzrDzyj +'</p>'+
											'<p>地址：'+ value.fzrDz +'</p>'+
										'</div>'+
									'</div>'+
									'<div class="row row-report">'+
										'<p class="quit-txt"><b>担保经办人</b></p>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>担保经办人姓名：'+ value.dbjbrXm +'</p>'+
											'<p>性别：'+ value.dbjbrXb +'</p>'+
											'<p>座机：'+ value.dbjbrZj +'</p>'+
											'<p>详细地址：'+ value.dbjbrXxdz +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>证件号码：'+ value.dbjbrZj +'</p>'+
											'<p>手机号码：'+ value.dbjbrSjhm +'</p>'+
											'<p>电子邮件：'+ value.dbjbrDzyj +'</p>'+
											'<p>地址：'+ value.dbjbrDz +'</p>'+
										'</div>'+
									'</div>'+
									'<div class="row row-report">'+
										'<p class="quit-txt"><b>欠款经办人</b></p>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>欠款经办人姓名：'+ value.qkjbrXm +'</p>'+
											'<p>性别：'+ value.qkjbrXb +'</p>'+
											'<p>座机：'+ value.qkjbrZj +'</p>'+
											'<p>详细地址：'+ value.qkjbrXxdz +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>证件号码：'+ value.qkjbrSfzhm +'</p>'+
											'<p>手机号码：'+ value.qkjbrSjhm +'</p>'+
											'<p>电子邮件：'+ value.qkjbrDzyj +'</p>'+
											'<p>地址：'+ value.qkjbrDz +'</p>'+
										'</div>'+
									'</div>'+
									'<div class="row row-report">'+
										'<p class="quit-txt"><b>担保股东</b></p>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>担保股东姓名：'+ value.dbgdXm +'</p>'+
											'<p>性别：'+ value.dbgdXb +'</p>'+
											'<p>详细地址：'+ value.dbgdXxdz +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>证件号码：'+ value.dbgdSfzhm +'</p>'+
											'<p>座机：'+ value.dbgdZj +'</p>'+
											'<p>地址：'+ value.dbgdDz +'</p>'+
										'</div>'+
									'</div>'+
									'<div class="row row-report">'+
										'<p class="quit-txt"><b>欠款股东</b></p>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>欠款股东姓名：'+ value.qkgdXm +'</p>'+
											'<p>性别：'+ value.qkgdXb +'</p>'+
											'<p>详细地址：'+ value.qkgdXxdz +'</p>'+
										'</div>'+
										'<div class="col-md-6 col-xs-6 quit-txt">'+
											'<p>证件号码：'+ value.qkgdSfzhm +'</p>'+
											'<p>座机：'+ value.qkgdZj +'</p>'+
											'<p>地址：'+ value.qkgdDz +'</p>'+
										'</div>'+
									'</div>';
						});
						cqgghtml += '<div id="j" class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.cqggCount +'条催欠公告记录！</div>';
						$('div[data-name="riskcqY"]').append(cqgghtml);
					}else{
						$('div[data-name="riskcqN"]').toggleClass("hidden");
					}
					
					// 网贷逾期
					if (result.data.riskInfo.wdyqCount > 0) {
						$('div[data-name="riskyqY"]').toggleClass("hidden");
						$.each(result.data.riskInfo.riskWdyqsInfos, function (n, value) {
							wdyqhtml += '<div class="row row-report">'+
												'<p class="quit-txt"><b>标题：'+ value.bt +'</b></p>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>姓名：'+ value.xm +'</p>'+
												'<p>居住电话：'+ value.jzdh +'</p>'+
												'<p>贷款时间：'+ value.dksj +'</p>'+
												'<p>未还罚息：'+ value.whfx +'</p>'+
												'<p>更新时间：'+ value.gxsj +'</p>'+
											'</div>'+
												'<div class="col-md-6 col-xs-6 quit-txt">'+
												'<p>证件号码：'+ value.zfzh +'</p>'+
												'<p>籍贯地址：'+ value.jgdz +'</p>'+
												'<p>本金本息：'+ value.bjbx +'</p>'+
												'<p>已还金额：'+ value.yhje +'</p>'+
												'<p>还款状态：'+ value.hkzt +'</p>'+
											'</div>'+
											'<div class="col-md-12 col-xs-12 quit-txt">'+
												'<p>数据来源：'+ value.sjlydwmc +'</p>'+
											'</div>'+
										'</div>';
						});
						wdyqhtml += '<div class="result result-suc result-fail"><i class="fa fa-question-circle" aria-hidden="true"></i> 存在'+ result.data.riskInfo.wdyqCount +'条网贷逾期记录！</div>';
						$('div[data-name="riskyqY"]').append(wdyqhtml);
					}else{
						$('div[data-name="riskyqN"]').toggleClass("hidden");
					}
						
				}
				if(document.getElementById("div-print")!=null){
			    	watermark({
			    	    watermark_txt: $("input[name='dqCompanyName']").val() +" "+ $("input[name='dqrName']").val() +" "+ getNowDate()
			    	});
		   		}
			}
		}
	});
	
	function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
	
	function getNowDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        
        var currentdate = year + month + strDate + hour + minute + second;
        return currentdate;
    }
	
	
		
	

//			生成水印
			function watermark(settings, page_width, page_height) {
    	    var defaultSettings = {
    	        watermark_txt: "text",
    	        watermark_x: 120,
    	        watermark_y: 180,
    	        watermark_rows: 50,
    	        watermark_cols: 2,
    	        watermark_x_space: 160,
    	        watermark_y_space: 150,
    	        watermark_color: '#000',
    	        watermark_alpha: 0.1,
    	        watermark_fontsize: '16px',
    	        watermark_font: '微软雅黑',
    	        watermark_width: 280,
    	        watermark_height: 50,
    	        watermark_angle: 45
    	    };
    	    // 采用配置项替换默认值，作用类似jquery.extend
    	    if (arguments.length === 1 && typeof arguments[0] === "object") {
    	        var src = arguments[0] || {};
    	        for (var key in src) {
    	            if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
    	            else if (src[key]) defaultSettings[key] = src[key];
    	        }
    	    }
    	    var oTemp = document.createDocumentFragment();
    	    
    	    // 获取页面最大宽度
    	    var page_width = document.getElementById("div-print").offsetWidth;
    	    // 获取页面最大长度
    	    var page_height = document.getElementById("div-print").offsetHeight;


    	    // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    	    if (defaultSettings.watermark_cols == 0 || 　　　　 (parseInt(defaultSettings.watermark_x　　　　 + defaultSettings.watermark_width * defaultSettings.watermark_cols　　　　 + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1))　　　　 > page_width)) {
    	        defaultSettings.watermark_cols = 　　　　　　parseInt((page_width　　　　　　　　　　 - defaultSettings.watermark_x　　　　　　　　　　 + defaultSettings.watermark_x_space)　　　　　　　　　　 / (defaultSettings.watermark_width　　　　　　　　　　 + defaultSettings.watermark_x_space));
    	        defaultSettings.watermark_x_space = 　　　　　　parseInt((page_width　　　　　　　　　　 - defaultSettings.watermark_x　　　　　　　　　　 - defaultSettings.watermark_width　　　　　　　　　　 * defaultSettings.watermark_cols)　　　　　　　　　　 / (defaultSettings.watermark_cols - 1));
    	    }
    	    // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    	    if (defaultSettings.watermark_rows == 0 || 　　　　 (parseInt(defaultSettings.watermark_y　　　　 + defaultSettings.watermark_height * defaultSettings.watermark_rows　　　　 + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1))　　　　 > page_height)) {
    	        defaultSettings.watermark_rows = 　　　　　　parseInt((defaultSettings.watermark_y_space　　　　　　　　　　　 + page_height - defaultSettings.watermark_y)　　　　　　　　　　　 / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
    	        defaultSettings.watermark_y_space = 　　　　　　parseInt((page_height　　　　　　　　　　 - defaultSettings.watermark_y　　　　　　　　　　 - defaultSettings.watermark_height　　　　　　　　　　 * defaultSettings.watermark_rows)　　　　　　　　　 / (defaultSettings.watermark_rows - 1));
    	    }
    	    var x;
    	    var y;
    	    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    	        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    	        for (var j = 0; j < defaultSettings.watermark_cols; j++) {
    	            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

    	            var mask_div = document.createElement('div');
    	            mask_div.id = 'mask_div' + i + j;
    	            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
    	            // 设置水印div倾斜显示
    	            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
    	            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
    	            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
    	            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
    	            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
    	            mask_div.style.visibility = "";
    	            mask_div.style.position = "absolute";
    	            mask_div.style.left = x + 'px';
    	            mask_div.style.top = y + 'px';
    	            mask_div.style.overflow = "hidden";
    	            mask_div.style.zIndex = "999";
    	            // mask_div.style.border="solid #eee 1px";
    	            mask_div.style.opacity = defaultSettings.watermark_alpha;
    	            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
    	            mask_div.style.fontFamily = defaultSettings.watermark_font;
    	            mask_div.style.color = defaultSettings.watermark_color;
    	            mask_div.style.textAlign = "center";
    	            mask_div.style.width = defaultSettings.watermark_width + 'px';
    	            mask_div.style.height = defaultSettings.watermark_height + 'px';
    	            mask_div.style.display = "block";
    	            oTemp.appendChild(mask_div);
    	        };
    	    };
    	    document.getElementById("div-print").appendChild(oTemp);
    	}
       
	

	
});