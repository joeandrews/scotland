var views = {}
var models = {};
var collections = {};
var comment = {};
window.socket = function() {

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
        collections.forComments = new window.voteAppCollections.forComments(data.popComments[1]);
        collections.againstComments = new window.voteAppCollections.againstComments(data.popComments[1]);
        createLineChart('#tweetchartyes', "Yes Camp", data.tweets[0]);
        createLineChart('#tweetchartno', "No Camp", data.tweets[1]);
	});
    socket.on('votes',function(data){
        models.userCount.set(data);
        views.users.render();
    })
	return socket;

}

$(document).ready(function(){
    window.socket = window.socket();
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

    $('#yesComment').click(function(){
        comment.type = 'for';
    });
     $('#noComment').click(function(){
       comment.type = 'against';
    });
    $('#addComment').click(function(){
        var data = comment;
        comment.text = $('#commentText').val();
        socket.emit('addComment',data)
    });
});