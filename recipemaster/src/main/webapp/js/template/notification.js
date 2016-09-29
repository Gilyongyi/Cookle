//document.write('<script type"text/javascript" src="js/common.js"></script>')
//이 부분은 뭔지는 모르겠지만, 노티가 지원해주지 않는 브라우저로 접속했을때 리턴시켜주는 부분같음. 
//다른 예제 코드도 항상 비슷하게 리턴시켜버림. 

document.addEventListener('DOMContentLoaded', function () {
	if (!Notification) {
		alert('Desktop notifications not available in your browser. Try Chromium.'); 
		return;
	}

	if (Notification.permission !== "granted")
		Notification.requestPermission();
});

function notifyMe(data) {
	console.log(data);
//	------------- notification는 상태값으로 granted와 denied를 return해줌.   denied는 false같은 개념 -------------
	var value = data.split("/");

	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {

//		new Notification()객체를 생성해서 알림뷰(푸쉬)로 리턴해줌
		if(value[0]=='rp'){
			var notification = new Notification('기분 좋은 소식을 전해드립니다.', {
				icon: 'img/profileImg/'+value[3],
				body: value[1]+"님께서 "+value[1]+"에 "+value[5]+"에 댓글을 남기셨습니다.",
			});

			notification.onclick = function () {
//				window.open(contextRoot+"mypage.html?"+value[1]);
				recipeDetailPopup(value[4]);
			};

			setTimeout(notification.close.bind(notification), 4000);
		} else if(value[0]=='msg'){
			var notification = new Notification('기분 좋은 소식을 전해드립니다.', {
				icon: 'img/profileImg/'+value[3],
				body: value[1]+"님께서 방명록을 남기셨습니다.",
			});

			notification.onclick = function () {
				window.open(contextRoot+"mypage.html?"+value[1]);
			};

			setTimeout(notification.close.bind(notification), 4000);
		} 
	} 
}