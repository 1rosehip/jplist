<?php
	
	/**
	* jPList Page UI Class
	*/
	class jplist_page{
		
		public $jplist_relative_path;
		public $db;
		public $jplist_options;
		
		/**
		* constructor
		*/
		public function jplist_page($jplist_relative_path, $jplist_options, $db){
			
			$this->jplist_relative_path = $jplist_relative_path;
			$this->db = $db;
			$this->jplist_options = $jplist_options;
			
			//init scripts and styles
			add_action('wp_enqueue_scripts', array(&$this, 'init_scripts_and_styles'));	
			
			//get posts (ajax)
			add_action('wp_ajax_jplist_get_posts', array(&$this, 'get_posts_callback'));	
		}	
		
		/**
		* init scripts and styles
		*/
		public function init_scripts_and_styles(){
			
			//deregister font-awesome
			wp_deregister_style('font-awesome');
			
			//register font-awesome
			wp_register_style('font-awesome', '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css', false, '4.0.3', 'all'); 
			
			//add font-awesome
			wp_enqueue_style('font-awesome');
			
			//deregister jplist
			wp_deregister_style('jplist_styles');
			
			//register jplist
			wp_register_style('jplist_styles', $this->jplist_relative_path . '/content/css/jplist-admin.min.css', false, '5.1.35', 'all'); 
			
			//add jplist
			wp_enqueue_style('jplist_styles');
			
			//deregister jplist
			wp_deregister_script('jplist');
			
			//register jplist
			wp_register_script('jplist', '//cdnjs.cloudflare.com/ajax/libs/jplist/5.1.35/jplist.min.js', array('jquery'), '5.1.35', true);
			
			//add jplist
			wp_enqueue_script('jplist');
			
			//deregister jplist
			wp_deregister_script('handlebars');
			
			//register jplist
			wp_register_script('handlebars', '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.min.js', false, '2.0.0-alpha.4', true);
			
			//add jplist
			wp_enqueue_script('handlebars');
		}
		
		/**
		* get posts -> ajax callback
		*/
		public function get_posts_callback(){
		
			$statuses = $_POST['statuses'];
			
			echo($this->db->get_posts_json($statuses));
			
			die();
		}
	
	
	}
?>