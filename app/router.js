define([
	
	// Application.
	
	"app",
	
	// Modules.
	
	"modules/shot"
	
],
	
function(app, Shot) {
	
	// Defining the application router, you can attach sub routers here.
	
	var Router = Backbone.Router.extend({
		
		initialize: function() {
			
			// TODO Clean this up...
			
			var collections = {
				
				// Set up the shots.
				
				shots: new Shot.Collection()
				
			};
			
			// Ensure the router has references to the collections.
			
			_.extend(this, collections);
			
			// Use main layout and set Views.
			
			app.useLayout("main-layout").setViews({
				
				".shots"	:	new Shot.Views.List(collections)
				
			}).render();
			
		},
		
		routes: {
			
			"": "index",
			":name": "shot"
			
		},
		
		index: function() {
			
			// Reset the state and render.
			
			this.reset();
			
		},
		
		shot: function(name) {
			
			// Reset the state and render.
			
			this.reset();
			
			// Set the organization.
			
			this.shots.user = name;
			
			// Fetch the data.
			
			this.shots.fetch();
			
		},
		
		// Shortcut for building a url.
		
		go: function() {
			
			return this.navigate(_.toArray(arguments).join("/"), true);
			
		},
		
		reset: function() {
			
			// Reset collections to initial state.
			
			if (this.shots.length) {
				
				this.shots.reset();
				
			}
						
			// Reset active model.
			
			app.active = false;
			
		}
		
	});
	
	// Required, return the module for AMD compliance.
	
	return Router;
	
});