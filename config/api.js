'use strict';

module.exports = function(chefler) {
	var dep = chefler.dependencies,
		// Controllers

		Index = require('../app/controllers/index.js');

	// Create an API object that contains controllers with their dependencies injected
	var api = {
		index: new Index(dep.Q, dep.config)
	};

	return api;
}