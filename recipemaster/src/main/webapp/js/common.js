document.write('<script type"text/javascript" src="js/template/notification.js"></script>')

function onlyNumber()
{
	if ((event.keyCode<48)||(event.keyCode>57))
	event.returnValue = false;
}

//날씨 정보 받는 function
function getWeather(){
	$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=37.541&lon=126.986&appid=a0ccb666270bab97723eace09ed1b61c',
            function(result) {
//			swal(result.weather[0].main);
    });
}
//날씨 정보 받는 function 종료 - 박상일

//실시간 랭크 function 시작
//실시간 랭크 function 종료	- 박상일

//userInfoBox 드롭다운 function 시작
function dropdownClick(target, other) {
	if ($(other).hasClass('active')) {
		$(other).removeClass('active');
	}
	$(target).toggleClass('active');
}
//userInfoBox 드롭다운 function 종료 - 박상일


//-----------------------------랜덤 레시피 ---------------------------------
  $('#rcp-random-recipe').on('click',function(event){
    event.preventDefault();
    randomRecipe();    
	$('#random-pop-up-banner').bPopup();
	var slot_roll1 = new Slot_roll('#rcp-randomRacipeCardWrapper-slot');
	if( $('#rcp-randomRacipeCardWrapper-slot').is(':not(:animated)') ){
		slot_roll1.dice();
	}	
  });
  
  $(document).on('click','#rcp-re-recipe',function(){
	 randomRecipe();
	 var slot_roll1 = new Slot_roll('#rcp-randomRacipeCardWrapper-slot');
	 if( $('#rcp-randomRacipeCardWrapper-slot').is(':not(:animated)') ){
			slot_roll1.dice();
		}	 
  });
  
  function randomRecipe(){
	  var source = $('#recipe-card-template').html();
	  var template = Handlebars.compile(source);
  	  $.ajax({	  		  
  		  url:contextRoot+'recipe/randomList.json',
  		  dataType:'json',
  		  method:'post',
  		  async: false,
  		  success:function(result){
  			  if (result.status !='success'){
  				  swal('실행중 오류 발생');
  				  return;
  			  }
  			  var list = result.data;
  			  $('#rcp-randomRacipeCardWrapper').html('');
  			  $('#rcp-randomRacipeCardWrapper').append( template(result) );
  			  		  
  		  },
  		  error : function(){
  			  console.log('randomList: 서버 요청 오류');
  		  }
  	  });
  }


Handlebars.registerHelper('defaultImage', function(options) {
		 
	  if (this.user.image == null || this.user.image =='') {
		  return options.inverse(this);
	  } else {
	    return options.fn(this);
	  }
});

function comList(){
	  $(document).on('click', '.rcp-userName, .rcp-nickname , .rcp-profile',function(event){
		  event.preventDefault();
		  console.log( "event target : "+$(event.target).attr('class') )
		  $(location).attr('href',contextRoot+'mypage.html?'+$(event.target).parent().children('input[class="rcp-hidden-email"]').val() );
		  console.log("email val()"+$(event.target).parent().children('input[name="email"]').val() );
	  })
}

function slotRoller(spd, selector) {
	var speed = 200; // slot 회전 속도
	var firstChild = $("#rcp-randomRacipeCardWrapper-slot .slotCard:first-child");
		lastChild = $("#rcp-randomRacipeCardWrapper-slot .slotCard:last-child");

	// slot 목록을 순환
	$(selector).animate({ 
		marginTop: "-950px"
		}, speed + (spd * 10 + spd), "linear", function(){
			// 첫째 목록을 마지막으로 이동
			firstChild = $("rcp-randomRacipeCardWrapper-slot:first-child", this);
			$(this).append(firstChild);
			$(this).css({ marginTop: "-425px"});
	});
}

/* 슬롯 객체를 정의 */
function Slot_roll(slotName){
	this.dice = function(){
		for (var i = 0; i < 8; i++) {
			slotRoller(i, slotName);
		}
	}
}

