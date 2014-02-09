module.exports = function(app) {
	//single page route.	
	app.app.get('/', function(req, res) {

		app.auth.validate_Session(req, res)
			.then(function(session) {
				console.log(session);

				res.sendfile(__dirname + '/public/index.html');
			}, function(err) {
				res.render(err);
			});
	});
}