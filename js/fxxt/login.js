$(document).ready(function(){
	//点击倒计时60s
	$(".send-code").on("click",function(res){

		//var phoneName 	= $("input[name='phone_name']").val().trim(); 	//手机号码
		var email 		= $("input[name='email']").val().trim(); 		//邮箱
		var seccode 	= $("input[name='seccode']").val().trim();
		var preg		= /^[0-9]*$/;//简单的方法 判断是否是数字
		var flag		= 'register'; //手机验证码格式统一
		var target 		= res.currentTarget;

		var sendType = $(target).data('send'); //值1短信登录 2邮箱注册 3手机注册

		if($(target).data('clickType')){

			return false;
		}

		if(sendType == 2){ //邮箱注册 获取邮箱验证码
			var emailType = 1;//邮箱验证码类型
			var regMail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;


			if(email == ""){
				msgText(msg_email_blank);return false;
			}else if(!regMail.test(email)){
				msgText(msg_email_format);return false;
			}

			$(".showMsg").hide();

			var interTime = 60;
			$(target).data('clickType',true);
			var timeInt = setInterval(function(){
				if(interTime>0){
					interTime--
					$(target).text(interTime+' S');
					$(target).css('color','#f50');
				}else{
					$(target).data('clickType',false);
					$(target).text('Obtener código');
					$(target).css('color','#666');
					clearInterval(timeInt);
				}
			},1000);
			
			//ur_r唯一标识
			var uv_r 	= $("input[name='uv_r']").val().trim();
			$.ajax({
				url:"user.php?act=user_email_send",
				type:"post",
				data: {type:emailType, email:email, uv_r:uv_r},
				dataType: "json",
				success:function(result){
					if(result != 'ok'){
						$(target).data('clickType',false);
						$(target).text('Obtener código');
						$(target).css('color','#666');
						clearInterval(timeInt);
						
						$(".showMsg").show();
						$(".wrong_msg").text(result);return false;
					}
				},
			});

		}else{ //短信登录 手机注册 获取手机验证码
			if(sendType == 3){ //值1短信登录 3手机注册
				phoneName 	= $("input[name='register_phone']").val().trim(); 	//手机号码
			}
			if(phoneName.length == 0){ //手机号不能为空
				msgText(msg_phone_blank);return false;
			}

			if(!preg.test(phoneName)){ //手机号纯数字
				msgText(msg_phone_invalid);return false;
			}

			if(phoneName.length!=10){ //墨西哥 手机号只能10位
				msgText(msg_phone_invalid);return false;
			}

			$(".showMsg").hide();
			$(target).data('clickType',true);

			//值1短信登录 3手机注册 手机注册需要设置flag为register
			var sendUrl = 'sms/sms.php?act=send';
			sendUrl += (sendType == 3) ? '&flag=register': '';
			$.ajax({
				url: sendUrl,
				type: "post",
				data: {mobile:phoneName, seccode:seccode},
				dataType: "json",
				success:function(result){

					if(result.code==2){
						var interTime = 60;
						$(target).data('clickType',true);
						var timeInt = setInterval(function(){
							if(interTime>0){
								interTime--
								$(target).text(interTime+' S');
								$(target).css('color','#f50');
							}else{
								$(target).data('clickType',false);
								$(target).text('Obtener código');
								$(target).css('color','#666');
								clearInterval(timeInt);
							}
						},1000);
					}else{
						if(!result.msg){
							result.msg = 'No se pudo enviar el código de verificación';
						}
						msgText(result.msg);return false;
					}
				},
			});
		}
	})
	
	//使用js获取cookie中ur_r唯一标识，如果不存在，生成唯一标识，js写入cookie，并将唯一标识赋给隐藏表单。
	 var _uuid = getUUID();
	 if(getCookie("_UUID_UV")!=null && getCookie("_UUID_UV")!=undefined)
	 {
		 _uuid = getCookie("_UUID_UV");
	 }else{
		 setCookie("_UUID_UV",_uuid);
	 }
	 //document.getElementById("uv_r").value = _uuid;//赋给hidden表单
});


 //生成唯一标识
 function getUUID()
 {
	 var uuid = new Date().getTime();
	 var randomNum =parseInt(Math.random()*1000);
	 return uuid+randomNum.toString();
 }
//写cookie
 function setCookie(name,value)
 {
	 var Days = 365;//这里设置cookie存在时间为一年
	 var exp = new Date();
	 exp.setTime(exp.getTime() + Days*24*60*60*1000);
	 document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
 }
 //获取cookie
 function getCookie(name)
 {
	 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	 if(arr=document.cookie.match(reg))
		 return unescape(arr[2]);
	 else
		 return null;
 }


