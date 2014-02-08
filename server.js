/**
 * Module dependencies.
 */

global._ = require('lodash');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var voteApp;
voteApp = {
	twit: require('twit'),
	ShortID: require('shortid'),
	Q: require('q'),
	moment: require('moment'),
	redis: require('redis')
};
voteApp.passport = require('passport');
voteApp.signature = require("cookie-signature");
voteApp.prefix = "s:";
voteApp.http = require("http");
voteApp.express = require('express');
voteApp.app = voteApp.express();
voteApp.server = voteApp.http.createServer(voteApp.app);
voteApp.auth = require('./auth.js')(voteApp)
voteApp.Session = require("connect").middleware.session.Session;
voteApp.cookie = require("cookie");
voteApp.RedisStore = require('connect-redis')(voteApp.express);
voteApp.router = require("./router.js");
voteApp.sessionStore = new voteApp.RedisStore({
	client: voteApp.redis.createClient("6379", "127.0.0.1"),
	port: ("6379")
});
voteApp.io = require('socket.io');
voteApp.api = require('./config/api.js')(voteApp);
//bootstrap passport config

//express settings
voteApp.app.configure(function() {

	this.use(voteApp.express.bodyParser());
	this.set('port', process.env.PORT || 8081);
	this.use(voteApp.express.cookieParser('monkey'));
	this.use(voteApp.express.session({
		secret: 'monkey',
		store: voteApp.sessionStore,
		key: "express.sid"

	}));
	this.use(voteApp.passport.initialize());
	this.use(voteApp.passport.session());
	this.use(this.router);
	this.use(voteApp.express.methodOverride());

	this.use(voteApp.express.static(__dirname + '/public'));

});

voteApp.server.listen(voteApp.app.get("port"));
voteApp.io = voteApp.io.listen(voteApp.server);
voteApp.io.configure(function() {

	this.set('authorization', function(data, accept) {

		voteApp.auth.validate_Session(data)
			.then(function(session) {
				console.log(session);
				data.session = session;
				accept(null, true);
			}, function(err) {
				console.log(err);
				accept('Error', false);
			});

	});


});

voteApp.router(voteApp);

voteApp.io.sockets.on('connection', function(client) {

	var hs = client.handshake;
	var session = hs.session;
	session.socketID = client.id;

	voteApp.auth.update_Session(hs, session)
		.then(function(d) {
			console.log('socket.session')

			if (session.passport.user) {
				//join room
				client.join(session.passport.user.id);
				client.emit("welcome", session);

			} else {

				client.emit("welcome", session);
				// lets do something here
			}

		}, function(e) {
			socket.emit("nosession", {
				err: e
			});
		});

});
voteApp.io.sockets.on('disconnect', function(client) {
	console.log('DISCONNESSO!!! ');
	voteApp.auth.end_Session(client.handshake);

});