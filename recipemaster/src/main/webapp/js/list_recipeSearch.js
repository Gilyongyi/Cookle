document.write('<script type"text/javascript" src="js/login.js"></script>')
document.write('<script type"text/javascript" src="js/common.js"></script>')
/* 검색 및 정렬 이벤트 -성현 */
var tValue = getUserInfo();
var userInfo = (tValue==null?"":tValue);
$(document).ready(function(){
	// url에 QueryString의 검색어로 검색 결과 로딩
	urlParams = getUrlParams();	
//	if(urlParams.sk != undefined){		
//		$('#searchKeyword').val(decodeURIComponent(urlParams.sk));
//		$('#more-rcp-list').val('');
//	}		
	// 최신 레시피	
	if(urlParams.order != undefined){	
		$('#sort-condition').val(decodeURIComponent(urlParams.order));
		$('#order-latest-btn-text').addClass('order-active');
		$('#sort-condition').val('neweast')
	}	
	/*if(urlParams.sc != undefined){		
		$('#searchCondition-select').val(decodeURIComponent(urlParams.sc));
	}*/
	// 오늘의 인기 레시피
	if(urlParams.more != undefined){
		$('#more-rcp-list').val(decodeURIComponent(urlParams.more));
	}
	// 카테고리
	if(urlParams.ctg != undefined){
		/*$('#rcp-category-section input[type=checkbox][value='+decodeURIComponent(urlParams.ctg)+']').attr('checked',true);*/
		$('.rcp-cursor[value="'+decodeURIComponent(urlParams.ctg)+'"').addClass('rcp-category-checked');
		$('#category-filter').css('display','block')
		$('#category-filter').append('<span class="category-filter-box" value="'+decodeURIComponent(urlParams.ctg)+'">'
				+ decodeURIComponent(urlParams.ctg)+'&nbsp;'
				+'<span class="glyphicon glyphicon-remove" aria-hidden="true">'
				+'</span></span>');
	}

	// 처음화면에 모든 레시피들을 보여준다
//	search('newest', $('#order-latest-btn').val());
//	if($('#more-rcp-list').val().length>0){
//		search($('#sort-condition').val(),'desc')
//	} else {
//		esearch($('#sort-condition').val(), 1, false);
//	}
	

	// 검색창에 포커스
	$('#searchKeyword').focus();

	// 키보드에서 뗐을때의 검색 이벤트
	$(document).on('keyup', '#searchKeyword',function(){
		$("body").scrollTop(0);
		esearch($('#sort-condition').val(),1, false);
		$('#more-rcp-list').val('');
	})

	// 최신순 정렬
	$('#order-latest-btn-text').click(function(){	
		if($('#order-latest-btn-text').hasClass('order-active')){
			$('#order-latest-btn-text').removeClass('order-active');
			$('#order-latest-btn').val('');
			$('#sort-condition').val('');
		} else {
			$('#order-grade-btn-text').removeClass('order-active');
			$('#order-grade-btn-text').val('')
			$('#order-latest-btn-text').addClass('order-active');
			$('#order-latest-btn').val('DESC')
			$('#sort-condition').val('newest');
		}
		$('#more-rcp-list').val('');
		esearch($('#sort-condition').val(),1, false);
	});

	// 평점순 정렬
	$('#order-grade-btn-text').click(function(){
		if($('#order-grade-btn-text').hasClass('order-active')){
			$('#order-grade-btn-text').removeClass('order-active');
			$('#order-grade-btn-text').val('')
			$('#sort-condition').val('');
		} else {
			$('#order-latest-btn-text').removeClass('order-active');
			$('#order-latest-btn').val('')
			$('#order-grade-btn-text').addClass('order-active');
			$('#order-grade-btn-text').val('DESC')
			$('#sort-condition').val('grade');
		}
//		
//		
//		if($('#order-grade-btn').val() == 'DESC'){
//			$('#order-grade-btn-text').text('평점순▲');
//			$('#order-grade-btn').val('ASC')
//		} else if($('#order-grade-btn').val() == 'ASC'){
//			$('#order-grade-btn-text').text('평점순▼');
//			$('#order-grade-btn').val('DESC')
//		}
		$('#more-rcp-list').val('');
		esearch($('#sort-condition').val(),1, false);
	});

	// 스크롤을 끝까지 내렸을때 레시피 카드 생성
	$(window).on('scroll', function() { 
		if (Math.round($(window).scrollTop()) == $(document).height() - $(window).height()) {
			/*alert('스크롤 끝까지 내림');*/
			console.log($('#more-rcp-list').val());
			if($('#more-rcp-list').val().length>0){
				searchScrollAppend();				
			} else {
				esearchScrollAppend();
			}
		}
	});

	categoryClick();

	// 필터박스 클릭시 리무브
	$(document).on('click','.category-filter-box', function(){
		$(this).remove();
		$('.rcp-cursor[value="'+$(this).attr('value')+'"]').removeClass('rcp-category-checked');
		if($('.rcp-category-checked').length == 0){
			$('#category-filter').css('display','none')
		}
		$("body").scrollTop(0);
		$('#more-rcp-list').val('');
		esearch($('#sort-condition').val(),1, false);
	})

	// 필터박스 모두 취소
	$(document).on('click', '#category-filter-cancel', function(){
		$('.category-filter-box').remove();
		$('.rcp-cursor').removeClass('rcp-category-checked');
		$('#category-filter').css('display','none')
		$("body").scrollTop(0);
//		search('newest', $('#order-latest-btn').val());
		esearch($('#sort-condition').val(),1, false);
	})
	likeLogic();
	scrapLogic();
});

