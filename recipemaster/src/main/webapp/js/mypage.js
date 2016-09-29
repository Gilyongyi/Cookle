document.write('<script type"text/javascript" src="js/common.js"></script>')
document.write('<script type"text/javascript" src="js/recipeDetail.js"></script>')


var sourceVisitor = $('#visitor-template').html();
var templateVisitor = Handlebars.compile(sourceVisitor);
var userInfo = getUserInfo();
$(function() {

	//recipeDetail();
	
	$('.header-body').load('topNavBar.html');

	push((userInfo==null ? null:userInfo.email),'','login');

	pageLoadFunction();
	mouseMoveEventForSubscribeImage();
	likeLogic();
	scrapLogic();
	checkSubScribeFunction();
	subScribeFunction();
	pageTabs();
	loadMyPage();
	topBarFunction();
	visitFunction();
	handlebarsFunction();
	visitWriteFormFunction();
});


function pageLoadFunction(){
	$('#userInfoEditBtn').addClass('display_none');

	if((userInfo==null?null:userInfo.email)==location.href.split('?')[1]){
		$('#userInfoEditBtn').removeClass('display_none');
	} else {
		// checkSubscribe
		$.ajax({
			url : contextRoot+'recipe/checkSubscribe.json',
			datatype : 'json',
			data : {
				email : location.href.split('?')[1]
			},
			method : 'post',
			success : function(result) {

				if (result.status == 'false') {
					$('#subsWrapper').removeClass('display_none');
					// swal('실행 중 오류 발생');
					return;
				}
				$('.subscribeBtn-text').text('구독중');
				$('.subscribeBtn').addClass('subsactive');
				if((userInfo==null?null:userInfo.email)!=location.href.split('?')[1]){
					$('#subsWrapper').removeClass('display_none');
				}
				
//				$('.rcp-topbtn').attr('id', 'subscribeComplete');
			},
			error : function() {
				swal('서버 요청 오류!...')
			}
		});
	}

	$.ajax({
		url : contextRoot+'recipe/userPage.json',
		dataType : 'json',
		method : 'post',
		data : {
			email : location.href.split('?')[1],
			request : 1
		},
		success : function(result) {

			if (result.status != 'success') {
				alert('comList 실행 중 오류 발생');
				return;
			}

			$('#updateFormUserNo').val(result.user.userNo);

			var sourceCRList = $('#temp').text();
			var templateCRList = Handlebars.compile(sourceCRList);

			$('.rcp-userPage-userName').text(result.user.userName);
			console.log("userProfile : "+result.user.image);

			if(result.user.image != null && result.user.image !=''){
				$('.rcp-topimg').attr('src','img/profileImg/'+result.user.image);
			}

			$('#tabs-1 .hs-content .container .row .rcp-mypage-section')
			.append(templateCRList(result));
			console.log(result.data);

			$('.rcp-Vst').remove();

			for(var i=0; i<result.data.length; i++){
//				for(var j=0; j<result.data[i].representImages.length; j++){
				$('div[name="recipe-image"]:eq('+i+')').attr('style','background-image:url(img/representImg/'+result.data[i].representImages[0]+')');

//				}
			}
			$('#tabs-2').addClass('display_none');
			$('#tabs-3').addClass('display_none');
		},
		error : function() {
			// alert('community 서버 요청 오류!...')
		}
	});
}

function checkSubScribeFunction(){
	// checkSubscribe
	$.ajax({
		url : contextRoot+'recipe/checkSubscribe.json',
		datatype : 'json',
		data : {
			email : location.href.split('?')[1]
		},
		method : 'post',
		success : function(result) {
			if (result.status == 'false') {
				// swal('실행 중 오류 발생');
				return;
			}
			$('.subscribeBtn-text').text('구독중');
			$('.subscribeBtn').addClass('subsactive');
			if((userInfo==null?null:userInfo.email)!=location.href.split('?')[1]){
				$('#subsWrapper').removeClass('display_none');
			}

//			$('.rcp-topbtn').attr('id', 'subscribeComplete');
		},
		error : function() {
			swal('서버 요청 오류!...')
		}
	});

}

function subScribeFunction(){
	$('.subscribeBtn').on('click', function(evnet) {
		if ($(this).hasClass('subsactive')) {
			$.ajax({
				url : contextRoot+'recipe/deleteSubscribe.json',
				datatype : 'json',
				data : {
					email : location.href.split('?')[1]
				},
				method : 'post',
				success : (function() {
					console.log('구독하기 해제 성공성공')
					$('.subscribeBtn-text').text('구독하기');
					$('.subscribeBtn').removeClass('subsactive');
//					$('.rcp-topbtn').text('구독하기');
//					$('.rcp-topbtn').attr('id', '');
				}),
				error : (function() {
					console.log('구독하기 서버요청 error');
				})
			});
		} else {
			$.ajax({
				url : contextRoot+'recipe/addSubscribe.json',
				datatype : 'json',
				data : {
					email : location.href.split('?')[1]
				},
				method : 'post',
				success : (function(result) {
					if (result.status == 'failure') {
						console.log(result);
						swal('잘못된 접근입니다.');
						return;
					} else {
						console.log('구독하기 성공성')
						$('.subscribeBtn-text').text('구독중');
						$('.subscribeBtn').addClass('subsactive');
//						$('.rcp-topbtn').text('구독중');
//						$('.rcp-topbtn').attr('id', 'subscribeComplete');
					}
				}),
				error : (function(result) {
					console.log('구독하기 서버요청 error');
				})
			});
		}

	});
}

