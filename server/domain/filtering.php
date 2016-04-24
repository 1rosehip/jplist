<?php
	
	class Filter extends Action{
	
		/**
		* list of filter statuses
		*/
		private $filterStatuses;
		
		/**
		* get filter controls
		*/
		private $filterControls;
		
		/**
		* filter query
		*/
		private $filterQuery;
		
		/**
		* prepeared params for the filter
		*/
		private $preparedParams;
		
		/**
		* query parts, for example: 'title like ?'
		*/
		private $queryParts;

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
			
			//get filter statuses from the list of all statuses
			$this->filterStatuses = $this->getStatusesByType($statuses, "filter");
			
			//get filter controls
			$this->filterControls = $this->getFilters();
			
			//get prepared parameters
			$this->preparedParams = $this->getPreparedParams();
			
			//get query parts, for example: 'title like ?'
			$this->queryParts = $this->getQueryParts();
			
			//get filter query
			$this->filterQuery = $this->getFiltersQuery();
		}
		
		/**
		* get filter part of a query
		* @return {string}
		*/
		private function getFiltersQuery(){
			
			$query = "";
						
			if(count($this->queryParts) > 0){		
				$query .= " where " . join(" and ", $this->queryParts);
			}
			
			return $query;
		}
		
		/**
		* get prepared parameters for the filters
		* @return {Array.<string>} $preparedParams
		*/
		public function getPreparedParams(){
			
			$preparedParams = array();
			
			if(count($this->filterControls) > 0){
				
				foreach($this->filterControls as $key => $value){
					
					if(is_a($value, 'FilterResultCollection') && count($value->filterResults) > 0){
						
						foreach($value->filterResults as $key1 => $value1){
							array_push($preparedParams, $value1->param);
						}
					}
					
					if(is_a($value, 'FilterResultModel')){
						array_push($preparedParams, $value->param);
					}
				}
			}
			
			return $preparedParams;
		}
		
		/**
		* get filter query parts
		* @return {Array.<string>} $preparedParams
		*/
		public function getQueryParts(){
			
			$filterQueryParts = array();
			
			if(count($this->filterControls) > 0){
			
				foreach($this->filterControls as $key => $value){
					
					if(is_a($value, 'FilterResultCollection') && count($value->filterResults) > 0){
						
						if($value->logicGate == 'or'){
							array_push($filterQueryParts, $value->getQuery());
						}
						else{
							foreach($value->filterResults as $key1 => $value1){
								array_push($filterQueryParts, $value1->query);
							}
						}
					}
					
					if(is_a($value, 'FilterResultModel')){
						array_push($filterQueryParts, $value->query);	
					}
				}
			}
			
			return $filterQueryParts;
		}
		
		/**
		* get filter fields
		* @return {Array<Object>}
		*/
		public function getFilters(){
			
			$filterFields = array();
			$funcName;
			$funcResult;
			
			foreach($this->filterStatuses as $key => $value){
				
				$funcName = $this->clean($value->type);
				
				if(function_exists($funcName)){		
					
					$funcResult = call_user_func($funcName, $value);
					
					if($funcResult){
						array_push($filterFields, $funcResult);				
					}
				}		
			}
					
			return $filterFields;
		}
		
		
	}
	
?>