//처음 검색했을때의 1페이지 결과 가져오기 -이성현
function search(sort,order){ 

	var page = $('#recipe-card-searchPage-template').text();
	var compilePage = Handlebars.compile(page);

	var source = $('#temp').text();
	var template = Handlebars.compile(source);

	var categoryList = '';
	/*$('#rcp-category-section input[type=checkbox]:checked').each(function(index){*/
	$('.rcp-category-checked').each(function(index){		
		/*if(index !== ($('#rcp-category-section input[type=checkbox]:checked').length-1)){*/
		if(index !== ($('.rcp-category-checked').length-1)){
			categoryList += $(this).text()+',';
		} else {
			categoryList += $(this).text();
		}				
	})	
	
	$.ajax({
		url : contextRoot+'recipe/listSearch.json',
		method : 'post',
		data : {
			searchKeyword : $('#searchKeyword').val(),
			/*searchCondition : $("#searchCondition-select option:selected").val(),*/
			sortCondition : sort,
			orderCondition : order,
			categoryList : categoryList,
			more : ($('#more-rcp-list').val()==null?0:$('#more-rcp-list').val())
		},		
		dataType : 'json',
		success : function(result) {
			setTimeout(function() {
				if (result.status != 'success') {
					swal('실패 ~');
					return;
				}
				$('.wrap-loading').removeClass('display-none');
				$('#tabs-1 .hs-content .container .row div').remove();			
				$('#tabs-1 .hs-content .container .row').append(template(result));

				mouseMoveEventForSubscribeImage(result);
				$('#recipe-count').text('총 '+result.recipeCount+'개의 레시피가 검색되었습니다.');
				$('#search-pageNo').attr('value', '1');	
			}, 500)
		},
		// 데이터 조회 중일때 로딩 이미지 보여주기
		beforeSend:function(){			  
			$('.wrap-loading').removeClass('display-none');
			$('html').css("cursor","wait");
		},
		// 데이터 받아왔을때 로딩 이미지 감추기
		complete:function(){
			setTimeout(function() {
				$('.wrap-loading').addClass('display-none');
				$('html').css("cursor","auto");
			}, 500)
		},
		error : function() {
			swal('서버 요청 오류 !')
		}
	})	
}

