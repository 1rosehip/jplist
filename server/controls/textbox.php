<?php

	/**
	* get textbox control query
	* @param {Object} $status
	* @return {Object}
	* status example
	* {
    *     "action": "filter",
    *     "name": "title-filter",
    *     "type": "textbox",
    *     "data": {
    *         "path": ".title",
    *         "ignore": "[~!@#$%^&*()+=`'\"/\\_]+",
    *         "value": "",
    *         "filterType": "text"
    *     },
    *     "cookies": true
    * }
	*/
	function textbox($status){
		
		$data = $status->data;
		$result = null;
		
		if(isset($data->path) && isset($data->value) && $data->value){
		
			$result = new FilterResultModel();
			$result->param = "%$data->value%";
			
			switch($data->path){
			
				case ".title":{
					$result->query = " title like ? ";
					break;
				}
				
				case ".desc":{
					$result->query = " description like ? ";
					break;
				}
			}
		}
		
		return $result;
	}
?>	