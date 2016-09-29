/* GET/POST 파라미터 처리 => body-parser 모듈 사용! */
function getContextRoot(port){
	return "http://52.78.170.190:"+port+"/";
//	return "http://localhost:"+port+"/";
}

/*require('daemon')();*/
var mysql = require('mysql');
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

var pool  = mysql.createPool({
  connectionLimit : 10,
  /*host     : 'localhost',*/
  host     : '52.78.170.190',
  port     : '3306',
  user     : 'root',
//  port     : '4000',
//  user     : 'java83',
  password : '1111',
  database : 'recipe'
});

pool.on('connection', function() {
	console.log('커넥션 객체가 생성되었음.');
});

app.get('/', function (request, response) {
	response.send('Express 적용 예제');
});

app.get('/user/checkDuplication.do', function (request, response) {
	pool.query('SELECT * FROM users WHERE email = ?',
		  [request.query.email],
		  function(err, rows, fields) { 
		  if (err) throw err;
		  response.writeHead(200, {
			'Content-Type' : 'text/plain;charset=UTF-8' 
		  });
		  
		  var check = 'true';
		  if (rows[0] != null){
			  check = 'false';
		  }
		  response.write(check);
		  response.end();
	});
});


app.listen(9999, function () {
	console.log('Example app listening on port 9999!');
});