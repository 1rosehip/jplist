(function(){
	'use strict';	
	
	/**
	* trim all items in array, remove empty items
	* @param {Array.<string>} list
	* @return {Array.<string>}
	*/
	var trimArr = function(list){
		
		var arr = []
			,item;
		
		if(list){
			
			for(var i=0; i<list.length; i++){
				
				item = jQuery.trim(list[i]);
				
				if(item){
					arr.push(item);
				}
			}
		}
		
		return arr;
	};
	
	/**
	* check OR logic
	* @param {string} itemText
	* @param {string} searchText - may contain OR, AND, NOT
	* @return {boolean} id contains
	*/
	var containsOR = function(itemText, searchText){
		
		var contains = false
			,temp;
		
		temp = searchText.split(' or ');
		temp = trimArr(temp);
		
		if(temp.length > 0){
			contains = itemText.indexOf(temp[0]) !== -1;			
			
			for(var i=1; i<temp.length; i++){
				contains = contains || (itemText.indexOf(temp[i]) !== -1)
			}
		}
		
		return contains;
	};
	
	/**
	* check AND logic
	* @param {string} itemText
	* @param {string} searchText - may contain OR, AND, NOT
	* @return {boolean} id contains
	*/
	var containsAND = function(itemText, searchText){
		
		var temp
			,andItem
			,contains = false;
		
		temp = searchText.split(' and ');
		temp = trimArr(temp);
		
		if(temp.length > 0){
				
			andItem = temp[0];
			
			if(andItem.indexOf(' or ') === -1){
				contains = itemText.indexOf(andItem) !== -1;
			}
			else{
				contains = containsOR(itemText, andItem);
			}
			
			for(var i=1; i<temp.length; i++){
			
				andItem = temp[i];
				
				if(andItem.indexOf(' or ') === -1){
					contains = contains && itemText.indexOf(andItem) !== -1;
				}
				else{
					contains = contains && containsOR(itemText, andItem);
				}
			}
		}
		
		return contains;
	};
		
	/**
	* check NOT logic
	* @param {string} itemText
	* @param {string} searchText - may contain OR, AND, NOT
	* @return {boolean} id contains
	*/
	var containsNOT = function(itemText, searchText){
		
		var temp
			,notItem
			,contains = false;
		
		temp = searchText.split('not ');
		temp = trimArr(temp);
		
		if(temp.length > 0){
						
			notItem = temp[0];
			
			if(notItem.indexOf(' and ') === -1){
				
				if(notItem.indexOf(' or ') === -1){
					contains = itemText.indexOf(notItem) === -1;
				}
				else{
					contains = containsOR(itemText, notItem);
				}
			}
			else{
				contains = containsAND(itemText, notItem);
			}
			
			for(var i=1; i<temp.length; i++){
			
				notItem = temp[i];
				
				if(notItem.indexOf(' and ') === -1){
				
					if(notItem.indexOf(' or ') === -1){
						contains = contains && (itemText.indexOf(notItem) === -1);
					}
					else{
						contains = contains && containsOR(itemText, notItem);
					}
					
					contains = contains && containsOR(itemText, notItem);
				}
				else{
					contains = contains && containsAND(itemText, notItem);
				}
			}
		}
		
		return contains;
	};
	
	/**
	* check logic
	* @param {string} itemText
	* @param {string} searchText - may contain OR, AND, NOT
	* @return {boolean} id contains
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.advancedSearchParse = function(itemText, searchText){
		
		var contains = false;
		
		searchText = jQuery.trim(searchText);
		
		if((searchText.indexOf(' or ') === -1)&&(searchText.indexOf(' and ') === -1)&&(searchText.indexOf('not ') === -1)){			
			return itemText.indexOf(searchText) !== -1;
		}
		else{
			contains = containsNOT(itemText, searchText);
		}
				
		return contains;
	};
	
})();	