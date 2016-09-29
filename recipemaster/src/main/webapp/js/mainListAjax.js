document.write('<script type"text/javascript" src="js/common.js"></script>')
document.write('<script type"text/javascript" src="js/login.js"></script>')
document.write('<script type"text/javascript" src="js/template/naverLogin_implicit-1.0.2.js"></script>')

  var mainSection = $('#recipe-1-section').html();
  var comMainSection = Handlebars.compile(mainSection); 
  
  var main2Section = $('#recipe-2-section').html();
  var comMain2Section = Handlebars.compile(main2Section); 
  
  var mainRecomSection = $('#recipe-3-section').html();
  var comMainRecomSection = Handlebars.compile(mainRecomSection); 

  var mainRecomCtSection = $('#recipe-4-section').html();
  var comMainRecomCtSection = Handlebars.compile(mainRecomCtSection);   
  
  var source = $('#recipe-card-template').html();
  var template = Handlebars.compile(source); 
  
  var mainSubscribe = $('#temp').html();
  var commainSubscribe = Handlebars.compile(mainSubscribe);   
  
  var mainTemp = $('#mainTemp').html();
  var comMainTemp = Handlebars.compile(mainTemp);   
  
  var userInfo;
  $(function(){

	  // 네이버 사용자 프로필 조회
	  //naver_id_login.get_naver_userprofile("naverSignInCallback()");
	  
	  userInfo = getUserInfo();
	  Main1List();
	  likeLogic();
	  comList();	
	  goMyPage();
	  scroll();
	  scrapLogic();
  });
  

//--------------------------  인기 레시피 ---------------------------------
  
  function Main1List(){
	  
	  var userNo = 0;
	  
	  if(userInfo != null){
		  userNo = userInfo.userNo;
	  }	  
	  
	  $.ajax({	  		  
		  url:contextRoot+'recipe/list.json',
		  dataType:'json',
		  data:{
			userNo : userNo,  
			request : 1
		  },
		  method:'post',
		  success:function(result){
			  if (result.status !='success'){
				  swal('실행중 오류 발생');
				  return;
			  }
//			  $('#main-list > div').append( comMainSection(result) );
//			  $('.list0 > .row').append( template(result) );
			  
			  $('#tabs-1 .hs-content .container .row ').append(comMainTemp( result ) );
			  
//			  for(var i=0; i<result.data.length; i++){
//				  if(result.data[i].length > 1){				  
//					  $('.rcp-main-subscribe-userName0').attr('class','rcp-main-subscribe-userName'+i+1);
//					  $('.rcp-main-subscribe-userName'+i+1).text( (result.data[i] )[0].user.userName+"님의 레시피 정보");
//				  }
//			  }
			  
			  mouseMoveEventForImage(result);
			  mouseMoveEventForSubscribeImage(result);
			  Main2List();
			  $('#popular-rcp-more').click(function(){
				  window.location.href = contextRoot+"list.html?more=popular";
			  })
		  },
		  error : function(){
			  console.log('ajax list1: 서버 요청 오류');
		  }
	  });
  }  
  
//--------------------------  최신 레시피---------------------------------
  
  function Main2List(){
	  
	  var userNo = 0;
	  
	  if(userInfo != null){
		  userNo = userInfo.userNo;
	  }	  
	  
	  $.ajax({
		  url:contextRoot+'recipe/list.json',
		  dataType:'json',
		  data:{
				userNo : userNo,  
				request : 2
			  },
		  method:'post',
		  success:function(result){
			  if (result.status !='success'){
				  swal('실행중 오류 발생');
				  return;
			  }
			  var list = result.data;
//			  $('#main-list > div').append( comMain2Section(result) );
//			  $('.list1 > .row').append( template(result) );
//			 
			  $('#tabs-2 .hs-content .container .row ').append(comMainTemp( result ) );			  
//			  for(var i=0; i<result.data.length; i++){
////				  for(var j=0; j<result.data[i].representImages.length; j++){
//					  $('.list1 div[name="recipe-image"]:eq('+i+')').attr('style','background-image:url(img/representImg/'+result.data[i].representImages[0]+')');
//
////				  }
//			  }
				
			  
			  if(userInfo != null)
			  main3List();
			  MainRecomList()
			  // more 클릭시 리스트 페이지로 이동
			  $('#newest-rcp-more').click(function(){
				  window.location.href = contextRoot+"list.html?order=newest";
			  })
		  },
		  error : function(){
			  console.log('ajax list2:서버 요청 오류');
		  }
	  });
  }  
  
  function main3List(){	  
	  $.ajax({
		  url :contextRoot+'recipe/userPage.json',
		  dataType : 'json',
		  method : 'post',
		  data:{
			  email: userInfo.email,
			  request:5
		  },
		  success : function(result) {
			 
			  if (result.status != 'success') {
				  alert('comList 실행 중 오류 발생');
				  return;
			  }
			  if(result.data.length > 1  ){
				  $('.tabs-5 .rcp-h2-25px').text("구독정보");
			  }
			  
			  for(var i=0; i<result.data.length; i++){
				  if(result.data[i].length > 1){					  
					  $('#tabs-5 .hs-content .container .row ').append(commainSubscribe( (result.data[i]) ) );
					  $('.rcp-main-subscribe-userName0').attr('class','rcp-main-subscribe-userName'+i+1);
					  $('.rcp-main-subscribe-userName'+i+1).text( (result.data[i] )[0].user.userName+"님의 레시피 정보");
					  $('.rcp-main-subscribe-userName'+i+1).attr('style','float:left');					  
					  $('.rcp-main-subscribe-userName'+i+1).next().attr('href','mypage.html?'+(result.data[i] )[0].user.email);
				  }
			  }
		  },
  error : function() {
	 alert('Main 구독 서버 요청 오류!...')
  }
});
}
  