function isNumber(s) {
	  s += ''; // 문자열로 변환
	  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
	  if (s == '' || isNaN(s)) return false;
	  return true;
}

function push(email, message, separation){
	var socket = io.connect(getNodeContextRoot('8081'));
	
	if(email==null){
		return;
	}
	
	if(separation=='login'){
		data = {
			uid: email
		}
	} else if(separation=='message'){
		data={
			uid: email,
			msg: message
		}
	}
	
	socket.emit(separation, data);
	
	socket.on('message',function(data){
		notifyMe(data);
    });
}


//--------------------좋아요 등록, 해제 로직-------------------------------  
function likeLogic(){
	$(document).on('click','.rcp-like',function(event){
		  event.preventDefault();
		  console.log(event.target);
		  if($(event.target).parent().is('.active') ){
			  $.ajax({
				  url:contextRoot+'recipe/likeDown.json?recipeNo=' + $(event.target).parent().parent().parent()
				  .children('input[name="recipeNo"]').val()+"&userNo="
				  + userInfo.userNo,
				  dataType:'json',
				  method:'get',
				  success:function(){
					  console.log("like down 성공성공");
					  $(event.target).css('color','#acacac');
					  $(event.target).parent().css('color','#acacac');
					  $(event.target).parent().children('.glyphicon-heart-empty').attr('class','glyphicon glyphicon-heart-empty rcp-i-tag-margin-right-top')
					  $(event.target).parent().removeClass('active');
					  $(event.target).children('span').text( parseInt($(event.target).children('span').text())-1);

				  },
				  error:function(){
					  swal('like : 서버 요청 오류');
				
				  }
			  });
		  }
		  else{
	
			  $.ajax({
				  url:contextRoot+'recipe/likeUp.json?recipeNo=' + $(event.target).parent().parent().parent()
				 .children('input[name="recipeNo"]').val()+"&userNo="
				  +  userInfo.userNo,
				  dataType:'json',
				  method:'get',
				  success:function(){
					  console.log("like up 성공성공");
					  $(event.target).css('color','#e09b23');
					  $(event.target).parent().css('color','#e09b23');
					  $(event.target).parent().addClass('active');
					  $(event.target).children('span').text( parseInt($(event.target).children('span').text())+1 );
//					  $('[name="rcp-custom-list"]').remove();
//					  Main1List();
				  },
				  error:function(){
					  swal('ajax likeclick: 서버 요청 오류');
				  }
			  });
		  }
	  });
}


//스크랩 등록,해제 로직

function scrapLogic(){
	$(document).on('click','.rcp-scrap',function(event){
		console.log('약;엄 ?');
		  event.preventDefault();
		  if($(event.target).parent().is('.active') ){
			  console.log("scrap if")
			  $.ajax({
				  url:contextRoot+'recipe/deleteScrap.json',
				  dataType:'json',
				  data:{
					recipeNo:$(event.target).parent().parent().parent().children('input[name="recipeNo"]').val() 
				  },
				  method:'post',
				  success:function(){
					  console.log("scrap down 성공성공");
					  $(event.target).css('color','#acacac');
					  $(event.target).parent().css('color','#acacac');
					//  $(event.target).parent().parent().children('.glyphicon-heart-empty').attr('class','glyphicon glyphicon-heart-empty')
					  $(event.target).parent().removeClass('active');
					  $(event.target).children('span').text( parseInt($(event.target).children('span').text())-1);

				  },
				  error:function(){
					  swal('like : 서버 요청 오류');
				
				  }
			  });
		  }
		  else{

			  $.ajax({
				  url:contextRoot+'recipe/scrap.json',
				  dataType:'json',
				  data:{
					  recipeNo:$(event.target).parent().parent().parent().children('input[name="recipeNo"]').val() 
				  },
				  method:'post',
				  success:function(){
					  console.log("scrap up 성공성공");
					  $(event.target).css('color','#e09b23');
					  $(event.target).parent().css('color','#e09b23');
					  $(event.target).parent().addClass('active');
					  $(event.target).children('span').text( parseInt($(event.target).children('span').text())+1 );
//					  $('[name="rcp-custom-list"]').remove();
//					  Main1List();
//					  
				  },
				  error:function(){
					  swal('ajax likeclick: 서버 요청 오류');
				  }
			  });
		  }
	  });
}


