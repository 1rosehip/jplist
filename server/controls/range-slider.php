<?php

    /**
    * get partial model
    * @param {string} $query
    * @param {number} $param
    */
    function getPartialModel($query, $param){
        
        $model = new FilterResultModel();
        
        $model->query = $query;
        $model->param = $param;
        
        return $model;
    }

	/**
	* get jQuery UI range slider control query
	* @param {Object} $status
	* @return {Object}
	* status example
	* {
        "action": "filter",
        "name": "range-slider-likes",
        "type": "range-slider",
        "data": {
            "path": ".like",
            "type": "number",
            "filterType": "range",
            "min": 0,
            "max": 350,
            "prev": 0,
            "next": 350
        },
        "inStorage": true,
        "inAnimation": true,
        "isAnimateToTop": false,
        "inDeepLinking": true,
        "initialIndex": 0
    }
	*/
	function rangeslider($status){
		
		$data = $status->data;
		$result = null;
		
		if(($data->filterType == "range") && ($data->type == "number") && isset($data->path, $data->prev, $data->next)){
		
			switch($data->path){
			
				case ".like":{
                    
                    $result = new FilterResultCollection('and');
                    
                    array_push($result->filterResults, getPartialModel(" likes >= ? ", "$data->prev"));
                    array_push($result->filterResults, getPartialModel(" likes <= ? ", "$data->next"));
                    
					break;
				}
				
				case ".view":{
        
                    $result = new FilterResultCollection('and');
                    
                    array_push($result->filterResults, getPartialModel(" viewsnumber >= ? ", "$data->prev"));
                    array_push($result->filterResults, getPartialModel(" viewsnumber <= ? ", "$data->next"));
					break;
				}
			}
		}
        
		return $result;
	}
?>	