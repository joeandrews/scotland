/**
 * Module dependencies.
 */
var express = require('express'),
	fs = require('fs'),
	// passport = require('passport'),
	jade = require('jade');

global._ = require('lodash');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	config = require('./config/config'),
	auth = require('./config/middlewares/authorization'),
	app = {};
app.dependencies = {
	config: config,
	twit: require('twit'),
	express: express,
	ShortID: require('shortid'),
	Q: require('q'),
	moment: require('moment'),
	redis: require('redis'),
	fs: fs
};


app.api = require('./config/api.js')(app);
//bootstrap passport config

app.app = express();

app.app.use('/lib', express.static(__dirname + '/bower_components'));

//express settings
require('./config/express')(app.app, app);

//Bootstrap routes
require('./config/routes')(app.app, auth, app.api);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.app.listen(port);
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;