function mouseMoveEventForSubscribeImage(result){	
			$(document).on('mousemove','.entry-action, .entry-action-inner',function(event){				
				if( $(event.target).attr('class') == 'entry-action' ){					
					var imageChange = parseInt( $('.entry-action').width() + 1)  / $(event.target).parent().parent().children('input[type="hidden"]').length;					
					var image = parseInt(event.offsetX / imageChange);					
					$(event.target).attr("style", "background-image:url(img/representImg/"
						+$(event.target).parent().parent().children('input[type="hidden"]:eq('+image+')').val()+"); background-size : cover;");					
					if(image != $(event.target).parent().parent().children('input[type="hidden"]').length + 1){
						$(event.target).parent().parent().children('.rcp-count-images').text(image+1+" / "+$(event.target).parent().parent().children('input[type="hidden"]').length);
						}else{
							return;
						}
					
					
				}else{					
					var imageChange = parseInt( $('.entry-action-inner').width() + 1)  / $(event.target).parent().parent().parent().children('input[type="hidden"]').length;
					var image = parseInt(event.offsetX / imageChange);								
					$(event.target).parent().attr("style", "background-image:url(img/representImg/"
							+$(event.target).parent().parent().parent().children('input[type="hidden"]:eq('+image+')').val()+"); background-size : cover;");					
					if(image != $(event.target).parent().parent().parent().children('input[type="hidden"]').length + 1){						
						$(event.target).parent().parent().parent().children('.rcp-count-images').text(image+1+" / "+$(event.target).parent().parent().parent().children('input[type="hidden"]').length);
						}else{
							return;
						}
					
				}
			})
}



function recipeDetailLike(){	
	$(document).on('click','.rcp-scrap-button-text-like ',function(event){		
		console.log('event.target'+$(event.target).attr('class'));
console.log('button 시점 recipeNo : ' +$(event.target).parent().parent().children('input[class="rcp-hidden-recipeNo"]').val())


		event.preventDefault();
		if($(event.target).is('[name="like"]')){
			  $.ajax({
				  url:contextRoot+'recipe/likeDown.json?recipeNo=' + $(event.target).parent().parent().
				  children('input[class="rcp-hidden-recipeNo"]').val()+"&userNo="
				  + userInfo.userNo,
				  dataType:'json',
				  method:'get',
				  success:function(){					  
						$('.rcp-scrap-button-text-like').attr('name','');
						$('.rcp-countLike').text( Number( $('.rcp-countLike').text() ) -1 );
						$('.rcp-scrap-button-text-like').css('color','white');
						$('.rcp-detail-like').attr('style','color:white');
						$('.rcp-detail-like i').attr('style','color:white');					  
				  },
				  error:function(){
					  swal('like : 서버 요청 오류');
				
				  }
			  });
		  }
		  else{
			  $.ajax({
				  url:contextRoot+'recipe/likeUp.json?recipeNo=' + $(event.target).parent().parent().
				  children('input[class="rcp-hidden-recipeNo"]').val()+"&userNo="
				  + userInfo.userNo,
				  dataType:'json',
				  method:'get',
				  success:function(){
					  console.log("like up 성공성공");
					  console.log( Number( $('.rcp-countLike').text() ) +1  );
					  $('.rcp-countLike').text( Number( $('.rcp-countLike').text() ) +1 );
						$('.rcp-scrap-button-text-like').attr('name','like');
						$('.rcp-scrap-button-text-like').css('color',' #ffce6e');
						$('.rcp-detail-like').attr('style','color:#ffce6e');
						$('.rcp-detail-like i').attr('style','color:#ffce63');					  
				  },
				  error:function(){
					  swal('ajax likeclick: 서버 요청 오류');
				  }
			  });
		  }
	  });
	
}