function topBarFunction(){
	/* 준모3 */

	$('#topbarUserImg')
	.html(
	"<img class='rcp-barimg dropdown-trigger img-circle' src='img/Chef3.jpg' />");

	$('.profile-dropdown:has(.active)').bind('click', function() {

	});

	$(window).bind('scroll', function(e) {
		$('.main-nav__dropdown').removeClass('active');
	});

	$('.dropdown-trigger').on(
			'click',
			function(event) {
				event.preventDefault();
				dropdownClick('.profile-dropdown', '.mobile-menu-dropdown');
				/* 용이 추가() */
				if (eval(sessionStorage.getItem('data'))[0].userNo != null) {
					$('#profileEmail').text(
							eval(sessionStorage.getItem('data'))[0].email);
					$('#profileName').text(
							eval(sessionStorage.getItem('data'))[0].userName);
					$('#profileGrade').text(
							eval(sessionStorage.getItem('data'))[0].recipeUrl);
					/* 용이 추가() */
					$('#introduce').text(
							eval(sessionStorage.getItem('data'))[0].intro);
				}
			});
	$('.dropdown-trigger').on('scroll', function() {
		dropdownClick('.profile-dropdown', '.mobile-menu-dropdown');
	});

	$('.dropdown-trigger--mobile').on('click', function() {
		dropdownClick('.mobile-menu-dropdown', '.profile-dropdown');
	});
	Handlebars.registerHelper("representImage", function(value, options){
		{
			return value[0];
			//return "1 / ";
		}
	});




}




function loadVisitor() {
	console.log("visit 옴 ? ");
	$.ajax({
		url : contextRoot+'/visitor/list.json',
		dataType : 'json',
		method : 'get',
		data : {
			email : location.href.split('?')[1],
		},
		success : function(result) {
			if (result.status != 'success') {
				swal('실행 중 오류 발생');
				return;
			}

			console.log(result)
			$('#Vst').html('');
			$('#Vst').append(templateVisitor(result));
			var id = $('#fromNo').val();
			var toUser = $('#updateFormUserNo').val();
			if(id!=toUser){
				$('.editBtn1').hide();
				$('.editBtn2').hide();    
			}


		},
		error : function() {
			swal('서버 요청 오류!...')
		}
	});
}




function visitFunction(){
	/* Add */

	$(document).on('click','#rcp-rpBtn', function() {
		$.ajax({
			url : contextRoot+'visitor/add.json',
			method : 'post',
			data : {
				visitorContent : $('#rcp-rpcontent').val(),
				toUser : $('#updateFormUserNo').val()
			},
			dataType : 'json',
			success : function(result) {
				if (result.status != 'success') {
					swal('로그인 해주세요.');
					$('#login-pop-up-banner').bPopup();//20160830 용이 추가
				}
				var owner = location.href.split('?')[1];
				var myEmail = userInfo.email;
				var myName = userInfo.userName;
				var myImg = userInfo.image;

				push(owner,("msg"+"/"+myEmail+"/"+myName+"/"+myImg), "message");	
				loadVisitor(); // 테이블 데이터를 갱신한다.
			},
			error : function() {
				swal('서버 요청 오류 !')
			}
		})

		$('#rcp-rpcontent').val("");
	});

	$(document).on('click', '.vstDeleteBtn', function(event) {
		event.preventDefault();
		var vNo = $(this).attr('data-index');
		swal({
			title : "방명록 삭제?",
			text : "진짜 지울꺼야??",
			type : "warning",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : "delete",
			closeOnConfirm : false
		}, function() {
			$.getJSON('visitor/delete.json?no=' + vNo, function(result) {
				if (result.status != 'success') {
					swal('게시물 삭제 오류');
					return;
				}
				$(this).parent().parent().parent().parent().remove();
				loadVisitor();
			});
			swal.close();
		});
	});

	/* 업데이트 */

	$(document).on('click','.vstUpdateBtn',function(event) {
		event.preventDefault();
		$(
				'.vst-contents[data-index='
				+ $(this).attr('data-index') + ']')
				.html(
				'<div class="rcp-Vst-contents"><textarea id="updatevContent" rows="7" cols="43" placeholder="편집해주세요" style="resize:none;"></textarea></div>');
		$(
				'.editBtn1[data-index='
				+ $(this).attr('data-index') + ']').html(
						'<button type="button" class="btn btn-success btn-xs vstConfirmBtn" id="vstConfirmBtn" data-index="'
						+ $(this).attr('data-index') + ' "'
						+ '>완료</button>');
		$(
				'.editBtn2[data-index='
				+ $(this).attr('data-index') + ']').html(
						'<button type="button" class="btn btn-warning btn-xs vstResetBtn" id="vstResetBtn" data-index="'
						+ $(this).attr('data-index') + ' "'
						+ '>취소</button>');

	});


}

