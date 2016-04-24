<?php
	
	/**
	* get checkbox group filter control query
	* @param {Object} $status
	* @return {Object}
	* status example
	(
        [action] => filter
		[name] => themes
		[type] => checkbox-group-filter
		[data] => stdClass Object
			(
				[pathGroup] => Array
					(
						[0] => .architecture
					)

				[filterType] => pathGroup
			)

		[inStorage] => 1
		[inAnimation] => 1
		[isAnimateToTop] => 
		[inDeepLinking] => 1
	)
	*/
	function checkboxgroupfilter($status){
		
		$data = $status->data;
		$name = $status->name;
		$path = "";
		$result = null;
		
		if(isset($name) && isset($data) && isset($data->pathGroup) && is_array($data->pathGroup)){
			
			switch($name){
				
				case "themes":{						
					$keyword = "keyword1";
					break;
				}
				
				case "colors":{
					$keyword = "keyword2";
					break;
				}
			}
			
			$result = new FilterResultCollection('or');
									
			for($i=0; $i<count($data->pathGroup); $i++){
				
				$model = new FilterResultModel();
				
				//get path
				$path = $data->pathGroup[$i];
				
				//remove dot
				$path = str_replace(array("."), "", $path);
										
				$model->query = " " . $keyword . " like ? ";
				$model->param = "$path";
				array_push($result->filterResults, $model);
			}		
		}
		
		return $result;
	}
?>