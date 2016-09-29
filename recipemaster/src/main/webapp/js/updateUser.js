document.write('<script type"text/javascript" src="js/login.js"></script>')
$(function(){
	
	var userInfo = getUserInfo();
	
	var profileImage = new Array();
	profileImage[0] = new File([""], "");
	
	$('#userInfoEditBtn').on('click', function(event) {
		event.preventDefault();
		console.log(userInfo);
		$('#editUserInfo-pop-up-banner').bPopup();
		if (userInfo.userNo != null) {
			$('#updateBoxEmail').text(userInfo.email);
			$('#updateBoxName').text(userInfo.userName);
			$('#updateBoxGrade').text(userInfo.grade);
			$('#profileGrade').text(userInfo.grade);
			$('#updateFormUserNo').val(userInfo.userNo);
			$('#updateFormEmail').val(userInfo.email);
			$('#introduce').val(userInfo.intro);
			$('.rcp-up-preview').html('');
			$('.rcp-up-preview').append($('<img style="width: 111.44px; height:111.44px;" src="img/profileImg/'+userInfo.image+'">'));
		}
	});

	$('#profileImage').fileupload({
		dataType: 'json',
		autoUpload: false,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		maxFileSize: 999000
		// Enable image resizing, except for Android and Opera,
		// which actually support image resizing, but fail to
		// send Blob objects via XHR requests:
	}).on('fileuploadadd', function (e, data) {
		profileImage[0] = data.files[0];
		$('.rcp-up-preview').html('');
		$('.rcp-up-preview').append($('<img style="width: 111.44px; height:111.44px;" src="'+URL.createObjectURL(profileImage[0])+'">'));
	}).on('fileuploaddone', function (e, data) {
		if (data.result.status == 'pwdFail'){
			$('#beforePwd-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-error has-feedback");
			swal('이전 비밀번호 불일치');
			$('#beforePwd').focus();
			return;
		} else if(data.result.status == 'failure'){
			swal('서버 오류');
			return;
		} 
		swal('정보수정 완료');
		location.reload();
		    	
    }).on('fileuploadfail', function (e, data) {
    	alert('여기다여기!!!');
    }).prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');

	$("#updateUserForm").submit(function(event) {
		var formData = new FormData(this);
		var formURL = $(this).attr("action");
		
		if (profileImage.length > 0) {
			event.preventDefault();
			$('#profileImage').fileupload('send', {
				files : profileImage
			});
		} 
	});

	$(document).on('click', '#updateUserInfo', function(event){
		
		console.log($('#beforePwd').val()=="");
		console.log($('#afterPwd').val()=="");
		console.log($('#afterPwdcf').val()=="");
		
		if($('#beforePwd').val()==""  && $('#afterPwd').val()=="" && $('#afterPwdcf').val()==""){
			console.log('드디덩');
		} else {
			if( $('#beforePwd').val() == "" || $('#beforePwd').val() == null){
				swal('이전비밀번호를 입력해주세요');
				return;
			}else if( $('#afterPwd').val() == "" || $('#afterPwd').val() == null){
				swal('변경할 비밀번호를 입력해주세요');
				return;
			}else if( $('#afterPwdcf').val() == "" || $('#afterPwdcf').val() == null){
				swal('변경할 비밀번호확인을 입력해주세요');
				return;
			} else if($('#afterPwd').val()!=$('#afterPwdcf').val()){
				swal('변경 비밀번호 불일치');
				return;
			}
		}
		$('#updateUserForm').attr('action', contextRoot+'user/update.json');
		$('#updateUserForm').submit();

//		$.post('/user/update.json', {
//			userNo : $('#updateFormUserNo').val(),
//			email : $('#updateFormEmail').val(),
//			bfPwd : $('#beforePwd').val(),
//			password : $('#afterPwd').val(),
//			intro : $('#introduce').val(),
//		}, function(result) {   	  
//			if (result.status == 'pwdFail'){
//				$('#beforePwd-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-error has-feedback");
//				alert('이전 비밀번호 불일치');
//				$('#beforePwd').focus();
//				return;
//			} else if(result.status == 'failure'){
//				alert('서버 오류');
//				return;
//			} else {
//				alert('정보수정 완료');
//				$('#editUserInfo-pop-up-banner').bPopup().close();
//			}
//		}, 'json');
	});

	/* 비밀번호 폼 색상변화 */
	$('#afterPwd').keyup(function(){
		if($('#afterPwd').val().length>5){
			$('#afterPwd-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-success has-feedback");
		}else if($('#afterPwd').val().length>0){
			$('#afterPwd-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-error has-feedback");
		}else{
			$('#afterPwd-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-warning has-feedback")
		}
	})

	$('#afterPwdcf').keyup(function(){
		if($('#afterPwdcf').val()==$('#afterPwd').val()){
			$('#afterPwdcf-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-success has-feedback");
		}else{
			$('#afterPwdcf-div').removeClass().addClass("rcp-mar rcp-info form-group form-group-md has-error has-feedback")
		}
	})


	$('#updateUserReset').click(function(event){
		event.preventDefault();
		$('#editUserInfo-pop-up-banner').bPopup().close();
	});
});


