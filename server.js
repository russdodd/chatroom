var express = require('express');
var bodyParser = require('body-parser');
var anyDB = require('any-db');
var dbURL = "sqlite3://chatroom.db";
var engines = require('consolidate');
var app = express();
//var __dirname = 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html');
// you will probably need to require more dependencies here.

var pool = anyDB.createPool(dbURL, {min: 2, max: 20});


var sql = "CREATE TABLE " + 
//	"IF NOT EXISTS " +
"message (" +
	"id INTEGER PRIMARY KEY AUTOINCREMENT," + 
  "room TEXT," +
  "nickname TEXT," + 
  "body TEXT," + 
  "time datetime default current_timestamp)";
var q = pool.query(sql, function(error, result){
    //processResult(error,result);
    console.log("finished query");
});
sql = "CREATE TABLE " + 
//	"IF NOT EXISTS " +
"room (" +
	"id TEXT PRIMARY KEY," + 
  "name TEXT)";
q = pool.query(sql, function(error, result){
    //processResult(error,result);
    console.log("finished query");
});

function processResult(error, result){
    var messages = result.rows;
    //do something with your messages here...
};
//app.use(express.static(__dirname + '/templates'));
app.use(express.static(__dirname + '/public'));
console.log(__dirname);

app.get('/recent/rooms', function(request, response){
	console.log("request: recent");
    // fetch all of the messages for this room, below is a placeholder for the messages you need to fetch
    var sql = "SELECT room.id, room.name from "+
    "(SELECT room FROM message group by room ORDER BY time DESC limit 10)"+ 
    " as roomIDs inner join room on roomIDs.room=room.id";
	var q = pool.query(sql, function(error, result){
		if (error == null){
    	var messages = result.rows;
    	console.log("received messages");
    	response.json(messages);
    } else {
    	console.log(error);
    }
    return true;
	});	
    //var messages = [{nickname: 'Bieber', body: 'you should go and love yourself.'}];
	// encode the messages object as JSON and send it back
    //response.json(messages);
});
//app.use(express.static(__dirname + '/public'));
// your app's code here
app.get('/:roomName', function(request, response){
  // do any work you need to do, then
  if (request.params.roomName === "favicon.ico"){
  	return false;
  }
  var sql = "Select name from room " + 
	"where room.id=$1";
	var q = pool.query(sql, [request.params.roomName], function(error, result){
    console.log("retrieved name", result.rows[0].name, request.params.roomName);
    console.log("Roomname",request.params.roomName);
  	response.render('room.html', {roomId: request.params.roomName,roomName: result.rows[0].name});
	});
});

function generateRoomIdentifier() {
  // make a list of legal characters
  // we're intentionally excluding 0, O, I, and 1 for readability
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  var result = '';
  for (var i = 0; i < 6; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));

  return result;
}

app.post('/:roomName/messages', saveMessage);

function saveMessage(request, response) {
  var name = request.params.roomName;   // 'ABC123'
  var nickname = request.body.nickname; // 'Bieber'
  var message = request.body.message;   // 'Is it too late now to say sorry?'
  console.log(nickname,name,message);
  var sql = "INSERT INTO message(room,nickname,body) " + 
	"VALUES ($1, $2, $3)";
	var q = pool.query(sql, [name,nickname,message], function(error, result){
    console.log("saved message query");
    response.end('message saved');
	});
}

app.post('/create', generateId);

function generateId(request, response) {
  //var name = request.params.roomName;   // 'ABC123'
  var name = request.body.roomname; // 'Bieber'
  var id = generateRoomIdentifier();
  //var message = request.body.message;   // 'Is it too late now to say sorry?'
  console.log(name,id);
  var sql = "INSERT INTO room(id,name) " + 
	"VALUES ($1, $2)";
	var q = pool.query(sql, [id,name], function(error, result){
    console.log("saved message query");
    response.end(id);
	});
}

app.get('/:roomName/messages', function(request, response){
	var name = request.params.roomName;   // 'ABC123'
	console.log("roomname: " + name);
    // fetch all of the messages for this room, below is a placeholder for the messages you need to fetch
    var sql = 'SELECT nickname, body, time FROM message WHERE room=$1 ORDER BY time ASC';
	var q = pool.query(sql, [name], function(error, result){
		if (error == null){
    	var messages = result.rows;
    	console.log("received messages");
    	response.json(messages);
    } else {
    	console.log(error);
    }
	});	
    //var messages = [{nickname: 'Bieber', body: 'you should go and love yourself.'}];
	// encode the messages object as JSON and send it back
    //response.json(messages);
});

app.listen(8080);















