<?php
	class jPListServer{
	
		/**
		* database instance
		*/
		protected $db;
		
		/**
		* sorting
		*/
		protected $sorting;
		
		/**
		* filter
		*/
		protected $filter;
		
		/**
		* pagination
		*/
		protected $pagination;
		
		/**
		* jplist statuses
		*/
		protected $statuses;
				
		/**
		* execute query and get data from db
		* @return {Object} data
		*/
		protected function getData(){
			
			$items = null;
			
			//init qury
			$query = "SELECT title, description, image, likes, viewsnumber, keyword1, keyword2 FROM " . DB_TABLE . " ";

			if($this->filter->filterQuery){				
				$query .= " " . $this->filter->filterQuery . " ";
			}
            
			//get queries / fields				
			if($this->sorting->sortQuery){
				$query .= " " . $this->sorting->sortQuery . " ";
			}

		    //error_log(print_r($this->filter->filterQuery));

			if($this->pagination->paginationQuery){
				$query .= " " . $this->pagination->paginationQuery . " ";
			}
			
			if(count($this->filter->preparedParams) > 0){	
                
				$stmt = $this->db->prepare($query);
				$stmt->execute($this->filter->preparedParams);
				$items = $stmt->fetchAll();
			}
			else{
				$items = $this->db->query($query);
			}	

			return $items;
		}
		
		/**
		* constructor
		*/
		public function __construct(){
			
			try{
						
				//connect to database 
				$this->db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);			
				$this->statuses = $_POST["statuses"];
				
				if(isset($this->statuses)){
					
					//statuses => array
					$this->statuses = json_decode(urldecode($this->statuses));	
					
					$this->sorting = new Sorting($this->statuses);
					$this->filter = new Filter($this->statuses);
					$this->pagination = new Pagination($this->statuses, $this->filter, $this->db);															
				}
			}
			catch(PDOException $ex){
				print "Exception: " . $ex->getMessage();
			}
		}
	}
?>	