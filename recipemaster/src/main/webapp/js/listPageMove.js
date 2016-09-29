$(document).ready(function() {
	// 검색창에서 엔터시 파라미터와 list.html로 이동
	$('#searchKeyword').keydown(function(key){
		if(key.keyCode == 13){
			window.location.href = contextRoot+"list.html?sk="+$(this).val();
		}
	})
})