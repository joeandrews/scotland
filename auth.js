module.exports = function(app) {
	app.passport.serializeUser(function(user, done) {
		var sessionuser = {
			"id": user.id
		}
		done(null, sessionuser);
	});

	app.passport.deserializeUser(function(user, done) {
		console.log(user);
		done(err, user);

	});

	// app.passport.use(new app.FacebookStrategy({
	// 	clientID: "442940652449989",
	// 	clientSecret: "8a98209874b1a22312b6c03288ab7bc8",
	// 	profileFields: ['id', 'displayName', 'photos', 'emails'],
	// 	callbackURL: "/auth/facebook/callback"
	// }, function(accessToken, refreshToken, profile, done) {
	// 	// asynchronous verification, for effect...

	// 	process.nextTick(function() {

	// 		app.db.db.models.user.findOne({
	// 			'auth_Data.facebook.id': profile._json.id
	// 		}, function(err, existingUser) {
	// 			if (err) {
	// 				return done(err);
	// 			}
	// 			if (existingUser) {

	// 				// user is already linked to facebook account so return user and update access token
	// 				return done(null, existingUser);
	// 			} else {
	// 				//no user linked
	// 				console.log("no user");
	// 				profile.access_Token = accessToken;
	// 				app.auth.signup(profile).then(function(newUser) {

	// 					return done(null, newUser);
	// 				}, function(e) {
	// 					console.log("err");
	// 					return done(err);
	// 				});

	// 			}
	// 		});
	// 		// To keep the example simple, the user's Facebook profile is returned to
	// 		// represent the logged-in user.  In a typical application, you would want
	// 		// to associate the Facebook account with a user record in your database,
	// 		// and return that user instead.

	// 	});
	// }));
	return {

		get_cookie: function(req) {
			var cookie = app.cookie.parse(req.headers.cookie);
			var sessionID = cookie['express.sid'].replace(app.prefix, "");
			var parsedcookie = app.signature.unsign(sessionID, "monkey");
			return parsedcookie;
		},
		validate_Session: function(req) {

			var deferred = app.Q.defer();

			if (req.headers.cookie) {

				app.sessionStore.get(this.get_cookie(req), function(err, session) {

					if (session) {

						deferred.resolve(session);
					} else {
						deferred.reject(err);

					}
				});
			} else {
				deferred.reject("No Cookie Set");
			}

			return deferred.promise;

		},
		update_Session: function(req, sess) {
			var deferred = app.Q.defer();
			sess.id = this.get_cookie(req);
			app.sessionStore.set(sess.id, sess, function(err, session) {

				if (session) {

					deferred.resolve(session);

				} else {

					deferred.reject(error);
				}
			});
			return deferred.promise;
		},

		end_Session: function(req) {
			app.sessionStore.destroy(this.get_cookie(req), function(err, session) {

			});
		}



	}
};