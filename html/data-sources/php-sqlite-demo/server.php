<?php
	
	/**
	* get checkbox group filter query
	* @param {Array.<string>} pathGroup - paths list
	* @return {string} query
	*/
	function getCheckboxGroupFilterQuery($keyword, $pathGroup){
		
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
			
			$query .= " " . $keyword . " like '" . $path . "' ";
		}
		
		return $query;
	}
	
	/**
	* get sort query
	* @param {Object} $status
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
	function getSortQuery($status){
		
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
					$query = "order by desc";
					break;
				}
				
				case ".like":{
					$query = "order by CAST (likes AS INTEGER)";
					break;
				}
			}
			
			if(isset($data->order)){
				$order = $data->order;
			}
			
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
	* @return {string}
	* statuss example
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
	function getFilterQuery($status, $prevQuery){
		
		$query = "";
		$name = $status->name;
		$data = $status->data;
		
		if(isset($name) && isset($data)){
				
			switch($name){
			
				case "title-filter":{
				
					if(isset($data->path) && isset($data->value) && $data->value){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						if($prevQueryNotEmpty === false){						
							$query = "where title like '%" . $data->value . "%'";
						}
						else{
							$query = " and title like '%" . $data->value . "%'";
						}
					}
									
					break;
				}
				
				case "desc-filter":{
					if(isset($data->path) && isset($data->value) && $data->value){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						if($prevQueryNotEmpty === false){
							$query = "where desc like '%" . $data->value . "%'";
						}
						else{
							$query = " and desc like '%" . $data->value . "%'";
						}
					}
					break;
				}
				
				case "themes":{
					if(isset($data->pathGroup) && is_array($data->pathGroup)){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						$query = "";
						$filter = getCheckboxGroupFilterQuery("keyword1", $data->pathGroup);
						
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
						$filter = getCheckboxGroupFilterQuery("keyword2", $data->pathGroup);
						
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
	function getPagingQuery($status, $count){
		
		$query = "";
		$data = $status->data;
		
		if(isset($data)){
			if($count > $data->number){
				$query = "LIMIT " . $data->currentPage * $data->number . ", " . $data->number;
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
		$html .= "		<img src='" . $item['img'] . "' alt='' title=''/>";
		$html .= "	</div>";
			
		$html .= "	<div class='block right'>";
		$html .= "		<p class='title'>" . $item['title'] . "</p>";
		$html .= "		<p class='desc'>" . $item['desc'] . "</p>";
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
			$statuses = $_POST["statuses"];
			$sort = "";
			$filterArr = array();
			$filter = "";
			$paging = "";
			$pagingStatus = null;
			$query = "";
			$html = "";
			
			//error_log(urldecode($_POST["statuses"]));
			
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
							$filter .= getFilterQuery($value, $filter);
							break; 
						}
						
						case "sort":{
							$sort = getSortQuery($value);
							break; 
						}
					}
				}				
				
				//connect to SQLite database 
				$db = new PDO("sqlite:jplist.db");
				
				//increases sqlite performance by turning syncing off
				$db->exec("pragma synchronous = off;");
				
				//count database items for pagination
				$query = "SELECT count(*) FROM Item " . $filter . " " . $sort;
				
				$count = $db->query($query)->fetchColumn();				
				
				//init pagination query
				if($pagingStatus){
					$paging = getPagingQuery($pagingStatus, $count);
				}
				
				//init query with sort and filter
				$query = "SELECT title, desc, img, likes, keyword1, keyword2 FROM Item " . $filter . " " . $sort . " " . $paging;
							
				//select items
				$items = $db->query($query);
				
				foreach($items as $item){
					$html .= getHTML($item);					
				}
				
				//init array for json data
				//$json_arr = array("html" => utf8_encode($html), "data" => array("count" => $count), "query"=> $query);
				
				//print html
				echo(getHTMLWrapper($html, $count));
				
				//close the database connection
				$db = NULL;
			}		
		}
		catch(PDOException $ex){
			print 'Exception: ' . $ex->getMessage();
		}
	}
	
	//start here...
	init();
?>

