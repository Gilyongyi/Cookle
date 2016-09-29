$(function() {
	$('#profileView').removeClass().addClass(
			"main-nav__dropdown top-main-nav__dropdown profile-dropdown");

	/* 로그아웃 버튼 */
	$(document).on('click', '#logoutBtn', function() {
		logout(event);
		$(location).attr('href', contextRoot);
	});

	$(window)
			.on(
					'scroll',
					function(event) {
						var lastScrollTop = 0;
						var st = $(this).scrollTop();

						if (st <= 50) {
							$('#profileView')
									.removeClass()
									.addClass(
											"main-nav__dropdown top-main-nav__dropdown profile-dropdown");
						} else {
							$('#profileView')
									.removeClass()
									.addClass(
											"main-nav__dropdown bottom-main-nav__dropdown profile-dropdown");
						}
						lastScrollTop = st;
					});

	$(document).on('click', '#userLogin', function() {
		if ($('#userEmail').val() == '') {
			swal('이메일을 입력해주세요.');
			return;
		} else if ($('#userPassword').val() == '') {
			swal('패스워드를 입력해주세요.');
			return;
		}
		login(event);
	});

	// 로그인 버튼 누를시 포커스
	$(document).on('click', '#loginBtn', function() {
		document.getElementById("userEmail").focus();
	});

	$(document).on('click', '#topbarUserImg', function() {
		document.getElementById("userEmail").focus();
	});

	$(document).on('keyup', '#userEmail', function() {
		if (event.keyCode == 9) {
			document.getElementById("userPassword").focus();
		}
		if (event.keyCode == 13) {
			if ($('#userPassword').val() == '') {
				swal('패스워드를 입력해주세요.');
				document.getElementById("userPassword").focus();
			}
		}
	});

	$(document).on('keyup', '#userPassword', function() {
		if (event.keyCode == 13) {
			if ($('#userPassword').val() == '') {
				swal('패스워드를 입력해주세요.');
				document.getElementById("userPassword").focus();
			}
			login(event);
		}
	});

	$(document).on('click', '.dropdown-trigger', function(event) {
		event.preventDefault();
		dropdownClick('.profile-dropdown', '.mobile-menu-dropdown');
		/* 용이 추가() */
		if (userInfo.userNo != null) {
			$('#profileEmail').text(userInfo.email);
			$('#profileName').text(userInfo.userName);
			$('#profileGrade').html(userInfo.grade);
			/* 용이 추가() */
			$('#introduce').text(userInfo.intro);

			$('#profileImg').attr('src', 'img/profileImg/' + userInfo.image);
		}
	});

	// start of 쉐프카드
});

function getUserInfo() {
	var obj = loginCheck().responseJSON;
	if (obj.status != 'success') {
		return;
	}

	var userInfo = {
		userNo : obj.data.userNo,
		userName : obj.data.userName,
		email : obj.data.email,
		image : obj.data.image,
		intro : obj.data.intro,
		role : obj.data.role,
		joinDate : obj.data.joinDate,
		recipeUrl : obj.data.recipeUrl,
		recipeCount : obj.data.recipeCount,
		subsCount : obj.data.subsCount,
		grade : obj.data.grade
	};

	$('#mainNav').html('');
	$('#signUpTopBtn').remove();
	$('#mainNav')
			.append(
					$('<li id="writeRecipe" class="margin_right_10px activedropdown-full-color dropdown-secondary"><a href='+contextRoot+'mypage.html?'+(userInfo==null?null:userInfo.email)+' class="padding_6px dropdown__header"><img id="profileImg"'
							+'class="rcp-img img-circle" src="img/profileImg/'+(userInfo.image==null || userInfo.image == '' ?'default.jpg':userInfo.image)+'"/>'+(userInfo==null?null:userInfo.userName)+'</a></li>'));
	$('#mainNav')
			.append(
					$('<li id="writeRecipe" class="dropdown-full-color dropdown-secondary"><a href='+contextRoot+'writerecipe.html>레시피 등록</a></li> '));
	$('#mainNav')
	.append(
			$('<li id="logoutBtn" class="dropdown-full-color dropdown-secondary"><a href="#">로그아웃</a></li> '));
	// $('#loginIcon').html('<img id="loginIconAction1" class="rcp-barimg
	// dropdown-trigger img-circle" src="img/profileImg/'+userInfo.image+'"
	// />');
	// $('#topbarUserImg').html('<img id="loginIconAction2" class="rcp-barimg
	// dropdown-trigger img-circle" src="img/profileImg/'+userInfo.image+'"
	// />');

	return userInfo;
}

function loginCheck() {
	return $.ajax({
		url : contextRoot+'user/loginCheck.json',
		method : 'get',
		dataType : 'json',
		async : false
	});
}; /* end of jquery */

// logout
function logout(event) {
	event.preventDefault();
	$.ajax({
		url : contextRoot+'/user/logout.json',
		method : 'get',
		dataType : 'json',
		success : function(result) {
			if (result.status == 'failure') {
				swal('로그아웃 실패!!');
				return

			}
			if (result.status == 'success') {
				userInfo = null;
			} else {
				swal('서버 요청 오류');
			}
		},
		error : function() {
			swal('서버 요청 오류');
		}
	}); /* end of ajax */
}; /* end of jquery */

function login(event) {
	event.preventDefault();

	$.ajax({
		url : contextRoot+'/user/login.json',
		method : 'post',
		dataType : 'json',
		data : {
			email : $('#userEmail').val(),
			password : $('#userPassword').val()
		},
		success : function(result) {
			if (result.status == 'failure') {

				swal('잘못입력하셨습니다.', '아이디 또는 비밀번호를 다시 확인하여 주세요.', "error");

				return;
			} else if (result.status == 'authError') {
				swal('인증이 되지 않은 ID입니다.', 'email 인증을 확인하여 주세요.', "error");

				return;
			} else if (result.status == 'null') {
				swal('등록되지 않은 ID입니다.', 'email을 다시 확인하여 주세요.', "error");

				return;
			} else if (result.status == 'success') {
				location.reload();
				$('#login-pop-up-banner').bPopup().close();
			} else {
				swal('잘못입력하셨습니다.', '아이디 또는 비밀번호를 다시 확인하여 주세요.', "error");
			}

		},
		error : function() {
			swal('서버 요청 오류');
		}
	}); /* end of ajax */
}; /* end of jquery */

/*$('#TopBtn').on('click', function(){
 $('#login-pop-up-banner').bPopup();
 });*/
