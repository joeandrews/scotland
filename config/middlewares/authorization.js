/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send(401, 'User is not authorized');
	}
	next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
	hasAuthorization: function(req, res, next) {
		// Allow if same user or admin
		if (req.profile.id != req.user.id && !req.user.isAdmin) {
			return res.send(401, 'User is not authorized');
		}
		next();
	},
	isAdmin: function (req, res, next) {
		if (!req.user || !req.user.isAdmin) {
			return res.send(401, 'User is not authorized');
		}
		next();
	}
};