function searchScrollAppend(){ 

	var page = $('#recipe-card-searchPage-template').text();
	var compilePage = Handlebars.compile(page);

	var source = $('#temp').text();
	var template = Handlebars.compile(source);

	if($('#sort-condition').val() == 'newest'){
		var order = $('#order-latest-btn').val();		
	} else {
		var order = $('#order-grade-btn').val();
	}

	var categoryList = '';
	/*$('#rcp-category-section input[type=checkbox]:checked').each(function(index){*/
	$('.rcp-category-checked').each(function(index){		
		/*if(index !== ($('#rcp-category-section input[type=checkbox]:checked').length-1)){*/
		if(index !== ($('.rcp-category-checked').length-1)){
			categoryList += $(this).text()+',';
		} else {
			categoryList += $(this).text();
		}				
	})	

	if($('#search-pageNo').val() != 'lastPage'){
		var pageNo = parseInt($('#search-pageNo').val())+1;
		$.ajax({
			url : contextRoot+'recipe/listSearch.json',
			method : 'post',
			data : {					
				pageNo : pageNo,
				searchKeyword : $('#searchKeyword').val(),
				/*searchCondition : $("#searchCondition-select option:selected").val(),*/
				sortCondition : $('#sort-condition').val(),
				orderCondition : order,
				categoryList : categoryList,
				more : ($('#more-rcp-list').val()==null?0:$('#more-rcp-list').val())
			},
			dataType : 'json',
			success : function(result) {
				setTimeout(function() {
					if (result.status != 'success') {
						swal('실패 ~');
						return;
					}
					$('#tabs-1 .hs-content .container .row').append(template(result));

					mouseMoveEventForSubscribeImage(result);

					if(result.data != 'lastPage'){
						$('#search-pageNo').val(result.pageNo);
					} else {
						$('#search-pageNo').val('lastPage');
					}					
				}, 350)
			},
			// 데이터 조회 중일때 로딩 이미지 보여주기
			beforeSend:function(){			  
				$('.wrap-loading').removeClass('display-none');
				$('html').css("cursor","wait");
			},
			// 데이터 받아왔을때 로딩 이미지 감추기
			complete:function(){
				setTimeout(function() {
					$('.wrap-loading').addClass('display-none');
					$('html').css("cursor","auto");
				}, 350)
			},
			error : function() {
				swal('서버 요청 오류 !')
			}

		})
	}
}



Handlebars.registerHelper("representImages", function(value, options){
	{			
		return value[0]
		//return value;
	}
});  


Handlebars.registerHelper("countImage", function(value, options){
	{
		return "1 / "+value.length;
		//return "1 / ";
	}
});

//스크롤 끝까지 내렸을때 추가될 결과 한페이지씩 가져오기 -이성현
function esearchScrollAppend(){ 

	var page = $('#recipe-card-searchPage-template').text();
	var compilePage = Handlebars.compile(page);

	var source = $('#temp').text();
	var template = Handlebars.compile(source);

	var order;
	if($('#sort-condition').val() == 'newest'){
		order = $('#order-latest-btn').val();		
	} else {
		order = $('#order-grade-btn').val();
	}
	
	if($('#search-pageNo').val() != 'lastPage'){
		var pageNo = parseInt($('#search-pageNo').val())+1;
		esearch(order, pageNo, true);
	}
}

//url QueryString 가져오는 function
function getUrlParams() {
	var params = {};
	window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
	return params;
} 


//----------------------------------------고재현 부분--------------------------------------------//
 
//
//Handlebars.registerHelper('isLike', function(options) {
//
//	if (this.likeUser!=0) {
//		return options.fn(this);
//	} else {
//		return options.inverse(this);
//	}
//});



