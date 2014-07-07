<?php
	//added standard php/mysql config file with host, user and password info
	require 'config.php';
		
	/**
	* get checkbox group filter query
	* @param {Array.<string>} pathGroup - paths list
	* @return {string} query
	* @param {Array.<string>} $preparedParams - array of params for prepare statement
	*/
	function getCheckboxGroupFilterQuery($keyword, $pathGroup, &$preparedParams){
		
		$path = "";
		$length = count($pathGroup);
		$query = "";
		
		for($i=0; $i<$length; $i++){
			
			//get path
			$path = $pathGroup[$i];
			
			//replace dot
			$path = str_replace(array("."), "", $path);
			
			if($i !== 0){
				$query .= " or ";
			}
			
			$query .= " " . $keyword . " like ? ";
			array_push($preparedParams, "$path");
		}
		
		return $query;
	}
	
	/**
	* get sort query
	* @param {Object} $status
	* @param {Array.<string>} $preparedParams - array of params for prepare statement
	* @return {string}
	* sort example
	* {
    *     "action": "sort",
    *     "name": "sort",
    *     "type": "drop-down",
    *     "data": {
    *         "path": ".like",
    *         "type": "number",
    *         "order": "asc",
    *         "dateTimeFormat": "{month}/{day}/{year}"
    *     },
    *     "cookies": true
    * }
	*/
	function getSortQuery($status, &$preparedParams){
		
		$query = "";
		$data = $status->data;
		$order = "asc";
		
		if(isset($data) && isset($data->path) && $data->path){
		
			switch($data->path){
			
				case ".title":{
					$query = "order by title";
					break;
				}
				
				case ".desc":{
					$query = "order by description";
					break;
				}
				
				case ".like":{
					$query = "order by likes";
					break;
				}
			}
			
			if(isset($data->order)){
				$order = strtolower($data->order);
			}
			
			($order == "desc") ? "desc" : "asc";
			
			if($query){
				$query = $query . " " . $order;
			}
		}
		
		return $query;
	}
	
	/**
	* get filter query
	* @param {Object} $status
	* @param {string} $prevQuery - prev filter query
	* @param {Array.<string>} $preparedParams - array of params for prepare statement
	* @return {string}
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
	function getFilterQuery($status, $prevQuery, &$preparedParams){
		
		$query = "";
		$name = $status->name;
		$data = $status->data;		
		
		if(isset($name) && isset($data)){
				
			switch($name){
			
				case "title-filter":{
				
					if(isset($data->path) && isset($data->value) && $data->value){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						if($prevQueryNotEmpty === false){						
							$query = "where title like ? ";
							array_push($preparedParams, "%$data->value%");
						}
						else{
							$query = " and title like ? ";
							array_push($preparedParams, "%$data->value%");
						}
					}
									
					break;
				}
				
				case "desc-filter":{
					if(isset($data->path) && isset($data->value) && $data->value){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						if($prevQueryNotEmpty === false){
							$query = "where description like ? ";
							array_push($preparedParams, "%$data->value%");
						}
						else{
							$query = " and description like ? ";
							array_push($preparedParams, "%$data->value%");
						}
					}
					break;
				}
				
				case "themes":{
					if(isset($data->pathGroup) && is_array($data->pathGroup)){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						$query = "";
						$filter = getCheckboxGroupFilterQuery("keyword1", $data->pathGroup, $preparedParams);
						
						if($filter){
							if($prevQueryNotEmpty === false){
								$query = "where " . $filter;
							}
							else{
								$query = " and (" . $filter . ")";
							}
						}						
					}
					break;
				}
				
				case "colors":{
					if(isset($data->pathGroup) && is_array($data->pathGroup)){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						$query = "";
						$filter = getCheckboxGroupFilterQuery("keyword2", $data->pathGroup, $preparedParams);
						
						if($filter){
							if($prevQueryNotEmpty === false){
								$query = "where " . $filter;
							}
							else{
								$query = " and (" . $filter . ")";
							}
						}
					}
					break;
				}
			}
		}
		
		return $query;
	}
	
	/**
	* get pagination query
	* @param {Object} $status
	* @param {number} $count - all items number (after the filters were applied)
	* @param {Array.<string>} $preparedParams - array of params for prepare statement
	* @return {string}
	* status example
	* {
    *     "action": "paging",
    *     "name": "paging",
    *     "type": "placeholder",
    *     "data": {
    *         "number": "10",
    *         "currentPage": 0,
    *         "paging": null
    *     },
    *     "cookies": true
    * }
	*/
	function getPagingQuery($status, $count, &$preparedParams){
		
		$query = "";
		$data = $status->data;
		$currentPage = 0;
		$number = 0;
		
		if(isset($data)){
		
			if(is_numeric($data->currentPage)){
				$currentPage = intval($data->currentPage);
			}
			
			if(is_numeric($data->number)){
				$number = intval($data->number);
			}
			
			if($count > $data->number){
				$query = "LIMIT " . $currentPage * $number . ", " . $number;
			}
		}
		
		return $query;
	}
		
	/**
	* get the whole content with wrapper 
	* it used for pagination count
	* @param {string} $itemsXML - items xml
	* @param {number} $count - all items number
	* @return {string} html
	*/
	function getWrapper($itemsXML, $count){
		
		$xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		
		$xml .= "<root count=\"" . $count . "\">";
		$xml .= $itemsXML;
		$xml .= "</root>";		
		
		return $xml;
	}
	
	/**
	* get xml for one item
	* @param {Object} $item
	* @return {string} xml
	*/
	function getXML($item){
	
		$xml = "";
	
		$xml .= "<item>";	
		$xml .= "<image>" . $item['image'] . "</image>";
		$xml .= "<title>" . $item['title'] . "</title>";
		$xml .= "<description>" . $item['description'] . "</description>";
		$xml .= "<likes>" . $item['likes'] . "</likes>";
		$xml .= "<keyword1>" . $item['keyword1'] . "</keyword1>";
		$xml .= "<keyword2>" . $item['keyword2'] . "</keyword2>";
		$xml .= "</item>";	

		return $xml;
	}
		
	/**
	* entry point
	*/
	function init(){
		
		try{
				
			//connect to database 
			$db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
			
			$preparedParams = array();
			$statuses = $_POST["statuses"];
			$xml = "";
			$pagingStatus = null;
			$filter = "";
			$sort = "";
			$query = "";
			
			if(isset($statuses)){
				
				//statuses => array
				$statuses = json_decode(urldecode($statuses));
				
				foreach($statuses as $key => $value){
					
					switch($value->action){
					
						case "paging":{
							$pagingStatus = $value;
							break; 
						}
						
						case "filter":{							
							$filter .= getFilterQuery($value, $filter, $preparedParams);	
							break; 
						}
						
						case "sort":{
							$sort = getSortQuery($value, $preparedParams);
							break; 
						}
					}
				}				
			}
			
			//count database items for pagination
			$query = "SELECT count(*) FROM Item " . $filter . " " . $sort;
							
			if(count($preparedParams) > 0){
				
				$stmt = $db->prepare($query);				
				//error_log(print_r($preparedParams, true));
				
				$stmt->execute($preparedParams);
				$count = $stmt->fetchColumn();				
			}
			else{
				$count = $db->query($query)->fetchColumn();	
			}
			
			//init pagination query
			if($pagingStatus){
				$paging = getPagingQuery($pagingStatus, $count, $preparedParams);
			}
			
			//init query with sort and filter
			$query = "SELECT title, description, image, likes, keyword1, keyword2 FROM Item " . $filter . " " . $sort . " " . $paging;
			
			if(count($preparedParams) > 0){
				
				$stmt = $db->prepare($query);
				$stmt->execute($preparedParams);
				$items = $stmt->fetchAll();
			}
			else{
				$items = $db->query($query);
			}
				
			foreach($items as $item){
				$xml .= getXML($item);
			}
			
			//print xml
			echo(getWrapper($xml, $count));
			
			//close the database connection
			$db = NULL;
		}
		catch(PDOException $ex){
			print 'Exception: ' . $ex->getMessage();
		}
	}
	
	//start here...
	init();
?>	