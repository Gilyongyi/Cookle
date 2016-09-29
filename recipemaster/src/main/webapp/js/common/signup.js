var authKEY;
var email;

$(document).ready(function(){
	
	///// 회원가입 팝업창 가입 버튼 이벤트 /////
	$(document).on('click', '#signup-addBtn', function() {
		if( $('#signup-e-mail').val() == ""){
			swal('이메일을 입력해주세요');			
		}else if( $('#signup-userName').val() == ""){
			swal('닉네임을 입력해주세요');			
		}else if( $('#signup-password').val() == ""){
			swal('비밀번호를 입력해주세요');
		}else if($('#signup-password').val().length < 6){
			swal('비밀번호 6자리 이상 입력해주세요');			
		}else if( $('#signup-passwordCheck').val() == ""){
			swal('비밀번호 확인을 입력해주세요');	
		}
		if($('#signup-e-mail').val() != "" && $('#signup-userName').val() != "" &&
		   $('#signup-password').val() != "" && $('#signup-passwordCheck').val() != "" && $('#signup-password').val().length > 5){
			$.ajax({
				url : contextRoot+'user/add.json',
				method : 'post',
				async:false,
				data : {
					email : $('#signup-e-mail').val(),
					userName : $('#signup-userName').val(),
					password : $('#signup-password').val(),		
					passwordCheck : $('#signup-passwordCheck').val()
				},
				dataType : 'json',
				success : function(result) {				
					// 중복된 이메일이거나 형식 오류일 경우
					if (result.status != 'success') {
						return;
					} 				
					authKEY=result.authKEY;
					
					//인증추가
					 email = $('#signup-e-mail').val();
					if (authKEY!=null) {
						$.ajax({
				            	type : 'GET',
				                url : getNodeContextRoot('8888')+'user/authentication.do?email='+email+'&authKEY='+authKEY,
				                success : function(result) {					
									swal('이메일 전송완료');
				                } // end success
								
				           	 }); // end ajax
					
					}
					$('#signup-pop-up-banner').bPopup().close(); // 팝업창 닫기
					$('#signup-e-mail').val('');
					$('#signup-userName').val('');
					$('#signup-password').val('');
					$('#signup-passwordCheck').val('');
					$('#signup-e-mail-label').text('');
					$('#signup-userName-label').text('');			
					$('#signup-password-label').text('');
					$('#signup-passwordCheck-label').text('');
				}
			});	
			            
		}
		
	});
	
	///// 회원가입 팝업창 취소 이벤트 /////
	$(document).on('click', '#signup-resetBtn', function() {
		event.preventDefault();
		$('#signup-pop-up-banner').bPopup().close(); // 팝업창 닫기
		$('#signup-e-mail').val('');
		$('#signup-userName').val('');
		$('#signup-password').val('');
		$('#signup-passwordCheck').val('');
		$('#signup-e-mail-label').text('');
		$('#signup-userName-label').text('');			
		$('#signup-password-label').text('');
		$('#signup-passwordCheck-label').text('');
	});
	
	///// 이메일 유효성 검사 및 중복검사 /////
    $('#signup-e-mail').on('keyup', function(){ 
        var email = $(this).val();        
        // 값을 입력안한경우는 아예 체크를 하지 않는다.
        if( email == '' || email == 'undefined') return;
 
        // 이메일 유효성 검사
        if(! email_check(email) ) {
        	/*swal('잘못된 형식의 이메일 주소입니다.');*/
        	checkLable('signup-e-mail-label', '잘못된 형식의 이메일 주소입니다.', 'red');        	
            $(this).focus();
            return false;
        } else {
        	///// node.js를 이용한 이메일 중복검사 테스트 /////	        	    
	        if ( $('#signup-e-mail').val().length > 6) {
	          var email = $(this).val();
	            $.ajax({
	            	type : 'GET',
	                url : getNodeContextRoot('9999')+'user/checkDuplication.do?email='+email,
	                success : function(result) {					
	                    if (result == 'true') {
							// 사용가능한 이메일
							checkLable('signup-e-mail-label', '사용가능한 이메일입니다.', '#23B200');
	                    } else {
							// 중복된 이메일
							checkLable('signup-e-mail-label', '중복된 이메일입니다.', 'red');
							$(this).focus();
	                    }
	                } // end success
	            }); // end ajax
			} else {
				$('#signup-e-mail-label').val('');
			} // end if        	
        }
    });	
	
	///// 닉네임 중복 체크 /////	
    $('#signup-userName').keyup(function(){	
        if ( $('#signup-userName').val().length > 2) {
          var userName = $(this).val();
            $.ajax({
            	type : 'POST',
                url : contextRoot+'user/checkDuplicationUserName.json',
                data:
                {
                    userName : userName
                },
                success : function(result) {					
                    if (result.data) { 
						// 사용가능한 이메일
						checkLable('signup-userName-label', '사용가능한 닉네임입니다.', '#23B200');
                    } else {
						// 중복된 이메일
						checkLable('signup-userName-label', '중복된 닉네임입니다.', 'red');				
                    }
                } // end success
            }); // end ajax
		} else {
			$('#signup-userName-label').text('');
		} // end if
    }); // end keyup

	///// 비밀번호 체크 /////
    $('#signup-password').keyup(function(){	
        if ( $('#signup-password').val().length > 5 ) {
			$('#signup-password-label').text('');          				
        } else if ( $('#signup-password').val().length >= 0 ) {
			checkLable('signup-password-label', '6자리 이상 입력해주세요', 'red');
		} 
    }); // end keyup

    ///// 비밀번호 확인 체크 /////
    $('#signup-passwordCheck').keyup(function(){	
        if ( $('#signup-passwordCheck').val() == $('#signup-password').val() ) {
			checkLable('signup-passwordCheck-label', '일치합니다', '#23B200');
        } else {
			checkLable('signup-passwordCheck-label', '일치하지 않습니다.', 'red');
		} // end if
    }); // end keyup

	//비밀번호 찾기
	$(document).on('click', '#findPassword', function(event){
		event.preventDefault();
		$('#login-pop-up-banner').bPopup().close();
		$('#findPassword-pop-up-banner').bPopup();
		$('#findPassword-userEmail').focus();
		$(document).on('click', '#pushEmail', function(){
			if($('#findPassword-userEmail').val() == ''){
				swal('이메일을 입력해주세요.');		
				return;
			}
			var password;
			var email=$('#findPassword-userEmail').val();
			swal(email);
			$.ajax({
            	type : 'GET',
                url : getNodeContextRoot('8282')+'user/pushEmail.do?email='+email,
                success : function(result) {					
					swal('이메일 전송완료');
					$(document).on('click', '.confirm', function(){
						location.reload();
					});
                },error : function() {
					swal('error');
					}
           	 }); // end ajax
			$('#findPassword-pop-up-banner').bPopup().close();
		});
	});
});

///// 정규표현식 검사 함수 /////
function email_check( email ) {    
    var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return (email != '' && email != 'undefined' && regex.test(email) === true); 
}

function checkLable(id, text, color){
	$('#'+id).text('');
	$('#'+id).css('color', color);
	$('#'+id).text(text);  
}