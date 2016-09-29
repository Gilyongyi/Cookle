$(function() {
	loadUsers();
	$('.rankingWrapper').bxSlider({
	startSlide : 0,
	pager : false,
	moveSlides : 1,
	infiniteLoop : true
	});
	loadMonthRank();
	loadTodayRank();
	
	function loadUsers() {
		var source = $('#main-chefRanking').text();
		var template = Handlebars.compile(source);

		$.ajax({
			url : contextRoot+'user/top3.json',
			dataType : 'json',
			method : 'get',
			async : false,
			success : function(result) {
				if (result.status != 'success') {
					swal('chefCard.js 오류');
					return;
				}
				for (var i = 0; i < result.data.length; i++) {
					if (result.data[i].subscribeUser == 0) {
						result.data[i].status = null;
					} else {
						result.data[i].status = Boolean(true);
					}
				}

				$('.wrapper-chefs').append(template(result));
			},
			error : function() {
				swal('서버 요청 오류!...')
			}
		});
	}// end of 쉐프카드

	function loadMonthRank() {
		var source = $('#chef-card-template').text();
		var template = Handlebars.compile(source);

		$.ajax({
			url : contextRoot+'user/monthtop3.json',
			dataType : 'json',
			method : 'get',
			success : function(result) {
				if (result.status != 'success') {
					swal('chefCard.js 오류');
					return;
				}

				for (var i = 0; i < result.data.length; i++) {
					if (result.data[i].subscribeUser == 0) {
						result.data[i].status = null;						
					} else {
						result.data[i].status = Boolean(true);				
					}
				}				
				$('#rcp-chef-rank-month').append(template(result));
			},
			error : function() {
				swal('서버 요청 오류!...')
			}
		});
	}// end of 쉐프카드

	function loadTodayRank() {
		var source = $('#chef-card-template').text();
		var template = Handlebars.compile(source);

		$.ajax({
			url : contextRoot+'user/todaytop3.json',
			dataType : 'json',
			method : 'get',
			success : function(result) {
				if (result.status != 'success') {
					swal('chefCard.js 오류');
					return;
				}

				for (var i = 0; i < result.data.length; i++) {
					if (result.data[i].subscribeUser == 0) {
						result.data[i].status = null;						
					} else {
						result.data[i].status = Boolean(true);						
					}
				}				
				$('#rcp-chef-rank-today').append(template(result));
			},
			error : function() {
				swal('서버 요청 오류!...')
			}
		});
	}// end of 쉐프카드
	
    var sourceChef = $('#chef-rank-template').text();
    var templateChef = Handlebars.compile(sourceChef);
    loadChefRanking();

    function loadChefRanking() {
      $.ajax({
        url : 'user/rank.json',
        dataType : 'json',
        method : 'get',
        success : function(result) {
          if (result.status != 'success') {
            alert('실행중 오류 발생');
            return;
          }
          var list = result.data;
          $('#chefRanking').append(templateChef(result));
        },
        error : function() {
          alert('서버 요청 오류');
        }
      });
    }
    
    var sourceRcp = $('#recipe-rank-template').text();
    var templateRcp = Handlebars.compile(sourceRcp);
    loadRcpRanking();

    function loadRcpRanking() {
      $.ajax({
        url : 'recipe/rank.json',
        dataType : 'json',
        method : 'get',
        success : function(result) {
          if (result.status != 'success') {
             alert('실행중 오류 발생');
            return;
          }
          var list = result.data;
          $('#recipeRanking').append(templateRcp(result));
        },
        error : function() {
           alert('서버 요청 오류');
        }
      });
    }
    
    var sourceMy = $('#chef-myrank-template').text();
    var template1 = Handlebars.compile(sourceMy);
    loadMyRanking();

    function loadMyRanking() {
      $.ajax({
        url : 'user/myrank.json',
        dataType : 'json',
        method : 'get',
        success : function(result) {
          if (result.status != 'success') {
        	  alert('실패');
            return;
          }
          var list = result.data;
          if(list!=null){
        	  var appendData = 
        		  '<h2 class="rcp-ranking-middle-background-comment" id="chefMyRanking">'
        		  +'내 순위는 ' +list.rownum+'등 입니다. [ '+list.grade+' ] <br/>'+
        		  '레시피 '+list.recipeCount+'개 / 구독자 '+list.subsCount+'명 / 토탈포인트 '
        		  +list.totalPoint+'점</h2>'
        		    
                  $('.rcp-profileCover').append($(appendData));
          }
          
          console.log(result);
        },
        error : function() {
          alert('서버 요청 오류');
        }
      });
    }
    
    
});

$(document).on('click', '.rcp-userName, .rcp-nickname , .rcp-profile',function(event){
	event.preventDefault();
	console.log( "event target : "+$(event.target).attr('class') )
	$(location).attr('href',contextRoot+'mypage.html?'+$(event.target).parent().children('input[type="hidden"]').val() );
	console.log("email val()"+$(event.target).parent().children('input[name="email"]').val() );
})

$('.rcp-BoC').on('click',function(){
	$(location).attr('href',contextRoot+'ranking.html');
})

