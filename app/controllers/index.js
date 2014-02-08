'use strict';

module.exports = function(Q, config) {
	return {
		render: function(req, res) {
			console.log(__dirname);
			res.sendfile(__dirname + '/index.html');
		}
	};
};