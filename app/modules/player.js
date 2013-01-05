define([
	
	// Application
	
	"app"
	
],

function(app) {
	
	var Shot = app.module();
	
	Shot.Collection = Backbone.Collection.extend({
		
		url: function() {
			
			return "http://api.dribbble.com/players/" + this.user + "/shots";
			
		},  
		
		sync: function(method, model, options) {
			
			options.timeout = 10000;  
			options.dataType = "jsonp";  
			return Backbone.sync(method, model, options);  
			
		},
		
		cache: true,
		
		parse: function(obj) {
			
			// Safety check ensuring only valid data is used
			
			console.log(obj);
			
			if (obj.message !== "Not Found") {
				
				this.status = "valid";
				
				return obj.shots;
				
			}
			
			this.status = "invalid";
			
			return obj;
			
		},
		
		initialize: function(models, options) {
			
			if (options) {
				
				console.log("initialize: " + this.user);
				
				this.user = options.user;
				
			}
			
		}
		
	});
	
	Shot.Views.Item = Backbone.View.extend({
		
		template: "shot/item",
		
		tagName: "li",
		
		serialize: function() {
			
			return {
				
				model: this.model
				
			};
			
		},
		
		events: {
			
			click: "viewShot"
			
		},
		
		viewShot: function(ev) {
			
			var model = this.model;
			var shot_id = model.get("id");
			
			app.router.go("shot", shot_id);
			
		},
		
		initialize: function() {
			
			this.listenTo(this.model, "change", this.render);
			
		}
		
	});
	
	Shot.Views.List = Backbone.View.extend({
		
		template: "shot/list",
		
		serialize: function() {
			
			return {
				
				collection: this.options.shots
				
			};
			
		},
		
		beforeRender: function() {
			
			this.options.shots.each(function(shot) {
				
				this.insertView("ul", new Shot.Views.Item({
					
					model: shot
					
				}));
				
			}, this);
			
		},
		
		afterRender: function() {
			
			// Only re-focus if invalid
			
			this.$("input.invalid").focus();
			
		},
		
		initialize: function() {
			
			// Whenever the collection resets, re-render
			
			this.listenTo(this.options.shots, "reset", this.render);
			
			// Show a spinner while fetching
			
			this.listenTo(this.options.shots, "fetch", function() {
				
				this.$("ul").parent().html("<img src='/assets/images/spinner-gray.gif'>");
				
			}, this);
			
		},
		
		events: {
			
			"submit form": "updateShots"
			
		},
		
		updateShots: function(ev) {
			
			app.router.go("shots", this.$(".user").val());
			
			return false;
			
		}
		
	});
	
	// Required, return the module for AMD compliance
	
	return Shot;
	
});
