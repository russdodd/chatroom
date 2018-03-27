function generateId(event){
    // prevent the page from redirecting
      event.preventDefault();

    // get the parameters 
    var name = $("#nameField").val(); // get message 

    // send it to the server
    console.log(name);
    $.post('/create', {roomname:name}, function(res){
    	console.log("message sent", res);
        window.location.href = res;
    });
    return false;
}
function updateRecent(data){
	var recent = $("#recent");
	recent.empty();
	data.forEach(function(row){
 	 	recent.append('<li><strong><a href="'+row.id+'">'+row.name + '</a></strong></li>');
	});
}

function getRecent(){
	$.get('/recent/rooms', function(res){
    	console.log("done", res);
        updateRecent(res);
    });
}

function gotoExisting(event){
	event.preventDefault();
	window.location.href = $("#idField").val();
}


$(document).ready(function(){
    var messageForm1 = $('#messageForm2').submit(generateId);
    var messageForm2 = $('#messageForm1').submit(gotoExisting);
    getRecent();
});