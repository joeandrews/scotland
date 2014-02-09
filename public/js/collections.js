window.voteAppCollections = {
	'forComments':Backbone.Collection.extend({

	}),
	'againstComments':Backbone.Collection.extend({

		render:function(){
			$('#againstComments').html('')
			for (var i = 0; i < this.models.length; i++) {
				new window.voteAppViews.comment({
				 el: ".comment",
				 template: "comment",
		         socket:window.socket,
				 model: this.models[i]
				})
			};
		}
	})
}