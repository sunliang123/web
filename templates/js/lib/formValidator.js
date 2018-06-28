(function($) {
    FormValidation.Validator.idCardNo = {
		html5Attributes: {
            notempty: 'notEmpty',
        },
        
        /* 省,直辖市代码表 */
        provinceAndCitys: {
            11 : "北京",12 : "天津",13 : "河北",14 : "山西",15 : "内蒙古",
            21 : "辽宁",22 : "吉林",23 : "黑龙江",31 : "上海",32 : "江苏",
            33 : "浙江",34 : "安徽",35 : "福建",36 : "江西",37 : "山东",
            41 : "河南",42 : "湖北",43 : "湖南",44 : "广东",45 : "广西",
            46 : "海南",50 : "重庆",51 : "四川",52 : "贵州",53 : "云南",
            54 : "西藏",61 : "陕西",62 : "甘肃",63 : "青海",64 : "宁夏",
            65 : "新疆",71 : "台湾",81 : "香港",82 : "澳门",91 : "国外"
        },

        /* 每位加权因子 */
        powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

        /* 第18位校检码 */
        parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],
    	
        /**
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field The jQuery object represents the field element
         * @param {Object} options The validator options
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
        	var idCardNo = $field.val();
        	
        	if (idCardNo === '') {
	            return {
	                valid: options.notEmpty ? false : true,
	                message: '请输入身份证'
	            }
            }
        	
        	/* 校验15位或18位的身份证号码 */// 15位和18位身份证号码的基本校验
            if (!/^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo)) 
            	return {
	                valid: false,
	                message: '身份证格式不正确'
	            }
            
            // 判断长度为15位或18位
            if (idCardNo.length == 15) {  // 校验15位的身份证号码
            	var check = this.check15IdCardNo(idCardNo);
            	if (!check) 
                 	return {
     	                valid: false,
     	                message: '身份证格式不正确'
     	            }
            } else if (idCardNo.length == 18) {  // 校验18位的身份证号码
            	var check = this.check18IdCardNo(idCardNo);
            	if (!check) 
                  	return {
      	                valid: false,
      	                message: '身份证格式不正确'
      	            }
            } else {
            	return {
	                valid: false,
	                message: '身份证格式不正确'
	            }
            }
            return true;
        },
        
        // 校验15位的身份证号码
        check15IdCardNo: function(idCardNo) {
        	// 15位身份证号码的基本校验
            var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
            if (!check) return false;
            // 校验地址码
            var addressCode = idCardNo.substring(0, 6);
            check = this.checkAddressCode(addressCode);
            if (!check) return false;
            var birDayCode = '19' + idCardNo.substring(6, 12);
            // 校验日期码
            return this.checkBirthDayCode(birDayCode);
        },

        // 校验18位的身份证号码
        check18IdCardNo: function(idCardNo) {
        	// 18位身份证号码的基本格式校验
            var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
            if (!check) return false;
            // 校验地址码
            var addressCode = idCardNo.substring(0, 6);
            check = this.checkAddressCode(addressCode);
            if (!check) return false;
            // 校验日期码
            var birDayCode = idCardNo.substring(6, 14);
            check = this.checkBirthDayCode(birDayCode);
            if (!check) return false;
            // 验证校检码
            return this.checkParityBit(idCardNo);
        },
        
        /* 验证校检码 */
        checkParityBit: function(idCardNo) {
            var parityBit = idCardNo.charAt(17).toUpperCase();
            if (this.getParityBit(idCardNo) == parityBit) {
                return true;
            } else {
                return false;
            }
        },
        
        /* 校验地址码 */
        checkAddressCode: function(addressCode) {
            var check = /^[1-9]\d{5}$/.test(addressCode);
            if (!check) return false;
            if (this.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
                return true;
            } else {
                return false;
            }
        },

        /* 校验日期码 */
        checkBirthDayCode: function(birDayCode) {
            var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
            if (!check) return false;
            var yyyy = parseInt(birDayCode.substring(0, 4), 10);
            var mm = parseInt(birDayCode.substring(4, 6), 10);
            var dd = parseInt(birDayCode.substring(6), 10);
            var xdata = new Date(yyyy, mm - 1, dd);
            if (xdata > new Date()) {
                return false; // 生日不能大于当前日期
            } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
                return true;
            } else {
                return false;
            }
        },
    	
        /* 计算校检码 */
        getParityBit: function(idCardNo) {
            var id17 = idCardNo.substring(0, 17);
            /* 加权 */
            var power = 0;
            for (var i = 0; i < 17; i++) {
                power += parseInt(id17.charAt(i), 10) * parseInt(this.powers[i]);
            }
            /* 取模 */
            var mod = power % 11;
            return this.parityBit[mod];
        },
    };
    
    FormValidation.Validator.mobile = {
		html5Attributes: {
            notempty: 'notEmpty',
        },
        
    	validate: function(validator, $field, options) {
    		var mobile = $field.val();
         	
         	if (mobile === '') {
 	            return {
 	                valid: options.notEmpty ? false : true,
 	                message: '请输入手机号码'
 	            }
            }
         	
         	var check =/^((13[0-9])|(15[^4,\D])|(17[0-9])|(18[0-9]))\d{8}$/.test(mobile);
         	
         	if (!check){
         		return {
 	                valid: false,
 	                message: '手机格式不正确'
 	            }
         	}
         	return true;  
    	},
    };
}(window.jQuery));