//-------------고재현 09-05 수정-----------------------
$(function(){

	Handlebars.registerHelper("representImages", function(value, options){
		{			
			return value[0];
		}
	});  	

})

function mouseMoveEventForSubscribeImage(result){
	$(document).on('mousemove','.entry-action, .entry-action-inner',function(event){
		if( $(event.target).attr('class') == 'entry-action' ){					
			var imageChange = parseInt( $('.entry-action').width() + 1)  / $(event.target).parent().parent().children('input[type="hidden"]').length;					
			var image = parseInt(event.offsetX / imageChange);					
			$(event.target).attr("style", "background-image:url(img/representImg/"
					+$(event.target).parent().parent().children('input[type="hidden"]:eq('+image+')').val()+"); background-size : cover;");

			if(image != $(event.target).parent().children('input[type="hidden"]').length + 1){
				$(event.target).parent().children('.rcp-count-images').text(image+1+" / "+$(event.target).parent().children('input[type="hidden"]').length);
			}else{
				return;
			}


		}else{
			/*console.log('여기옴 ? actioninner');*/
			var imageChange = parseInt( $('.entry-action-inner').width() + 1)  / $(event.target).parent().parent().parent().children('input[type="hidden"]').length;
			var image = parseInt(event.offsetX / imageChange);								
			$(event.target).parent().attr("style", "background-image:url(img/representImg/"
					+$(event.target).parent().parent().parent().children('input[type="hidden"]:eq('+image+')').val()+"); background-size : cover;");

			if(image != $(event.target).parent().children('input[type="hidden"]').length + 1){
				$(event.target).parent().children('.rcp-count-images').text(image+1+" / "+$(event.target).parent().children('input[type="hidden"]').length);
			}else{
				return;
			}

		}
	})
}


function categoryClick(){
	$(document).on('click','.rcp-cursor',function(){		
		$('#category-filter').css('display','block')
		if( $(this).hasClass('rcp-category-checked')){			
			$(this).removeClass('rcp-category-checked');
			$('.category-filter-box[value="'+$(this).html()+'"]').remove();
			if($('.rcp-category-checked').length == 0){
				$('#category-filter').css('display','none')
			}
			$("body").scrollTop(0);
			esearch($('#sort-condition').val(),1, false);
//			search('newest', $('#order-latest-btn').val());
		}else{			
			$(this).addClass('rcp-category-checked');
			$('#category-filter').append('<span class="category-filter-box" value="'+$(this).html()+'">'+$(this).html()+'&nbsp;'
					+'<span class="glyphicon glyphicon-remove" aria-hidden="true">'
					+'</span></span>');
			$("body").scrollTop(0);
//			search('newest', $('#order-latest-btn').val());
			esearch($('#sort-condition').val(),1, false);
		}
	})
}