function comment(){
	$(document).on('click','.rcp-view-comment',function(evnet){		
		evnet.preventDefault();
		commentFunction();
		
	})
}

function commentFunction(){
	$.ajax({
		url : contextRoot+'recipe/recipeComment.json',
		method : 'post',
		data:{
			recipeNo:$('.rcp-hidden-recipeNo').val()
		},
		dataType : 'json',
		success : function(result) {
			$(".rcp-detail-body").remove();
			$('.rcp-720').attr('style','overflow:auto');
			$(".rcp-720").html('<div class="rcp-header">'
					+'<h2 class="title">댓글</h2>'
					+'<h3 class="rcp-comment-count"></h3>'
					+'<p class="rcp-view-recipe">레시피보기</p></div>'
					+'</div>'
					+'<div class="rcp-detail-body"></div>');
			console.log('dfdf : '+$('#aaaa').val());
			
		
			if(result.data.length <1) {
				$('.rcp-comment-count').text("등록된 댓글이 아직 없습니다.");
			}else{					
				$('.rcp-comment-count').text(result.data[0].countComment+" Comments");
				
			}		
		
			$('.rcp-detail-body').append( comRecipeComment(result) );				
			$('.rcp-detail-body').append( comRecipeAddComment(result) );
			$('#forCommentRecipeNumber').val( $('.rcp-hidden-recipeNo').val());
			
		},error : function(){
			swal('서버 요청 오류');
		}		
	})
}

function addComment(){
	$(document).on('click','input[name="rcp-submit"]',function(){		
		console.log('dfdf : '+$('#aaaa').val());
		$.ajax({
			url:contextRoot+'recipe/addComment.json',
			dataType:'json',
			method:'post',
			data:{
				recipeNo:$('#forCommentRecipeNumber').val(),
				recipeComment:$('textarea[name="recipeComment"').val()
			},
			success:function(result){
				if(userInfo == null){
					swal('로그인이 필요한 서비스입니다.');
					return ;
				}

				push($('#rcp-hidden-email').val(),("rp"+"/"+userInfo.email+"/"+userInfo.userName+"/"+userInfo.image+"/"+$('.rcp-hidden-recipeNo').val()+"/"+$('#rcp-hidden-recipeTitle').val()), "message");
				$('.rcp-countComment').text( Number( $('.rcp-countComment').text() ) +1 );
				commentFunction();
			},
			error:function(){
				alert('addComment 에러욤 !!')
			}
		})
	})
}

function deleteComment(){
	$(document).on('click','#deleteComment',function(event){
	event.preventDefault();
	deleteCommentFunction(event);
	})
}

function deleteCommentFunction(event){
		$.ajax({
			url:contextRoot+'recipe/deleteComment.json',
			dataType:'json',
			method:'post',		
			data:{
				commentNo : $(event.target).parent().children('#commentNo').val()
			},
			success:function(result){
				console.log('comment delete 성공성공 ^^');
				$('.rcp-countComment').text( Number( $('.rcp-countComment').text() ) -1 );
				commentFunction();
			},
			error:function(){
				console.log('comment delete 실패실패 ㅠㅠ');
			}
		
		})	
}


//----------------------Like function 끝--------------------

