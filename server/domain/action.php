<?php
	class Action{
		
		/**
		* removes special chars
		* @param {string} $name
		* @return {string} clean name
		*/
		protected function clean($name){
			return preg_replace("/[^A-Za-z]/", "", $name);
		}

		/**
		* get statuses by type
		* @param {Array.<Object>} $statuses - the whole list of statuses
		* @param {string} $type - paging, filter, sort
		* @return {Array.<Object>} - list of statuses with the given type
		*/
		protected function getStatusesByType($statuses, $type){
			
			$statusesList = array();
			
			foreach($statuses as $key => $value){
				
				if($value->action == $type){
					
					array_push($statusesList, $value);
				}
			}
			
			return $statusesList;
		}
	}
?>