module.exports = function(app) {
	app.passport.serializeUser(function(user, done) {
		var sessionuser = {
			"id": null
		}
		done(null, sessionuser);
	});

	app.passport.deserializeUser(function(user, done) {
		console.log(user);
		done(err, user);

	});

	return {

		get_cookie: function(req) {
			console.log(req);
			var cookie = app.cookie.parse(req.headers.cookie);
			var sessionID = cookie['express.sid'].replace(app.prefix, "");
			var parsedcookie = app.signature.unsign(sessionID, "monkey");
			return parsedcookie;
		},
		validate_Session: function(req) {

			var deferred = app.Q.defer();

			if (req.headers.cookie) {

				app.sessionStore.get(this.get_cookie(req), function(err, session) {
					console.log(arguments);
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