function scroll(){
	$(window).scroll(function() { 
	    if ($(window).scrollTop() == $(document).height() - $(window).height()) {	    	
	    }
	});
}
  
  


  
  Handlebars.registerHelper('sessionUser', function(options) {	  
	  if ( userInfo != null) {
		  if( userInfo.email != null)			  
	    return options.fn(this);
	  } 
});
  
	Handlebars.registerHelper("countImage", function(value, options){
		{
			return "1 / "+value.length;
			//return "1 / ";
		}
});
 
	Handlebars.registerHelper("representImages", function(value, options){
		{			
			return value[0]
			//return value;
		}
}); 

  
//	  -------------------------------------for 문 끝 -------------------------------------

function mouseMoveEventForImage(result){
			$(document).on('mousemove','.rcp-image-scale',function(event){			
				var imageChange = parseInt( $('.rcp-image-scale').width() + 1)  / $(event.target).parent().children('input[type="hidden"]').length;				
				var image = parseInt(event.offsetX / imageChange);								
				this.style = "background-image:url(img/representImg/"+$(event.target).parent().children('input[type="hidden"]:eq('+image+')').val()+")";
				
				if(image != $(event.target).parent().children('input[type="hidden"]').length + 1){
				$(event.target).parent().children('.rcp-count-images').text(image+1+" / "+$(event.target).parent().children('input[type="hidden"]').length);
				}else{
					return;
				}
			})	
}


//--------------------------  음식사진 커서 올리면 바뀌게 되는 로직 끝 ---------------------------------
  
 
  function goMyPage(){
	  $('#profileView .goMyPageBtn').on('click',function(event){
		  event.preventDefault();
		  if(userInfo != null){
			 
			  $(location).attr('href',contextRoot+'/mypage.html?'+ userInfo.email);
		  }
		  
	  })
  }
  

  
  
  function MainRecomList(){
	  
	  $.ajax({
		  url:contextRoot+'recipe/recomList.json',
		  dataType:'json',
		  method:'post',
		  success:function(result){
			  if (result.status !='success'){
				  swal('실행중 오류 발생');
				  return;
			  }
			  var list = result.data;
//			  $('#main-list > div').append( comMainRecomSection(result) );
//			  $('.list2 > .row').append( template(result) );
			 
			  $('#tabs-3 .hs-content .container .row ').append(comMainTemp( result ) ); 
			  
			  for(var i=0; i<result.data.length; i++){
				  if(result.data[i].length > 1){				  
					  $('.rcp-main-subscribe-userName0').attr('class','rcp-main-subscribe-userName'+i+1);					  
					  $('.rcp-main-subscribe-userName'+i+1).text( (result.data[i] )[0].user.userName+"님의 레시피 정보");
					  
				  }
			  }
			  MainRecomCtList();
			  $('#recommendation-rcp-more').click(function(){
				  window.location.href = contextRoot+"list.html";
			  })
		  },
		  error : function(){
			  console.log('ajax list2:서버 요청 오류');
		  }
	  });
  }  
  
function MainRecomCtList(){
	  
	  $.ajax({
		  url:contextRoot+'recipe/recomCtList.json',
		  dataType:'json',
		  method:'post',
		  success:function(result){
			  if (result.status !='success'){
				  swal('실행중 오류 발생');
				  return;
			  }
			  var list = result.data;
			  
			  $('#tabs-4 .hs-content .container .row ').append(comMainTemp( result ) );
			  $('#ctg-more').html('추천 카테고리 : '+result.data[0].ctgName+' <a id="ctg-rcp-more" class="More">more</a>');
			  
			  for(var i=0; i<result.data.length; i++){
				  if(result.data[i].length > 1){				  
					  $('.rcp-main-subscribe-userName0').attr('class','rcp-main-subscribe-userName'+i+1);
					  $('.rcp-main-subscribe-userName'+i+1).text( (result.data[i] )[0].user.userName+"님의 레시피 정보");
				  }
			  }			  
			  $('#ctg-rcp-more').click(function(){
				  window.location.href = contextRoot+"list.html?ctg="+result.data[0].ctgName;
			  })
		  },
		  error : function(){
			  console.log('ajax list2:서버 요청 오류');
		  }
	  });
}
