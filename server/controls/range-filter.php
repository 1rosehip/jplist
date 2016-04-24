<?php

    /**
    * get filter model
    * @param {string} $query
    * @param {number} $param
    */
    function getFilterModel($query, $param){
        
        $model = new FilterResultModel();
        
        $model->query = $query;
        $model->param = $param;
        
        return $model;
    }

    /**
    * get db field name by path
    * @param {string} $path
    */
    function getFieldNameByPath($path){
        
        if($path == ".like"){
            return "likes";
        }
        
        if($path == ".view"){
            return "viewsnumber";
        }
        
        return null;
    }

	/**
	* get range toggle filter control query
	* @param {Object} $status
	* @return {Object}
	* status example
	* [{
        "action": "filter",
        "name": "likes-range-filter",
        "type": "range-filter",
        "data": {
            "path": ".like",
            "type": "number",
            "filterType": "range",
            "min": 0,
            "max": 0,
            "prev": 50,
            "next": 100,
            "selected": true
        },
        "inStorage": true,
        "inAnimation": true,
        "isAnimateToTop": false,
        "inDeepLinking": true,
        "initialIndex": 0
    }, {
        "action": "filter",
        "name": "price-range-filter",
        "type": "range-filter",
        "data": {
            "path": ".price",
            "type": "number",
            "filterType": "range",
            "min": 0,
            "max": 0,
            "prev": 30,
            "next": null,
            "selected": true
        },
        "inStorage": true,
        "inAnimation": true,
        "isAnimateToTop": false,
        "inDeepLinking": true
    }]
	*/
	function rangefilter($status){
		
		$data = $status->data;
		$result = null;
		
		if(($data->selected) && 
           ($data->type == "number") && 
           ($data->filterType == "range") && 
           isset($data->path) && 
           (isset($data->prev) || isset($data->next))){
            
            $fieldName = getFieldNameByPath($data->path);
            
            if($fieldName){
                
                $result = new FilterResultCollection('and');
            
                if(isset($data->prev)){
                    array_push($result->filterResults, getFilterModel(" " . $fieldName . " >= ? ", "$data->prev"));
                }
                
                if(isset($data->next)){
                    array_push($result->filterResults, getFilterModel(" " . $fieldName . " <= ? ", "$data->next"));
                }
            }
		}
        
		return $result;
	}
?>	