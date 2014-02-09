window.voteAppViews  = { 
	
	"votes":Backbone.View.extend({
			tagName:"section",
            className:"votes",
			initialize:function(options){
				
				this.el = options.el;
				this.socket = options.socket;
				this.render();
			},
			render:function(){
			 	dust.render(this.template, this.model.attributes, function(err,out){
			                      
			        this.$el.html(out);
			    
			                       
			    }.bind(this));
			                    

			    return this;
			},
			events:{
				"click .for" :"voteFor",
				"click .against" :"voteAgainst"
			},
			voteFor:function(){
				this.socket.emit('vote',{vote:'for'});
			},
			voteAgainst:function(){
				this.socket.emit('vote',{vote:'against'});
			}


	})
};