function recipeScrap(){
	$(document).on('click','.rcp-scrap-button-text',function(event){		
		event.preventDefault();		
		if($(event.target).is('[name="scrap"]')){
			console.log(' 딜리트 여기옴?');			
			$.ajax({
				url:contextRoot+'recipe/deleteScrap.json',
				method:'post',
				dataType:'json',
				data: {
					recipeNo : $(event.target).parent().parent().parent().children('input[class="rcp-hidden-recipeNo"]').val()
				},
				success:function(result){
					if (result.status != 'success') {
						swal('게시물 조회 오류');
						return;
					}
					$('.rcp-scrap-button-text').attr('name','');
					$('.rcp-countScrap').text( Number( $('.rcp-countScrap').text() ) -1 );
					$('.rcp-scrap-button-text').css('color','white');
					$('.rcp-detail-scrap').attr('style','color:white');
					$('.rcp-detail-scrap i').attr('style','color:white');
				},
				error : function(){
					swal('서버 요청 오류');

				}
			})

		}else{
//			-------------------------------스크랩 등록 --------------------------------
			event.preventDefault();	
			$.ajax({
				url:contextRoot+'recipe/scrap.json',
				method:'post',
				dataType:'json',
				data: {
					recipeNo : $(event.target).parent().parent().parent().children('input[class="rcp-hidden-recipeNo"]').val()
				},
				success:function(result){


					if(result.status == 'notLogin'){
						swal('로그인 부탁염 ^^*');
						return;
					}

					$('.rcp-scrap-button-text').attr('name','scrap');		
					$('.rcp-countScrap').text( Number( $('.rcp-countScrap').text() ) +1 );
					$('.rcp-scrap-button-text').css('color',' #ffce6e');
					$('.rcp-detail-scrap').attr('style','color:#ffce6e');
					$('.rcp-detail-scrap i').attr('style','color:#ffce63');
				},
				error : function(){
					swal('서버 요청 오류');
				}
			})
		}
//		----------------------스크랩 요청 AJAX 끝--------------------
	})
};


//---------------핸들바스 헬퍼클래스 ----------------------------

Handlebars.registerHelper('isLike', function(options) {
	  if (this.likeUser!=0 && this.likeUser!=null) {
	    return options.fn(this);
	  }
});

Handlebars.registerHelper('isScrap', function(options) {
	  if (this.scrapUser!=0 && this.scrapUser!=null) {
	    return options.fn(this);
	  }
});
//
//Handlebars.registerHelper('isImage', function(options) {
//	  if (this.image=='' || this.image == null || this.image.length<1) {		  
//	    return 'default.jpg';
//	  }
////	  }else{
////		  return options.inverse(this);
////	  }
//});




