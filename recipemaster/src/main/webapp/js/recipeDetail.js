document.write('<script type"text/javascript" src="js/common.js"></script>')
document.write('<script type"text/javascript" src="js/login.js"></script>')
document.write('<script type"text/javascript" src="js/common/starrating.js"></script>')

var detailInfoTemp = $('#recipe-detail-304-info-template').html();
var comDetailInfoTemp = Handlebars.compile(detailInfoTemp);   

var detailImageMain = $('#recipe-detail-main-images-template').html();
var comDetailImageMain = Handlebars.compile(detailImageMain); 

var detailImageStep = $('#recipe-detail-step-images-template').html();
var comDetailImageStep = Handlebars.compile(detailImageStep);

var detailMainTemp = $('#recipe-detail-main-template').html();
var comDetailMainTemp = Handlebars.compile(detailMainTemp); 

var detailTemp = $('#recipe-detail-template').html();
var comDetailTemp = Handlebars.compile(detailTemp); 

var recipeComment = $('#recipe-comment').html();
var comRecipeComment = Handlebars.compile(recipeComment);

var recipeAddComment = $('#recipe-comment-addForm').html();
var comRecipeAddComment = Handlebars.compile(recipeAddComment); 

var slider;

$(function(){
	var userInfo = getUserInfo();
	recipeDetail();
	starRatingBtn();
	comment();
	addComment();
	deleteComment();
	recipeScrap();
	recipeDetailLike();
	clickDetailInDetailFunction();
//	timerStart();
	push((userInfo==null ? null:userInfo.email),'','login');
});


Handlebars.registerHelper("representImages", function(value, options){
	{			
		console.log("밸"+value);
		console.log("이미지 : "+value.representImage[0]);
		return value.representImage[0];
		//return value;
	}
}); 


Handlebars.registerHelper("inc", function(value, options){
	{
		return parseInt(value) + 1;
	}
});

Handlebars.registerHelper('x-button', function(options) {
	console.log("userNo : "+this.userNo)
	if(userInfo != null && userInfo.userNo == this.userNo){

		return options.fn(this); 
	}
});

//function timerStart() {
//$(document).on('click', '.timerBtn', function() {
//var $this = $(this);
//var node = $('<div class="timerObj"/>');
//var clock = $('<div class="timerClock float_left"></div>');	

//clock.countdown(getTimeStamp($this.next().next().val()))
//.on('update.countdown', function(event) {
//var format = '%H:%M:%S';
//$(this).html(event.strftime(format));
//})
//.on('finish.countdown', function(event) {
//$(this).html('00:00:00').parent().css("color", "red")
//$this.removeClass('display_none');
//$this.next().addClass('display_none');
//var audio = document.createElement('audio');
//audio.src = 'audio/porori.mp3'
//audio.play();
//});

//node.append($('<span class="float_left">'+$this.prev().text()+' -&nbsp;<span>'));
//node.append(clock);

//$('.timerZone').append(node);
//$this.addClass('display_none');
//$this.next().removeClass('display_none');

////$(document).on('click', '.timerObj', function() {
////console.log($(this).children('.timerClock'));
////$($(this).children('.timerClock')).countdown('pause');
////});
//});
//}


function clickDetailInDetailFunction(){
	$(document).on('click','.rcp-view-recipe',function(event){
		event.preventDefault();
		$.ajax({
			url : contextRoot+'recipe/recipeDetail.json',
			method : 'post',
			data:{
				recipeNo:$('.rcp-hidden-recipeNo').val()
			},
			dataType : 'json',
			success : function(result) {
				if (result.status != 'success') {
					swal('게시물 조회 오류');
					return;
				}
				//$('.rcp-720').remove();
				$('html').attr('style','overflow:hidden');
				$(".rcp-720").html('<div class="rcp-header">'
						+'<h2 class="title"></h2>'
						+'<p class="hash"></p>'
						+'<p class="date"></p>'
						+'<p class="rcp-view-comment">댓글보기</p>'
						+'<div class="timerZone"></div>'
						+'<hr/></div>'
						+'<div class="rcp-detail-body"></div>');
				$('.rcp-header > .title').text(result.data.recipeName);
				$('.rcp-header > .date').text(result.data.recipeDate);
				$('.hash').text(result.data.intro);
				$('div[name="rcp-explanation"]:eq(1)').text(result.data.intro);

				$('.rcp-detail-body').append( comDetailMainTemp(result.data) );
				$('.rcp-detail-body').append( comDetailTemp(result.data) );

				// 별점주기 팝업
				$('#rcp-star-rating').on('click', function(){
					$('.rcp-starrating').bPopup();
				})

				slider = $('.rcp-detail-body').bxSlider({
					startSlide:0,
					mode:'vertical',
					pager: false,
					moveSlides: 1,
					infiniteLoop:false,
					controls:false
				});
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

				$('.rcp-detail-body').css('transform', 'translate3d(0px, 0px, 0px)');

				for(var i=0; i<$('.rcp-body').length; i++){
					$('div[name="rcp-body"]:eq('+i+')').attr('id',"div"+i);
					$('a[name="rcp-nav-images"]:eq('+i+')').attr('href','#div'+i);
					$('a[name="rcp-nav-bgImages-button"]:eq('+i+')').attr('href','#div'+i);
				}
			}
			,
			error : function(){
				swal('서버 요청 오류');
			}

		})

	})
}

function recipeDetail(){
	$(document).on('click','.detail',function(event) {
		if($(this).parent().attr('href')!='#'){
			location.href=contextRoot+'writerecipe.html?'+$(this).prev().val();
			return;
		}
		event.preventDefault();
		console.log(event.target);
		recipeDetailPopup($(event.target).parent().children('input[name="recipeNo"]').val());
	});

	$(document).on('click', '.rcp-recipe-edit-button', function(event) {
		event.preventDefault();
		location.href=contextRoot+"writerecipe.html?"+$('#rcp-hidden-recipeNo').val();
	});
}

var lastAnimation =0;

function init_scroll(event, delta, slider) {
	deltaOfInterest = delta;
	var timeNow = new Date().getTime();
	// Cancel scroll if currently animating or within quiet period
	if(timeNow - lastAnimation < 500 + 700) {
		event.preventDefault();
		return;
	}

	if (deltaOfInterest < 0) {
		slider.goToNextSlide();
	} else {
		slider.goToPrevSlide();
	}
	lastAnimation = timeNow;
}

function getTimeStamp(time) {
	var d = addMinutes(new Date(), time);
	var s =
		leadingZeros(d.getFullYear(), 4) + '/' +
		leadingZeros(d.getMonth() + 1, 2) + '/' +
		leadingZeros(d.getDate(), 2) + ' ' +

		leadingZeros(d.getHours(), 2) + ':' +
		leadingZeros(d.getMinutes(), 2) + ':' +
		leadingZeros(d.getSeconds(), 2);

	return s;
}

function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes*60000);
}

function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	}
	return zero + n;
}