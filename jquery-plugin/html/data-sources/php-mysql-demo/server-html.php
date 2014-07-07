<?php
	//added standard php/mysql config file with host, user and password info
	require 'config.php';
	
	/**
	* ensure that the value is allowed to prevent SQL injection
	* @param {Object} $value - value from array of values
	* @param {Array.<Object>} $allowed - array of allowed values, for example: array("name", "price", "qty")
	* @return {Object} secured value
	
	function getSecuredValue($value, $allowed){
			
		if(!isset($value)){			
			$value = "";
		}
		
		//search for the give value in the array of allowed values
		$key = array_search($value, $allowed);
		
		//return found value (or first value)
		return $allowed[$key];
	}
	*/
	
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
	* get html for one item
	* @param {Object} $item
	* @return {string} html
	*/
	function getHTML($item){
	
		$html = "";
	
		$html .= "<div class='list-item box'>";	
		$html .= "	<div class='img left'>";
		$html .= "		<img src='" . $item['image'] . "' alt='' title=''/>";
		$html .= "	</div>";
			
		$html .= "	<div class='block right'>";
		$html .= "		<p class='title'>" . $item['title'] . "</p>";
		$html .= "		<p class='desc'>" . $item['description'] . "</p>";
		$html .= "		<p class='like'>" . $item['likes'] . " Likes</p>";
		$html .= "		<p class='theme'>" . $item['keyword1'] . ", " . $item['keyword2'] . "</p>";
		$html .= "	</div>";
		$html .= "</div>";

		return $html;
	}
	
	/**
	* get the whole html
	* @param {string} $itemsHtml - items html
	* @param {number} $count - all items number
	* @return {string} html
	*/
	function getHTMLWrapper($itemsHtml, $count){
		
		$html = "";
		
		$html .= "<div data-type='jplist-dataitem' data-count='" . $count . "' class='box'>";
		$html .= $itemsHtml;
		$html .= "</div>";		
		
		return $html;
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
			$html = "";
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
				$html .= getHTML($item);					
			}
			
			//print html
			echo(getHTMLWrapper($html, $count));
			
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