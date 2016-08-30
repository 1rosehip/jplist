<?php
	//added standard php/mysql config file with host, user and password info
	require "config.php";
	
	//models and collections
	require "domain/models/filter-result-model.php";
	require "domain/collection/filter-result-collection.php";
	
	//domain
	require "domain/action.php";
	require "domain/sorting.php";
	require "domain/pagination.php";
	require "domain/filtering.php";
	require "domain/server.php";
	
	//controls
	require "controls/sortdropdown.php";	
	require "controls/textbox.php";	
	require "controls/checkboxgroupfilter.php";
	require "controls/filterdropdown.php";
	require "controls/filterselect.php";
	require "controls/button-text-filter.php";
		
	class jPListJSON extends jPListServer{
	
		/**
		* get the whole content with wrapper 
		* it used for pagination count
		* @param {string} $itemsJSON - items json
		* @return {string} html
		*/
		function getWrapper($itemsJSON){
			
			$json = "";
			
			$json .= "{";
			$json .= "\"count\":" . $this->pagination->numberOfPages;
			$json .= ",\"data\":" . $itemsJSON;
			$json .= "}";		
			
			return $json;
		}
		
		/**
		* constructor
		*/
		public function __construct(){
						
				
			try{
				$json = "";
				$counter = 0;
				
				parent::__construct();
				
				if(isset($this->statuses)){
			
					$items = $this->getData();

					$json .= "[";
					
					if($items){
						foreach($items as $item){
							
							if($counter > 0){
								$json .= ",";
							}
							
							$json .= json_encode($item);
							
							$counter++;
						}
					}
					$json .= "]";					
					
				    ob_clean();
                    
					//print json
					echo($this->getWrapper($json));					
				}	
				
				//close the database connection
				$this->db = NULL;
			}
			catch(PDOException $ex){
				print "Exception: " . $ex->getMessage();
			}
		}
	}
	
	/**
	* start
	*/
	new jPListJSON();
?>	