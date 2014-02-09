'use strict';

module.exports = function(voteApp) {
	// Controllers
	// Create an API object that contains controllers with their dependencies injected
	var Q = voteApp.Q,
		api;
	voteApp.sub = voteApp.redis.createClient("6379", "127.0.0.1", {
		parser: 'javascript'
	});
	voteApp.pub = voteApp.redis.createClient("6379", "127.0.0.1", {
		parser: 'javascript'
	});
	voteApp.client = voteApp.redis.createClient("6379", "127.0.0.1", {
		parser: 'javascript'
	});
	voteApp.sub.subscribe("*");
	voteApp.sub.on("message", function(channel, message) {
		switch (channel) {
			case 'users:new':
				{
					api.userCount().then(function(count) {
						//sockets emig
						voteApp.io.sockets.in('users').emit('updateCount',{count:count});
					}, function(err) {
						console.log(err);
					});
					break;
				}
			case 'users:for':
				{
					api.userCount().then(function(count) {
						//sockets emig
						voteApp.io.sockets.in('users').emit('updateForCount',{count:count});
					}, function(err) {
						console.log(err);
					});
					break;
				}
			case 'users:against':
				{
					api.userCount().then(function(count) {
						//sockets emig
						voteApp.io.sockets.in('users').emit('updateAgainstCount',{count:count});
					}, function(err) {
						console.log(err);
					});
					break;
				}
			case 'users:remove':
				{
					api.userCount().then(function(count) {
						//sockets emig
						voteApp.io.sockets.in('users').emit('updateCount',{count:count});
					}, function(err) {
						console.log(err);
					});
					break;
				}
			default:
				{
					break;
				}
		}
	});
	api = {
		createComment:function(data){
			var comment = {
				id:voteApp.ShortId.generate(),
				text:data.text,
				time:new Date().getTime(),
				type: data.type;
			}
			return comment;
		},
		// need to add remove functionality for users.
		addComment:function(data){
			var deferred = Q.defer();
			var script = fs.readFileSync(__dirname + 'lua/addComment.lua', 'utf8');
			var patterns = [script, '0'];
			var redisEval = Q.nbind(Jobs.client.eval, Jobs.client);
			var comment = this.createComment(data);
			patterns.push('comments:'+comment.type);
			patterns.push('comment:'+comment.id);
			patterns.push(JSON.stringify(comment));
			redisEval(patterns).then(function(values) {
				deferred.resolve(values);
			}, function(err) {
				console.log(err);
				deferred.reject(err);
			});


			return deferred.promise;
		},
		getComments:function(){

		},
		voteComment:function(data){

			switch(data.type){
				case 'up':{
					var deferred = Q.defer();
					var script = fs.readFileSync(__dirname + 'lua/voteCommentUp.lua', 'utf8');
					var patterns = [script, '0'];
					var redisEval = Q.nbind(Jobs.client.eval, Jobs.client);
					patterns.push('comments:'+data.type);
					patterns.push('comment:'+data.id);
					patterns.push(JSON.stringify(comment));
					redisEval(patterns).then(function(values) {
						deferred.resolve(values);
					}, function(err) {
						console.log(err);
						deferred.reject(err);
					});
					break;
				}
				case 'down':{
					var deferred = Q.defer();
					var script = fs.readFileSync(__dirname + 'lua/voteCommentDown.lua', 'utf8');
					var patterns = [script, '0'];
					var redisEval = Q.nbind(Jobs.client.eval, Jobs.client);
					patterns.push('comment:'+data.id);
					patterns.push('comments:against');
					patterns.push(JSON.stringify(comment));
					redisEval(patterns).then(function(values) {
						deferred.resolve(values);
					}, function(err) {
						console.log(err);
						deferred.reject(err);
					});
					break;
				}
			}
	


			return deferred.promise;
		},
		addUser: function(data) {
			var deferred = Q.defer();
			Q.ninvoke(voteApp.client, 'ssad', 'users', data.sessionID).then(function(res) {
				voteApp.pub.publish('users:new', "NEW");
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		vote: function(data) {
			var deferred = Q.defer();

			Q.ninvoke(voteApp.client, 'ssad', 'users:' + data.vote, data.sessionID).then(function(res) {
				voteApp.pub.publish('users:' + data.vote, "NEW");
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		},
		forCount: function() {
			var deferred = Q.defer();
			Q.ninvoke(voteApp.client, 'scard', 'users:for').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		againstCount: function() {
			var deferred = Q.defer();
			Q.ninvoke(voteApp.client, 'scard', 'users:against').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		userCount: function(data) {
			var deferred = Q.defer();
			Q.ninvoke(voteApp.client, 'scard', 'users').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}
	};

	return api;
}