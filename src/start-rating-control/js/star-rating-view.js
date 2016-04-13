(function(){//+
	'use strict';		
	
	/**
	* render control
	* @param {Object} context
	*/
	var render = function(context){
		
		var html = '';
		
		if(context.controlOptions && jQuery.isFunction(context.controlOptions.render)){
			
			//render html
			html = context.controlOptions.render({
				total: context.params.total
				,rating: context.params.rating
				,one: context.params.total === 1
				,percent: context.params.rating*100/5
			});
			
			//paste html
			context.$control.html(html);
		}
	};
	
	/** 
	* Star Rating Item Control View
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			total: Number(context.$control.attr('data-total')) || 0
			,rating: Number(context.$control.attr('data-rating')) || 0
		};
				
		if(context.params.total <= 0){
			
			//hide control if no reviews
			context.$control.addClass('jplist-hidden');
		}
		else{
			//render control html
			render(context);			
		}
				
		return jQuery.extend(this, context);
	};
	
	/** 
	* Star Rating Item Control View
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.itemControls.StarRating = function(context){
		return new Init(context);
	};	
		
	/**
	* static control registration
	*/
	jQuery.fn.jplist.itemControlTypes['star-rating'] = {
		className: 'StarRating'
		,options: {
			render: function(json){
				
				var template
					,html = '';
				
				if(window.Handlebars){
					template = window.Handlebars.compile(jQuery('#star-rating-template').html());
					html = template(json);
				}
				
				return html;
			}
		}
	};	
})();

