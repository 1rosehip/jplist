<?php
	class Sorting extends Action{
	
		/**
		* list of sort statuses
		*/
		private $sortStatuses;
		
		/**
		* sort query
		*/
		private $sortQuery;

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
		public function __construct($statuses){
			
			//get sort statuses from the list of all statuses
			$this->sortStatuses = $this->getStatusesByType($statuses, "sort");
			
			//get sort query
			$this->sortQuery = $this->getSortQuery();
		}
	
		/**
		* get sort query
		* @return {string}
		*/
		private function getSortQuery(){
			
			$sortQuery = "";
			$sortFields = array();
			$funcName;
			$funcResult;
						
			foreach($this->sortStatuses as $key => $value){
				
				$funcName = $this->clean($value->type);
				
				if(function_exists($funcName)){		
					
					$funcResult = call_user_func($funcName, $value);
					
					if($funcResult){
						array_push($sortFields, $funcResult);				
					}
				}			
			}
					
			if(count($sortFields) > 0){
				$sortQuery = "order by " . join(",", $sortFields);
			}
			
			return $sortQuery;
		}
	}	
?>