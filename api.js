'use strict';

module.exports = function(voteApp) {
	
	var Q = voteApp.Q,
		api;
	// voteApp.sub = voteApp.redis.createClient("6379", "127.0.0.1", {
	// 	parser: 'javascript'
	// });
	// voteApp.pub = voteApp.redis.createClient("6379", "127.0.0.1", {
	// 	parser: 'javascript'
	// });
	// voteApp.client = voteApp.redis.createClient("6379", "127.0.0.1", {
	// 	parser: 'javascript'
	// });
	// voteApp.sub.subscribe("*");
	// voteApp.sub.on("message", function(channel, message) {
	// 	switch (channel) {
	// 		case 'users:new':
	// 			{
	// 				api.userCount().then(function(count) {
	// 					//sockets emig
	// 					voteApp.io.sockets.in('users').emit('updateCount',{count:count});
	// 				}, function(err) {
	// 					console.log(err);
	// 				});
	// 				break;
	// 			}
	// 		case 'users:for':
	// 			{
	// 				api.userCount().then(function(count) {
	// 					//sockets emig
	// 					voteApp.io.sockets.in('users').emit('updateForCount',{count:count});
	// 				}, function(err) {
	// 					console.log(err);
	// 				});
	// 				break;
	// 			}
	// 		case 'users:against':
	// 			{
	// 				api.userCount().then(function(count) {
	// 					//sockets emig
	// 					voteApp.io.sockets.in('users').emit('updateAgainstCount',{count:count});
	// 				}, function(err) {
	// 					console.log(err);
	// 				});
	// 				break;
	// 			}
	// 		case 'users:remove':
	// 			{
	// 				api.userCount().then(function(count) {
	// 					//sockets emig
	// 					voteApp.io.sockets.in('users').emit('updateCount',{count:count});
	// 				}, function(err) {
	// 					console.log(err);
	// 				});
	// 				break;
	// 			}
	// 		default:
	// 			{
	// 				break;
	// 			}
	// 	}
	// });
	api = {

		// need to add remove functionality for users.
		addUser: function(data) {
			var deferred = Q.defer();
			Q.ninvoke(client, 'ssad', 'users', data.sessionID).then(function(res) {
				voteApp.pub.publish('users:new', "NEW");
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		vote: function(data) {
			var deferred = Q.defer();

			Q.ninvoke(client, 'ssad', 'users:' + data.vote, data.sessionID).then(function(res) {
				voteApp.pub.publish('users:' + data.vote, "NEW");
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});

			return deferred.promise;
		},
		forCount: function() {
			var deferred = Q.defer();
			Q.ninvoke(client, 'scard', 'users:for').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		againstCount: function() {
			var deferred = Q.defer();
			Q.ninvoke(client, 'scard', 'users:against').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		userCount: function(data) {
			var deferred = Q.defer();
			Q.ninvoke(client, 'scard', 'users').then(function(res) {
				deferred.resolve(res);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		},
		getTweets: function(data) {
			var deferred = Q.defer();
			voteApp.connection.query('SELECT tweet_count_for, tweet_count_against ' + 
 				  		  			 'FROM tweet_count ' +
 				          			 'ORDER BY time ASC ' +
 				         			 'LIMIT 100',
 				function(tweets){
					deferred.resolve(tweets);
			})
			return deferred.promise;
		},
	};

	return api;
}