function pageTabs() {
	$('.rcp-Vst-write').hide();
	$('.isotope-filter a').on('click',function(event) {
				event.preventDefault();
				var request;
				var url = contextRoot+'recipe/userPage.json';

				if($(event.target).is('#searchRecipe')){
					request=1;
					$('.rcp-Vst').hide();
					$('.rcp-Vst-write').hide();
					$('#tabs-1').removeClass('display_none');
					$('#tabs-2').addClass('display_none');
					$('#tabs-3').addClass('display_none');
					$('#tabs-4').addClass('display_none');
				}
				else if($(event.target).is('#searchScrap')){
					request=2;
					$('.rcp-Vst').hide();
					$('.rcp-Vst-write').hide();
					$('#tabs-1').addClass('display_none');
					$('#tabs-2').removeClass('display_none');
					$('#tabs-3').addClass('display_none');
					$('#tabs-4').addClass('display_none');
				}else if($(event.target).is('#searchSubscribe')){
					request=3;
					$('.rcp-Vst').hide();
					$('.rcp-Vst-write').hide();
					$('#tabs-1').addClass('display_none');
					$('#tabs-2').addClass('display_none');
					$('#tabs-3').removeClass('display_none');
					$('#tabs-4').addClass('display_none');
				}else{
					request = 4;
					$('.rcp-Vst').remove();
					loadVisitor();
					$('#tabs-1').addClass('display_none');
					$('#tabs-2').addClass('display_none');
					$('#tabs-3').addClass('display_none');
					$('#tabs-4').removeClass('display_none');
				}

				$
				.ajax({
					url : url,
					dataType : 'json',
					method : 'post',
					data : {
						email : location.href.split('?')[1],
						request : request
					},
					success : function(result) {

						if (result.status != 'success') {
							alert('comList 실행 중 오류 발생');
							return;
						}

						var sourceCRList = $('#temp').text();
						var templateCRList = Handlebars
						.compile(sourceCRList);

						console.log(result.data);
						
						$('#tabs-'+ $('#tabId').val()+ ' .hs-content .container .row .rcp-mypage-section div').remove();
						$('#tabs-'+ request+ ' .hs-content .container .row .rcp-mypage-section').append(templateCRList(result));
						$('#tabId').val(request);

						console.log(result.data);
						for (var i = 0; i < result.data.length; i++) {
							// for(var j=0;
							// j<result.data[i].representImages.length;
							// j++){
							$('div[name="recipe-image"]:eq('+ i + ')').attr('style','background-image:url(img/representImg/'
									+ result.data[i].representImages[0]+ ')');

							// }
						}
					},
					error : function() {
						alert('community 서버 요청 오류!...')
					}
				});
			})
}


function loadMyPage(){



	$.ajax({
		url : contextRoot+'/visitor/loadMyPage.json',
		datatype:'json',
		data:{
			email:location.href.split('?')[1]
		},
		method:'post',
		success : function(result) {
			if (result.status == 'false') {
				//swal('로그인 해주시기 바랍니다.');
				return;
			}
			console.log(result.data);
			$('#visitNum').text(result.data.hits+"명");
			$('#likeNum').text(result.data.likeCount+"개");
			$('#scrapNum').text(result.data.scrapCount+"개");
			$('#subsNum').text(result.data.subsCount+"명");

		},
		error : function() {
			//swal('더이상 데이터가 없습니다.')
		}
	})  
}

function handlebarsFunction(){
	Handlebars.registerHelper('transientStorage', function(options) {
		if (this.regiStatus != 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('regStatus', function(options) {
		if ( userInfo == null || location.href.split('?')[1] != userInfo.email ) {
			if(this.regiStatus != 0){
				console.log("다른사람이 접속함 : "+options.inverse(this));
				return options.inverse(this);
			} else {
				console.log("다른사람이 접속함 : "+options.fn(this));
				return options.fn(this);
			}		  
		}else{
			console.log("내가 접속함 : "+options.fn(this));
			return options.fn(this);
		}
	});


	Handlebars.registerHelper("representImages", function(value, options){
		{
			return value[0];
			//return "1 / ";
		}
	});


	Handlebars.registerHelper("countImage", function(value, options){
		{
			return "1 / "+value.length;
			//return "1 / ";
		}
	});

}


function visitWriteFormFunction(){ 

	$('#visitorWrite').on('click', function() {
		$('.rcp-Vst').show();
		$('.rcp-Vst-write').show();
	})
}