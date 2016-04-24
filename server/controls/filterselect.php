<?php

	/**
	* get filter select control query
	* @param {Object} $status
	* @return {Object}
	* status example
	(
		[action] => filter
		[name] => category-select-filter
		[type] => filter-drop-down
		[data] => stdClass Object
			(
				[path] => .architecture
				[filterType] => path
			)

		[inStorage] => 1
		[inAnimation] => 1
		[isAnimateToTop] => 
		[inDeepLinking] => 1
	)
	*/
	function filterselect($status){
		
		$data = $status->data;
		$result = null;
		
		if(isset($data->path) && ($data->path != 'default')){
		
			$result = new FilterResultModel();
									
			//remove dot
			$path = str_replace(array("."), "", $data->path);
			$result->param = "$path";
			$result->query = " keyword1 like ? ";
		}
		
		return $result;
	}
?>	