var roomName = "";
var nickName = "";

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

function refreshComments(data){
	var chat = $("#chat");
	chat.empty();
	data.forEach(function(row){
 	 	chat.append('<li><strong>'+row.nickname+': </strong>'+row.body+'</li>');
	});
	chat[0].scrollTop = chat[0].scrollHeight;
}

function sendMessage(event) {
    // prevent the page from redirecting
      event.preventDefault();

    // get the parameters 
    var message = $("#messageField").val(); // get message 

    // send it to the server
    console.log(nickName, message);
    $.post('/' + meta('roomId') + '/messages', {nickname:nickName, message:message}, function(res){
    	console.log("message sent");
        getComments();
    });
}

function getComments(){
	$.get('/' + meta('roomId') + '/messages', function(res){
		console.log("got comments");
		console.log(res);
        refreshComments(res);
    });
}


$(document).ready(function(){
	console.log("hi");
	roomName = meta('roomId');
	nickName = prompt("Please enter your name", "Harry Potter");
    if (nickName === "" || nickName === null) {
        nickName = "anon";
    }
	console.log(roomName);
	var messageForm = $('#messageForm').submit(sendMessage);
	getComments();
	setInterval(getComments, 3000);
});