function recipeDetailPopup(recipeNo){
	$("html").css("overflow", "auto");
	$(".detail-images").remove();
	$(".rcp-body").remove();
	$(".rcp-main").remove();
	$(".rcp-detail-step").remove();
	$(".rcp-detail-body").remove()
	$(".bx-wrapper").remove();
	$(".rcp-720").html('<div class="rcp-header">'
						+'<h2 class="title"></h2>'
						+'<p class="hash"></p>'
						+'<p class="date"></p>'
						+'<p class="rcp-view-comment">댓글보기</p>'
						+'<div class="timerZone"></div>'
						+'<hr/></div>'
						+'<div class="rcp-detail-body"></div>');
	// 별점주기 팝업
	$('#rcp-star-rating').on('click', function(){
		$('.rcp-starrating').bPopup();
	})
	$('#detail_pop_up').bPopup().close();
	
	$.ajax({
		url : contextRoot+'recipe/recipeDetail.json',
		method : 'post',
		data:{
			recipeNo: recipeNo
		},
		dataType : 'json',
		success : function(result) {
			if (result.status != 'success') {
				swal('게시물 조회 오류');
				return;
			}
			
			var addSpan = '';
			
			if(userInfo != null){
				if(userInfo.userNo == result.data.userNo){
					console.log('여기옴 ? ');
				addSpan = "<a href='#'><span class='glyphicon glyphicon-pencil rcp-recipe-edit-button'></span></a>";
					}
				}
			
			$('.rcp-taps').children('input[name="recipeNo"]').val(result.data.recipeNo);
			$('.rcp-header > .title').html(result.data.recipeName+addSpan);
			$('.rcp-header > .date').text(result.data.recipeDate);
			$('.hash').text(result.data.intro);
			$('div[name="rcp-explanation"]:eq(1)').text(result.data.intro);
			
			$('#detail_pop_up').bPopup({
				position: (['auto','auto']),
				positionStyle :[('fixed')],
				onOpen:function(){
					$('html').css('overflow','hidden');
					checkDuplicateGrade();					
					$('.rcp-304').append( comDetailInfoTemp(result) );
					$('.rcp-info-images').append( comDetailImageMain(result.data.representImages[0]) );
					$('.rcp-detail-body').append( comDetailMainTemp(result.data) );
					$('.rcp-detail-body').append( comDetailTemp(result.data) );
					$('.rcp-info-images').append( comDetailImageStep(result.data) );
					
					slider = $('.rcp-detail-body').bxSlider({
						startSlide:0,
						mode:'vertical',
						pager: false,
						moveSlides: 1,
						infiniteLoop:false,
						controls:false
					});
					
				$('.rcp-detail-body').css('transform', 'translate3d(0px, 0px, 0px)');
					
					for(var i=0; i<$('.rcp-body').length; i++){
						$('div[name="rcp-body"]:eq('+i+')').attr('id',"div"+i);
						$('a[name="rcp-nav-images"]:eq('+i+')').attr('href','#div'+i);
						$('a[name="rcp-nav-bgImages-button"]:eq('+i+')').attr('href','#div'+i);
					}
					
				$('.rcp-mainSlider').bxSlider({
					startSlide:0,
					pager: false,
					moveSlides: 1,
					infiniteLoop:false, 
				});

				$('.rcp-detail-body').on("mousewheel", function (event) {
					var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
					init_scroll(event, delta, slider)
				});
//					$(document).on('click','.rcp-info-images-emts',function(event){
//						event.preventDefault();
//						var div = $(event.target).parent().attr('href');
//						console.log(div);
//						$(location).attr('href',div);
//					})


					if( userInfo != null ){										
						if(result.data.scrapUser == userInfo.userNo){
							$('.rcp-scrap-button-text').attr('name','scrap');								
							$('.rcp-scrap-button-text').css('color',' #ffce6e');
							$('.rcp-detail-scrap').attr('style','color:#ffce6e');
							$('.rcp-detail-scrap i').attr('style','color:#ffce63');
						}else{									
							$('.rcp-scrap-button-text').attr('name','');								
							$('.rcp-scrap-button-text').css('color','white');
							$('.rcp-detail-scrap').css('color','white');
							$('.rcp-detail-scrap i').css('color','white');	
						}
						
						if(result.data.likeUser != 0 ){
							$('.rcp-scrap-button-text-like').attr('name','like');								
							$('.rcp-scrap-button-text-like').css('color',' #ffce6e');
							$('.rcp-detail-like').attr('style','color:#ffce6e');
							$('.rcp-detail-like i').attr('style','color:#ffce63');
						}else{									
							$('.rcp-scrap-button-text-like').attr('name','');								
							$('.rcp-scrap-button-text-like').css('color','white');
							$('.rcp-detail-like').css('color','white');
							$('.rcp-detail-like i').css('color','white');	
						}
						
				}
					},
				onClose:function(){ 
					$("html").css("overflow", "auto");
					$(".detail-images").remove();
					$(".rcp-body").remove();
					$(".rcp-main").remove();
					$(".rcp-detail-step").remove();
					$(".rcp-detail-body").remove()
					$(".bx-wrapper").remove();
					$(".rcp-720").html('<div class="rcp-header">'
										+'<h2 class="title"></h2>'
										+'<p class="hash"></p>'
										+'<p class="date"></p>'
										+'<div class="timerZone"></div>'
										+'<hr/></div>'
										+'<div class="rcp-detail-body"></div>');
					// 별점주기 팝업
					$('#rcp-star-rating').on('click', function(){
						$('.rcp-starrating').bPopup();
					})
				}

			});

		} 
		,
		error : function(){
			swal('서버 요청 오류');
		}
	});
}

