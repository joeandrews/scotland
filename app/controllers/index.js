'use strict';

module.exports = function(Q, config) {
	return {
		render: function(req, res) {
			res.sendfile(__dirname + '/index.html');
		}
	};
};