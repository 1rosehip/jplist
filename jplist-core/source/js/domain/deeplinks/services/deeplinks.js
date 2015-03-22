(function(){
	'use strict';

	/**
	* replace hash in url
	* @param {Object} options - user options
	* @param {string} hash
	* @private
	*/
	var replaceHash = function(options, hash){
	
		var hashStr = jQuery.trim(hash.replace(options.hashStart, ''))
			,href
			,index;
		
		if(hashStr === ''){
			hashStr = options.hashStart;
		}
		else{
			hashStr = options.hashStart + hashStr;
		}
		
		if(window.location.hash !== hashStr){
		
			index = window.location.href.indexOf(options.hashStart);
			
			if(index == -1){
				href = window.location.href + hashStr;
			}
			else{
				href = window.location.href.substring(0, index) + hashStr;
			}
			
			if('replaceState' in window.history){
				window.history.replaceState('', '', href);
			}
			else{
				window.location.replace(href);		
			}
		}
	};		
	
	/** 
	* Deep Links Class
	* @type {Object} 
	*/
	jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService = {};	
		
	/**
	* get params from deep link url
	* @param {Object} options
	* @return {Array.<Object>} array of params {controlName: '...', propName: '...', propValue: '...'}
	*/
	jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService.getUrlParams = function(options){
		
		var sections = []
			,section
			,params = []
			,param
			,pairSections
			,keySections
			,key
			,value
			,hash;
			
		hash = window.decodeURIComponent(jQuery.trim(window.location.hash.replace(options.hashStart, '')));
		
		if(options.deepLinking && jQuery.trim(hash) !== ''){
			
			//get sections
			sections = hash.split(options.delimiter1);
			
			for(var i=0; i<sections.length; i++){
				
				//get section
				section = sections[i];
				
				//get pair: key + value
				pairSections = section.split('=');
				
				if(pairSections.length === 2){
					
					//get pair
					key = pairSections[0];
					value = pairSections[1];
					
					//get key sections
					keySections = key.split(options.delimiter0);
					
					if(keySections.length === 2){
						
						param = {
							controlName: keySections[0]
							,propName: keySections[1]
							,propValue: value
						};
						
						params.push(param);
					}
				}
			}
		}
	
		return params;
	};
	
	/**
	* change url according to all controls statuses
	* @param {Object} options - user options
	* @param {jQuery.fn.jplist.ui.panel.collections.ControlsCollection} controls
	*/
	jQuery.fn.jplist.domain.deeplinks.services.DeepLinksService.updateUrlPerControls = function(options, controls){
		
		var deepLinkUrl = '';
		
		if(options.deepLinking){
						
			//get deep link url
			deepLinkUrl = controls['getDeepLinksUrl']();
			
			//debug info
			jQuery.fn.jplist.info(options, 'Change Deep links URL according to statuses: ', deepLinkUrl);
			
			//set new hash
			replaceHash(options, deepLinkUrl);
		}
	};
})();	