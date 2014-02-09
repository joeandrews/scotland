window.voteAppCollections = {
	'forComments':Backbone.Collection.extend({
		render:function(){
			$('#forComments').html('')
			for (var i = 0; i < this.models.length; i++) {
				new window.voteAppViews.comment({
				 el: "#forComments",
				 template: "comment",
		         socket:window.socket,
				 model: this.models[i]
				})
			};
		}
	}),
	'againstComments':Backbone.Collection.extend({

		render:function(){
			$('#againstComments').html('')
			for (var i = 0; i < this.models.length; i++) {
				new window.voteAppViews.comment({
				 el: "#againstComments",
				 template: "comment",
		         socket:window.socket,
				 model: this.models[i]
				})
			};
		}
	})
}