//登录提交表单
function userLogin(){
	var loginName 		= $("input[name='userName']").val().trim(); //用户名
	var loginPassword 	= $("input[name='passWord']").val().trim(); //密码
	// var back_act 		= $("input[name='back_act']").val().trim(); //返回地址
	// var dsc_token 		= $("input[name='dsc_token']").val().trim(); //token
	//var phoneName 		= $("input[name='phone_name']").val().trim(); //手机号码
	//var loginPhonecode 	= $("input[name='login-phone-code']").val().trim();  //手机号登录验证码

	if(loginName.length == 0){ //用户名不能为空
		mui.toast("用户名不能不填");return false;
	}

	if(loginName.length < 4){ //用户名不能少于4个字符
		mui.toast("用户名字符少于4");return false;
	}
	if(loginPassword.length == 0){ //登录密码必填
		mui.toast("密码不能不填");return false;
	}
	if(loginPassword.length < 6){ //登录密码不能少于6个字符
		mui.toast("密码少于6个字符");return false;
	}else{
		//ajax提交
		$.ajax({
			url:"user.php?act=act_login",
			type:"post",
			data: {username:loginName, password:loginPassword, dsc_token:dsc_token, back_act:back_act},
			dataType: "json",
			success:function(result){
				if(result.error>0) {
					mui.toast(result.message);return false;
				} else {
					if(result.is_validated == 1){
						location.href = result.url;
					}else{
						location.href = "user.php?act=user_email_verify";
					}
				}
			},
		});
	}

}
//注册表单提交
function userRegister(){
	var registerEamil = $("input[name='email']").val().trim();
	var emailCode = $("input[name='email-code']").val();
	var registerPhone = $("input[name='register_phone']").val().trim();
	var phoneCode = $("input[name='reg-phone-code']").val();
	var firstPass = $("input[name='firstPass1']").val();
	var secPass = $("input[name='confirm_password']").val();
	var seccode = $("input[name='seccode']").val();

	var act_register = $("input[name='act_register']").val();
	var regMail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	var preg=/^[0-9]*$/;
	var text = $("#register_wrong").text('');

	//定义参数 START
	var flag='register';
	var act='act_register';
	var register_mode='1';
	var register_type; //注册类型 0邮箱 1手机
	//定义参数 END
	$(".showMsg").hide();

	var acceptTerms_checked = $("input[name='acceptTerms']").prop("checked");
	//默认选中状态，不选择则默认不提交
	if(!acceptTerms_checked){
		msgText(agreement);return false;
	}

	if(act_register == 'get_pwd_email'){
		register_type = 0;
		if(registerEamil.length <= 0){
			msgText(msg_email_blank);return false;
		}else if(!regMail.test(registerEamil)){
			msgText(msg_email_format);return false;
		}else if(emailCode.length <= 0){
			msgText(msg_email_code);return false;
		}else if(firstPass.length==0 || secPass.lenght==0){
			msgText(password_empty);return false;
		}else if(firstPass != secPass){
			msgText(confirm_password_invalid);return false;
		}else{
			//ajax
			$.ajax({
				url:"user.php?act=act_register",
				type:"post",
				data: {
					email:registerEamil, send_code:emailCode, password:firstPass,
					confirm_password:secPass, flag:flag, register_type:register_type,
					seccode:seccode, register_mode:register_mode, is_ajax:1},
				dataType: "json",
				success:function(result){
					console.log(result);
					if(result == 'ok'){
						location.href = "user.php";
					}else{
						msgText(result);return false;
					}
				},
			});
		}
	}else{
		register_type = 1;
		if(registerPhone.length>0){

			if(preg.test(registerPhone)){
				if(registerPhone.length!=10){
					msgText(msg_phone_invalid);return false;
				}else{
					if(phoneCode.length<=0){
						msgText(msg_mobile_code_blank);return false;
					}else if(firstPass.length==0 || secPass.lenght==0){
						msgText(password_empty);return false;
					}else if(firstPass != secPass){
						msgText(confirm_password_invalid);return false;
					}else{
						//ajax注册
						$.ajax({
							url:"user.php?act=act_register",
							type:"post",
							data: {
								mobile_phone:registerPhone, mobile_code:phoneCode, password:firstPass,
								confirm_password:secPass, flag:flag, register_type:register_type,
								seccode:seccode, register_mode:register_mode, is_ajax:1},
							dataType: "json",
							success:function(result){
								console.log(result);
								if(result == 'ok'){
									location.href = "user.php";
								}else{
									msgText(result);return false;
								}
							},
						});
					}
				}
			}else{
				msgText(msg_phone_invalid);return false;
			}
		}else{
			msgText(msg_phone_blank);return false;
		}
	}
}
	