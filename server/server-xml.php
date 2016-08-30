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
		
	class jPListXML extends jPListServer{
			
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
		* get the whole content with wrapper 
		* @param {string} $itemsXML - items xml
		* @param {number} $count - all items number
		* @return {string} html
		*/
		function getWrapper($itemsXML){
			
			$xml = "";
			
			$xml .= "<root count=\"" . $this->pagination->numberOfPages . "\">";
			$xml .= $itemsXML;
			$xml .= "</root>";		
			
			return $xml;
		}
		
		/**
		* constructor
		*/
		public function __construct(){
			
			$xml = "";
			
			try{
				parent::__construct();
				
				if(isset($this->statuses)){
					
					$items = $this->getData();
					
					if($items){
					
						foreach($items as $item){
							$xml .= $this->getXML($item);
						}
					}
				}
                
                ob_clean();

				//set xml header
				//header('Content-type: application/xml');

				//print xml
				echo(trim($this->getWrapper($xml)));
				
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
	new jPListXML();
?>	