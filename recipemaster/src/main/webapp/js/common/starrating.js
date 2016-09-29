// 별점등록 버튼 이벤트
function starRatingBtn(){
    	
	$(document).on('click','#rcp-starrating-btn-apply',function(){
		if($('input[name="rating"]:checked').val() != undefined){
			$.ajax({
				url : contextRoot+'recipe/starRate.json',
				method : 'post',
				data : {
					grade : $('input[name="rating"]:checked').val(),
					recipeNo : $('#detail-recipeNo').val()
				},
				dataType : 'json',
				success : function(result) {				
					if (result.status != 'success'){
						swal('에러');
						return;
					}
					if (result.loginCheck == true){
						swal($('input[name="rating"]:checked').val()+'점을 주셨습니다 !');
						$('#rcp-starrating').remove();
						$('.rcp-rating').remove();
						$('#rcp-starrating-btn-apply').remove();
						
						checkDuplicateGrade();						
					} else if (result.loginCheck == false){
						swal('로그인 하셔야 이용하실수 있습니다.');
					}
				},
				error : function(request,status,error) {
					alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				}
			})
		} else {
			swal('별점을 매겨주세요');
		}
	})
}

// 이미 별점을 부여한 레시피인지 확인
function checkDuplicateGrade(){
	var starRating = $('#starrating-template').text();
	var compileStarRating = Handlebars.compile(starRating);
	
	$.ajax({
		url : contextRoot+'recipe/checkDuplicateGrade.json',
		method : 'post',
		data : {
			recipeNo : $('#detail-recipeNo').val()
		},
		dataType : 'json',
		success : function(result) {				
			if (result.status != 'success'){
				swal('에러');
				return;
			}
			$('.rcp-icons-info').append(compileStarRating(result));
			
		},
		error : function(request,status,error) {
			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	})
}