<?php
	class FilterResultCollection{
		
		/**
		* filter results list
		*/
		public $filterResults;
		
		/**
		* and / or
		*/
		public $logicGate;
				
		/**
		* constructor
		*/
		public function __construct($logicGate){	
		
			$this->filterResults = array();
			$this->logicGate = $logicGate;
		}
		
		/**
		* get query according to logic gate value
		*/
		public function getQuery(){
			
			$query = "";
			$queryParts = array();
			
			foreach($this->filterResults as $key => $value){
				array_push($queryParts, $value->query);				
			}
			
			if($this->logicGate == 'or'){
				$query = " ( " . join(" or ", $queryParts) . " ) ";
			}
			else{
				$query = join(" and ", $queryParts);
			}
			
			return $query;
		}
		
	}
?>