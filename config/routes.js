'use strict';

module.exports = function(app, auth, api) {

	// Setting the facebook oauth routes
	// app.get('/auth/facebook', passport.authenticate('facebook', {
	// 	scope: ['email'],
	// 	failureRedirect: '/#/1'
	// }), api.users.signin);

	// app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	// 	failureRedirect: '/#/1'
	// }), api.users.authCallback);

	// Home route
	app.get('/', api.index.render);
};