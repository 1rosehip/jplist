<?php
	
	class Pagination extends Action{
	
		/**
		* list of pagination statuses
		*/
		private $paginationStatuses;
		
		/**
		* pagination query
		*/
		private $paginationQuery;
		
		/**
		* an instance of Filter class
		*/
		private $filter;
		
		/**
		* database instance
		*/
		private $db;
		
		/**
		* number of pages 
		*/
		private $numberOfPages;
		
		/**
		* getter
		*/
		public function __get($property) {
			if (property_exists($this, $property)) {
				return $this->$property;
			}
		}
		
		/**
		* constructor
		*/
		public function __construct($statuses, $filter, $db){
			
			//get pagination statuses from the list of all statuses
			$this->paginationStatuses = $this->getStatusesByType($statuses, "paging");
			
			//set properties
			$this->filter = $filter;
			$this->db = $db;
			
			//get number of pages
			$this->numberOfPages = $this->getNumberOfPages();
						
			//get pagination query
			$this->paginationQuery = $this->getPagingQuery();
			
		}
		
		/**
		* get pagination count
		* @return {number}
		*/
		public function getNumberOfPages(){
			
			$count = 0;		
			$query = "SELECT count(ID) FROM " . DB_TABLE . " ";
						
			if(count($this->filter->preparedParams) > 0){
                
				$query .= " " . $this->filter->filterQuery . " ";
                
				$stmt = $this->db->prepare($query);		
                
				$stmt->execute($this->filter->preparedParams);
                
				$count = $stmt->fetchColumn();	
			}
			else{
				$count = $this->db->query($query)->fetchColumn();	
			}
			
			return $count;
		}
		
		/**
		* get pagination query
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
		public function getPagingQuery(){
			
			$query = "";
			$data;
			$currentPage = 0;
			$number = 0;
						
			if(count($this->paginationStatuses) > 0){
				
				foreach($this->paginationStatuses as $key => $value){
						
					$data = $value->data;
						
					if(isset($data)){
						
						if(isset($data->currentPage) && is_numeric($data->currentPage)){
							$currentPage = intval($data->currentPage);
						}
						
						if(isset($data->number) && is_numeric($data->number)){
							$number = intval($data->number);
						}
					}				  
				}
				
				if($this->numberOfPages > $number){
					$query = "LIMIT " . $currentPage * $number . ", " . $number;
				}
				
			}		
			
			return $query;
		}
	}
	
	
?>