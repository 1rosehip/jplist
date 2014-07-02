<?php
		
/**
* jPList Domain Class
*/
class jplist_domain{
	
	//status (from client)
	public $statuses;
	
	//wordpress db
	public $wpdb;
	
	/**
	* constructor
	*/
	public function jplist_domain(){
		
		//init properties
		$this->wpdb = $GLOBALS['wpdb'];
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
			
				case ".jplist-title":{
					$query = "order by post_title";
					break;
				}
				
				case ".content":{
					$query = "order by post_content";
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
    *         "path": ".jplist-title",
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
							$query = "where `post_title` like '%%%s%%' ";
							array_push($preparedParams, $data->value);
						}
						else{
							$query = " and `post_title` like '%%%s%%' ";
							array_push($preparedParams, $data->value);
						}
					}
									
					break;
				}
				
				case "content-filter":{
					if(isset($data->path) && isset($data->value) && $data->value){
						$prevQueryNotEmpty = strrpos($prevQuery, "where");
						if($prevQueryNotEmpty === false){
							$query = "where `post_content` like '%%%s%%' ";
							array_push($preparedParams, $data->value);
						}
						else{
							$query = " and `post_content` like '%%%s%%' ";
							array_push($preparedParams, $data->value);
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
	* @param {string} $itemsJSON - items json
	* @param {number} $count - all items number
	* @return {string} html
	*/
	function getWrapper($itemsJSON, $count){
		
		$json = "";
		
		$json .= "{";
		$json .= "\"count\":" . $count;
		$json .= ",\"data\":" . $itemsJSON;
		$json .= "}";		
		
		return $json;
	}
	
	/**
	* get json by statuses
	* @param {Object} $statuses - json from client - controls statuses
	* @return {Object} json - posts
	*/
	public function get_posts_json($statuses){
		
		//init properties
		$this->statuses = $statuses;	
		$json = "[]";		
		$preparedParams = array();
		$pagingStatus = null;
		$filter = "where `post_status` = 'publish' and `post_type` = 'post' ";
		$sort = "";
		$query = "";
		$count = 0;
		$counter = 0;
		
		try{
			
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
							$filter .= $this->getFilterQuery($value, $filter, $preparedParams);	
							break; 
						}
						
						case "sort":{
							$sort = $this->getSortQuery($value, $preparedParams);
							break; 
						}
					}
				}	
			}
			
			//count database items for pagination
			$query = "SELECT count(ID) FROM wp_posts " . $filter . " " . $sort;
			
			if(count($preparedParams) > 0){
				
				$count = $this->wpdb->get_var(
					$this->wpdb->prepare(
						$query
						,$preparedParams
					)
				);
			}
			else{
				$count = $this->wpdb->get_var($query);
			}
			
			//init pagination query
			if($pagingStatus){
				$paging = $this->getPagingQuery($pagingStatus, $count, $preparedParams);
			}
			
			//init query with sort and filter
			$query = "SELECT * FROM wp_posts " . $filter . " " . $sort . " " . $paging;
									
			if(count($preparedParams) > 0){
			
				$items = $this->wpdb->get_results(
					$this->wpdb->prepare(
						$query
						,$preparedParams
					)
				);				
			}
			else{
				$items = $this->wpdb->get_results($query, OBJECT);
			}
			
			$json = "[";
			foreach($items as $post){
				
				if($counter > 0){
					$json .= ",";
				}
				
				//add additional properties
				$link = get_permalink($post->ID);
				$thumb = get_the_post_thumbnail($post->ID, 'thumbnail', '');
				$excerpt = wp_trim_words($post->post_content);
				
				$post->link = $link;
				$post->thumb = $thumb;
				$post->excerpt = $excerpt;
				
				$json .= json_encode($post);
				
				$counter++;
			}
			$json .= "]";
			
		}
		catch(Exception $ex){
			print 'Exception: ' . $ex->getMessage();
		}
		
		return $this->getWrapper($json, $count);
	}
}
?>