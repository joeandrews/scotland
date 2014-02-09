window.voteAppViews = {

	"votes": Backbone.View.extend({
		tagName: "section",
		className: "votes",
		initialize: function(options) {

			this.el = options.el;
			
			this.socket = options.socket;
			this.render();
		},
		render: function() {
			var schema = [];
			schema.push({
				name:'No',
				data:[this.model.attributes.againstCount]
			});
			schema.push({
				name:'Yes',
				data:[this.model.attributes.forCount]
			});
			schema.push({
				name:'Undecided',
				data:[this.model.attributes.userCount - this.model.attributes.forCount -this.model.attributes.againstCount]
			});
			$('#opinionchart').html('');
			createBarChart('#opinionchart',schema);
			// dust.render('votes', this.model.attributes, function(err, out) {
			// 	this.$el.html(out);


			// }.bind(this));


			return this;
		},
		events:{
			"click .for" :"voteFor",
			"click .against" :"voteAgainst"
		},
		voteFor: function() {
			this.socket.emit('vote', {
				vote: 'for'
			});
		},
		voteAgainst: function() {
			this.socket.emit('vote', {
				vote: 'against'
			});
		}


	}),
	'comment':Backbone.View.extend({
		tagName: "li",
		className: "comment",
		initialize: function(options) {

			this.el = options.el;
			
			this.socket = options.socket;
			this.render();
		},
		render: function() {
			console.log(this.$el);
			console.log(this.$el.parent());
			dust.render('comment', this.model.attributes, function(err, out) {
				console.log(err,out);
				this.$el.append(out);


			}.bind(this));


			return this;
		},
		events:{
			"click .up" :"voteUp",
			"click .down" :"voteDown"
		}


	})
};