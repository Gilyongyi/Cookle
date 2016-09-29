///////////////////////////////////////////
function getContextRoot(port){
	return "http://tkddlf59.dlinkddns.com:"+port+"/";
//	return "http://localhost:"+port+"/";
}
var nodemailer = require("nodemailer");

var generator = require('xoauth2').createXOAuth2Generator({
	user: "somangily@gmail.com", 

	clientId: "854303379765-qfo2qv1jb1me218j4j6ht6321siq5hrp.apps.googleusercontent.com",
	clientSecret: "6G1aI3dxZIgOVHcwb90mciqt",
	refreshToken: "1/H25r6ikpWsThkpi0S60c40hQ-iEYWZF7b8IFneady8U"

});

// listen for token updates 
// you probably want to store these to a db 
generator.on('token', function(token){
	console.log('New token for %s: %s', token.user, token.refreshToken);
});
///////////////////////////////////////////

/* GET/POST 파라미터 처리 => body-parser 모듈 사용! */
var dateFormat = require('dateformat');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//express 모듈에 보조 장치 장착한다.
app.use(bodyParser.json()); // JSON 형식으로 넘오온 데이터 처리 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('www'));
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});





app.get('/', function (request, response) {
	response.send('Express 적용 예제');
});


app.get('/user/authentication.do', function (request, response) {
	var email = request.query.email;
	var authKEY = request.query.authKEY;
	var auth=1;

	// login 
	var transporter = nodemailer.createTransport(({
		service: 'gmail',
		auth: {
			xoauth2: generator
		}
	}));

	// send mail 
	transporter.sendMail({
		from: "somangily@gmail.com",
		to: email,
		subject: "href",
		generateTextFromHTML: true,
		html: "<a href="+getContextRoot('7979')+"user/auth.do?authKEY="+authKEY+"&auth="+auth+"&email="+email+">"+email+"님 환영합니다."+"</a>"

	}, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log('Message sent');
		}
	});


	response.end();
});



app.listen(8888, function () {
	console.log('Example app listening on port 8888!');
});