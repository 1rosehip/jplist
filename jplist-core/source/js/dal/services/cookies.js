(function(){
	'use strict';		
	
	/** 
	* Cookies
	* @type {Object}
	*/
	jQuery.fn.jplist.dal.services.CookiesService = {};
	
	/**
	* Set cookie
	* @param {string} name - cookie name
	* @param {string} value - cookie value
	* @param {number} expiration - cookie expiration in minutes (-1 = cookies expire when browser is closed)
	*/
	jQuery.fn.jplist.dal.services.CookiesService.setCookie = function(name, value, expiration){
	
		var cValue = escape(value)
			,exdate = new Date();
		
		expiration = Number(expiration);	
		
		if(expiration == -1 || isNaN(expiration)){
			document.cookie = name + "=" + cValue + ";path=/;";
		}
		else{
			exdate.setMinutes(exdate.getMinutes() + expiration); 
			document.cookie = name + "=" + cValue + ";path=/; expires=" + exdate.toUTCString();
		}		
	};
	
	/**
	* Get cookie by name
	* @param {string} cookieName - cookie name
	* @return {?string}
	*/
	jQuery.fn.jplist.dal.services.CookiesService.getCookie = function(cookieName){
	
		var x
			,y
			,cookies
			,resultCookie = null;
		
		//get document cookie		
		cookies = document.cookie.split(';');
		
		for (var i=0; i<cookies.length; i++){

			x = cookies[i].substr(0,cookies[i].indexOf('='));
			y = cookies[i].substr(cookies[i].indexOf('=') + 1);
			x = x.replace(/^\s+|\s+$/g, '');

			if(x == cookieName){
				resultCookie = unescape(y);
				break;
			}
		}
		
		return resultCookie;
	};
	
	/**
	* Save status objects list to cookies
	* @param {Array.<Object>} statuses - list of status objects
	* @param {string} cookieName - cookie name
	* @param {number} expiration - cookie expiration in minutes (-1 = cookies expire when browser is closed)
	*/
	jQuery.fn.jplist.dal.services.CookiesService.saveCookies = function(statuses, cookieName, expiration){
		
		var json;
		
		//get statuses json
		json = JSON.stringify(statuses);
		
		//save json in cookies
		jQuery.fn.jplist.dal.services.CookiesService.setCookie(cookieName, json, expiration);
	};
	
	/**
	* Restore status objects list from cookies	
	* @param {string} cookieName - cookie name
	* @return {Array.<Object>} - list of status objects
	*/
	jQuery.fn.jplist.dal.services.CookiesService.restoreCookies = function(cookieName){
		
		var json
			,statuses = [];
		
		//get json from cookies
		json = jQuery.fn.jplist.dal.services.CookiesService.getCookie(cookieName);
		
		if(json){
			
			//get statuses from json
			statuses = jQuery.parseJSON(json);
		}
		
		if(!statuses){
			statuses = [];
		}		
				
		return statuses;
	};
	
})();