function esearch(sort, pageNo, appendFlag){ 
	var source = $('#temp').text();
	var template = Handlebars.compile(source);
	
//	pageNo=(pageNo==null)?0:pageNo;
	

	var categoryList = '';
	/*$('#rcp-category-section input[type=checkbox]:checked').each(function(index){*/
	$('.rcp-category-checked').each(function(index){		
		/*if(index !== ($('#rcp-category-section input[type=checkbox]:checked').length-1)){*/
		if(index !== ($('.rcp-category-checked').length-1)){
			categoryList += $(this).text()+' ';
		} else {
			categoryList += $(this).text();
		}				
	});	
	
	var sortArray = new Array();
	var score = {_score : {order : "desc"}};
	
	var startIndex = (pageNo-1)*8;
	
	var sortList;

	sortArray.push(score);
	
	if(sort=='newest'){
		sortList = {recipeDate : {order : "desc"}};
		sortArray.push(sortList);
	} else if(sort=='grade'){
		sortList = {recipePnt : {order : "desc"}}
		sortArray.push(sortList);
	}

	console.log(sortList);
//	sort.push(sortList);
	var should = new Array();
	var searchKeyword = $('#searchKeyword').val()==null?"":$('#searchKeyword').val(); 
	if(searchKeyword.length>0){
		var searchKeyword = {multi_match: {query:searchKeyword,  fields: ["recipeName^3", "Materials^2", "userName"]}};
		should.push(searchKeyword);
	}

	if(categoryList.length>0){
		var category = { match: { ctgName: categoryList}};
		should.push(category);
	}

	var datas = {
			  sort : sortArray,
			         query: {
			           bool: {
			             should: should
			           }
			         },
			         from: startIndex,
			         size: 8
			       };
	
	console.log(JSON.stringify(datas));

	$.ajax({
		url : 'http://112.169.38.69:9200/recipes/_search',
		method : 'post',
		data : JSON.stringify(datas),
	    dataType : 'json',
	    crossDomain: true,
		success : function(result) {
			setTimeout(function() {
				$('.wrap-loading').removeClass('display-none');
				if(!appendFlag){
					$('#tabs-1 .hs-content .container .row div').remove();
				}
				
				var likeList;
				var scrapList;
				
				if(userInfo!=null){
					var value = getMyLikeList();
					likeList = value.like;
					scrapList = value.scrap;
					console.log(likeList);
				}				
				
				var dataArray = new Array();
		    	$.each(result.hits.hits, function(index, data){
		    		for(i=0; i<likeList.length; i++){
		    			console.log(likeList[i] + ", " + data._source.recipeNo);
		    			if(likeList[i]==data._source.recipeNo){
		    				data._source.likeUser=likeList[i];
		    			}
		    		}
		    		
		    		for(i=0; i<scrapList.length; i++){
		    			console.log(scrapList[i] + ", " + data._source.recipeNo);
		    			if(scrapList[i]==data._source.recipeNo){
		    				data._source.scrapUser=scrapList[i];
		    			}
		    		}
		    	
		    		var user = {userName:data._source.userName};
		    		data._source.user=user;
		    		data._source.representImages = JSON.parse(data._source.representImages);
		    		data._source.recipeDate = new Date(data._source.recipeDate).toISOString().slice(0, 19).replace('T', ' ');;
		    		dataArray.push(data._source);
		    		console.log(data._source);
		    	});
		    	
		    	var resultData = {
		                data:dataArray
	            }
				$('#tabs-1 .hs-content .container .row').append(template(resultData));
				mouseMoveEventForSubscribeImage(result);
				
				$('#recipe-count').text('총 '+(dataArray.length+((parseInt(pageNo)-1)*8))+'개의 레시피가 검색되었습니다.');
					
				console.log(dataArray);
				
				if(appendFlag){
					console.log(dataArray.length);
					if(dataArray.length == 8){
						$('#search-pageNo').val(pageNo);
					} else {
						$('#search-pageNo').val('lastPage');
					}
				} else {
					$('#search-pageNo').attr('value', '1');
				}
					
				
			}, 500)
		},
		// 데이터 조회 중일때 로딩 이미지 보여주기
		beforeSend:function(){			  
			$('.wrap-loading').removeClass('display-none');
			$('html').css("cursor","wait");
		},
		// 데이터 받아왔을때 로딩 이미지 감추기
		complete:function(){
			setTimeout(function() {
				$('.wrap-loading').addClass('display-none');
				$('html').css("cursor","auto");
			}, 500)
		},
		error : function() {
			swal('서버 요청 오류 !')
		}
	})	
}

function getMyLikeList() {
	var obj = getLikeList().responseJSON;
	if (obj.status != 'success') {
		return;
	}
	return obj;
}

function getLikeList() {
	return $.ajax({
		url : contextRoot+'recipe/getMyLikeList.json',
		method : 'post',
		async:false,
		data : {					
			userNo:userInfo.userNo
		},
		dataType : 'json'
	});
}; /* end of jquery */