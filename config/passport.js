module.exports = function(passport, chefler) {

	// var LocalStrategy = require('passport-local').Strategy,
	// 	FacebookStrategy = require('passport-facebook').Strategy,
	// 	config = chefler.dependencies.config;

	// //Serialize sessions
	// passport.serializeUser(function(user, done) {
	// 	done(null, user.id);
	// });

	// passport.deserializeUser(function(id, done) {
	// 	// User.findOne({
	// 	// 	_id: id
	// 	// })
	// 	// 	.exec(function(err, user) {

	// 	// 		done(err, user);
	// 	// 	});
	// });

	// //Use local strategy
	// passport.use(new LocalStrategy({
	// 		usernameField: 'email',
	// 		passwordField: 'password'
	// 	},
	// 	function(email, password, done) {

	// 		// User.findOne({
	// 		// 	email: email.toLowerCase()
	// 		// }, {
	// 		// 	//hashedPassword: 0
	// 		// })
	// 		// 	.exec(function(err, user) {
	// 		// 		if (err) {
	// 		// 			return done(err);
	// 		// 		}

	// 		// 		if (!user) {
	// 		// 			return done(null, false, {
	// 		// 				message: 'Unknown user'
	// 		// 			});
	// 		// 		}

	// 		// 		if (!user.authenticate(password)) {
	// 		// 			return done(null, false, {
	// 		// 				message: 'Invalid password'
	// 		// 			});
	// 		// 		}


	// 		// 		delete user.hashedPassword;


	// 		// 		return done(null, user);
	// 		// 	});

	// 	}
	// ));

	// //Use facebook strategy
	// passport.use(new FacebookStrategy({
	// 		clientID: config.facebook.clientID,
	// 		clientSecret: config.facebook.clientSecret,
	// 		callbackURL: config.facebook.callbackURL
	// 	},
	// 	function(accessToken, refreshToken, profile, done) {
	// 	// User.findOne({
	// 	// 	'facebookId': profile.id
	// 	// })
	// 	// 	.exec(function(err, user) {
	// 	// 		if (user) {


	// 	// 			user.hashedPassword = undefined;
	// 	// 		}

	// 	// 		return done(err, user);
	// 	// 	});
	// 	}
	// ));
};