(function(){
	'use strict';		
	
	/**
	* try parse datetime wilcard
	* @param {string|number} wilcard
	* @return {number}
	*/
	var formatTryParse = function(wilcard, value){
	
		var radix = 10
			,result = null;
		
		
		if(wilcard == '{month}'){
		
			value = value.toLowerCase();
			
			if(value === 'january' || value === 'jan' || value === 'jan.'){
				result = 0;
			}
			
			if(value === 'february' || value === 'feb' || value === 'feb.'){
				result = 1;
			}
			
			if(value === 'march' || value === 'mar' || value === 'mar.'){
				result = 2;
			}
			
			if(value == 'april' || value === 'apr' || value === 'apr.'){
				result = 3;
			}
			
			if(value === 'may'){
				result = 4;
			}
			
			if(value == 'july' || value === 'jun' || value === 'jun.'){
				result = 5;
			}
			
			if(value === 'april' || value === 'jul' || value === 'jul.'){
				result = 6;
			}
			
			if(value === 'august' || value === 'aug' || value === 'aug.'){
				result = 7;
			}
			
			if(value === 'september' || value === 'sep' || value === 'sep.'){
				result = 8;
			}
			
			if(value === 'october' || value === 'oct' || value === 'oct.'){
				result = 9;
			}
			
			if(value === 'november' || value === 'nov' || value === 'nov.'){
				result = 10;
			}
			
			if(value === 'december' || value === 'dec' || value === 'dec.'){
				result = 11;
			}
			
			if(result === null){
				result = parseInt(value, radix);
				
				if(!isNaN(result)){
					result--;
				}
			}
		}
		else{
			result = parseInt(value, radix);
		}
		
		
		
		return result;
	};
	
	/**
	* get datetime format section/item
	* @param {string} replacedFormat
	* @return {string|number|null}
	*/
	var getDatetimeFormatItem = function(replacedFormat, datetimeString){
	
		var regex
			,regexValue
			,match
			,result = null;
		
		//init regex		
		regexValue = replacedFormat.replace(/{year}|{month}|{day}|{hour}|{min}|{sec}/g, '.*');
		regex = new RegExp(regexValue, 'g');
		
		//call match
		match = regex.exec(datetimeString);
		
		if(match && match.length > 1){
		   
			result = match[1];
		}
		
		return result;
	};
	
	/** 
	* Helper Class
	* @type {Object} 
	*/
	jQuery.fn.jplist.domain.dom.services.HelperService = {};
	
	/**
	* get outer html
	* @param {jQueryObject} el - jquery element
	* @return {string} - outer html
	*/
	jQuery.fn.jplist.domain.dom.services.HelperService.getOuterHtml = function(el){
	
		var html = '';
		var attr = el[0].attributes;
		var inner = el.html();
		var name = el[0].tagName.toString().toLowerCase();
		
		html += '<' + name;
		
		for(var i=0; i<attr.length; i++){
		
			if(attr[i].nodeValue){
			
				html += ' ' + attr[i].nodeName + '=';
				html += '"' + attr[i].nodeValue + '"';
			}
		}
		
		html += '>';
		html += inner;
		html += '</' + name + '>';
		
		return html;
	};
	
	/**
	* remove characters
	* @param {string} text
	* @param {string} regex - remove characters regex expression
	* @return {string}
	*/
	jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters = function(text, regex){
		
		var regexExpr;
		
		if(!text){				
			return '';
		}
		
		//create regex
		regexExpr = new RegExp(regex, 'ig');
		
		//return text.replace(/[^a-zA-Z0-9]+/g,'').toLowerCase();
		return text.replace(regexExpr, '').toLowerCase();
	};
	
	/**
	* Get datetime from string with wildcards like {year}, {month}, {day}, {hour}, {min}, {sec}
	* @param {Date} datetime
	* @param {string} format
	* @return {Date}
	*/
	jQuery.fn.jplist.domain.dom.services.HelperService.formatDateTime = function(datetime, format){
	
		var formattedDatetime
			,replacedFormat
			,year
			,month
			,day
			,hour
			,minute
			,second;
			
			/*
			,specials = [
			  '/', '.', '*', '+', '?', '|',
			  '(', ')', '[', ']', '{', '}', '\\'
			];*/
			
		//special characters
		format = format.replace(/\./g, '\\.');	
		format = format.replace(/\(/g, '\\(');
		format = format.replace(/\)/g, '\\)');
		format = format.replace(/\[/g, '\\[');
		format = format.replace(/\]/g, '\\]');
		
		//get year
		replacedFormat = format.replace('{year}', '(.*)');
		year = getDatetimeFormatItem(replacedFormat, datetime);
		if(year){
			year = formatTryParse('{year}', year);
		}
		
		//get day
		replacedFormat = format.replace('{day}', '(.*)');
		day = getDatetimeFormatItem(replacedFormat, datetime);
		if(day){
			day = formatTryParse('{day}', day);
		}
		
		//get month: integer value representing the month, beginning with 0 for January to 11 for December		
		replacedFormat = format.replace('{month}', '(.*)');
		month = getDatetimeFormatItem(replacedFormat, datetime);
		if(month){
			month = formatTryParse('{month}', month);	
		}	
		
		//get hour: integer value representing the hour of the day (0-23)
		replacedFormat = format.replace('{hour}', '(.*)');
		hour = getDatetimeFormatItem(replacedFormat, datetime);
		if(hour){
			hour = formatTryParse('{hour}', hour);
		}
		
		//get minute: integer value representing the minute segment (0-59) of a time reading
		replacedFormat = format.replace('{min}', '(.*)');
		minute = getDatetimeFormatItem(replacedFormat, datetime);
		if(minute){
			minute = formatTryParse('{min}', minute);
		}
		
		//get second: integer value representing the minute segment (0-59) of a time reading
		replacedFormat = format.replace('{sec}', '(.*)');
		second = getDatetimeFormatItem(replacedFormat, datetime);
		if(second){
			second = formatTryParse('{sec}', second);
		}
		
		//check NaN/null/undefined values
		if(!year || isNaN(year)){
			year = 1900;
		}
		
		if(!month || isNaN(month)){
			month = 0;
		}
		
		if(!day || isNaN(day)){
			day = 1;
		}
		
		if(!hour || isNaN(hour)){
			hour = 0;
		}
		
		if(!minute || isNaN(minute)){
			minute = 0;
		}
		
		if(!second || isNaN(second)){
			second = 0;
		}
		
		formattedDatetime = new Date(year, month, day, hour, minute, second);
		
		return formattedDatetime;
	};
})();

