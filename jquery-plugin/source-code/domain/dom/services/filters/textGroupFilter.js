/**
* jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free  http://www.binpress.com/license/read/id/2749/app/2085
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){
	'use strict';	
	
	/**
	* textGroupFilter - filter dataview by text group - used for checkboxes text filter
	* filter group of text values in the given (single) path
	* @param {Array.<string>} textGroup - list of text values
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>} dataview - collection dataview
    * @param {string} logic - 'or' / 'and'
    * @param {string} dataPath - data-path attribute
    * @param {string} ignoreRegex
	* @return {Array.<jQuery.fn.jplist.domain.dom.models.DataItemModel>}
	*/
	jQuery.fn.jplist.domain.dom.services.FiltersService.textGroupFilter = function(textGroup, logic, dataPath, ignoreRegex, dataview){

        var txtValue
			,dataitem
            ,pathitem
            ,pathItemText
            ,formattedTxt
            ,pathObj
			,resultDataview = []
            ,tempList
            ,txt;

		if(textGroup.length <= 0){
			return dataview;
		}
		else{

            //create path object
            pathObj = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(dataPath, null);

			for(var i=0; i<dataview.length; i++){

				//get dataitem
				dataitem = dataview[i];

                //find value by path
                pathitem = dataitem.findPathitem(pathObj);

                if(pathObj.jqPath === 'default'){

                    //default drop down choice
                    resultDataview.push(dataitem);
                }
                else{
                    //if path is found
				    if(pathitem){

                        //get text from the pathitem
                        pathItemText = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(pathitem.text, ignoreRegex);

                        if(logic === 'or'){

                            for(txt=0; txt<textGroup.length; txt++){

                                //get text value
                                txtValue = textGroup[txt];

                                //remove 'ignore characters' from the text value
                                formattedTxt = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(txtValue, ignoreRegex);

                                //pathitem text contains text value?
                                if(pathItemText.indexOf(formattedTxt) !== -1){
                                    resultDataview.push(dataitem);
                                    break;
                                }
                            }
                        }
                        else{  //logic === 'and'

                            tempList = [];

                            for(txt=0; txt<textGroup.length; txt++){

                                //get text value
                                txtValue = textGroup[txt];

                                 //remove 'ignore characters' from the text value
                                formattedTxt = jQuery.fn.jplist.domain.dom.services.HelperService.removeCharacters(txtValue, ignoreRegex);

                                //pathitem text contains text value?
                                if(pathItemText.indexOf(formattedTxt) !== -1){
                                    tempList.push(formattedTxt);
                                }
                            }

                            if(tempList.length === textGroup.length){
                                resultDataview.push(dataitem);
                            }
                        }
                    }
                }
			}
		}

		return resultDataview;
    };

	
})();	