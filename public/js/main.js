var socket = function() {

	var socket = io.connect('http://localhost:8081');
	socket.on("welcome", function(data) {
		console.log(data);
		var users = new window.voteAppViews.votes({
		 el: ".votes",
		 template: "votes",
         socket:this,
		 model: new window.voteAppmodels.userCount(data)
		});

	});
	return socket;

}

$(document).ready(function(){
    socket = socket();
});