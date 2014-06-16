/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* autocomplete filter for jlocator: distance between the given point and store <= given radius
	* @param {number} latitude
	* @param {number} longitude
	* @param {string} name - the place name
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - stores dataview
	* @param {number} radius
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.autocompleteFilter = function(latitude, longitude, name, dataview, radius){
	
		var resultDataview = []
			,latlng
			,distance
			,dataitem
			,store
			,sameCountry;
		
		if(jQuery.isNumeric(latitude) 
			&& jQuery.isNumeric(longitude) 
			&& google
			&& jQuery.fn.jlocator
			&& jQuery.fn.jlocator.store){
			
			//init latlng
			latlng = new google['maps']['LatLng'](latitude, longitude);
			
			for(var i=0; i<dataview.length; i++){
			
				//get store
				dataitem = dataview[i];				
				store = new jQuery.fn.jlocator.store(dataitem.jqElement, {});
				
				if(store.country){
				
					//check if same country
					sameCountry = jQuery.trim(store.country.toLowerCase()) == jQuery.trim(name.toLowerCase());
				}
				else{
					sameCountry = false;
				}
				
				//get distance
				distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, store['latlng']);				
								
				if(distance <= radius || sameCountry){
					resultDataview.push(dataitem);
				}
			}
			
			return resultDataview;
		}
		else{
			return dataview;
		}
	};
	
})();	