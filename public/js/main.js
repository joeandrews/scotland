var views = {}
var models = {};
var socket = function() {

	var socket = io.connect('http://localhost:8081');
	socket.on("welcome", function(data) {
		console.log(data);
        models.userCount = new window.voteAppmodels.userCount(data);
		views.users = new window.voteAppViews.votes({
		 el: ".votes",
		 template: "votes",
         socket:this,
		 model: models.userCount
		});

	});
    socket.on('votes',function(data){
        models.userCount.set(data);
        views.users.render();
    })
	return socket;

}

$(document).ready(function(){
    socket = socket();
    $('#yesVote').click(function(){
        socket.emit('vote',{
            vote:'for'
        })
    });
    $('#noVote').click(function(){
        socket.emit('vote',{
            vote:'against'
        })
    });
});