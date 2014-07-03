<?php
	
	/**
	* jPList Admin Ajax Class
	*/
	class jplist_admin_ajax{
		
		public $jplist_relative_path;
		public $jplist_controls;
		public $jplist_options;
		
		/**
		* constructor
		*/
		public function jplist_admin_ajax($jplist_relative_path, $jplist_options, $jplist_controls){
			
			$this->jplist_relative_path = $jplist_relative_path;
			$this->jplist_controls = $jplist_controls;
			$this->jplist_options = $jplist_options;
			
			//save changes (ajax)
			add_action('wp_ajax_save_changes', array(&$this, 'save_changes_callback'));	

			//reset panels (ajax)
			add_action('wp_ajax_reset_js_panel', array(&$this, 'reset_js_panel_callback'));
			add_action('wp_ajax_reset_top_panel', array(&$this, 'reset_top_panel_callback'));
			add_action('wp_ajax_reset_bot_panel', array(&$this, 'reset_bot_panel_callback'));
			add_action('wp_ajax_reset_template_panel', array(&$this, 'reset_js_template_callback'));			
		}
		
		/**
		* save changes -> ajax callback
		*/
		public function save_changes_callback(){
		
			$jsSettings = $_POST['js'];
			$topPanel = $_POST['top'];
			$bottomPanel = $_POST['bot'];
			$template = $_POST['template'];
			
			update_option($this->jplist_options->jplist_js, $jsSettings);
			update_option($this->jplist_options->jplist_top, $topPanel);
			update_option($this->jplist_options->jplist_bot, $bottomPanel);
			update_option($this->jplist_options->jplist_template, $template);
			
			die();
		}
		
		/**
		* reset js panel -> ajax callback
		*/
		public function reset_js_panel_callback(){
		
			delete_option($this->jplist_options->jplist_js);	
			echo($this->jplist_controls->js_settings);
			die();
		}
		
		/**
		* reset top panel -> ajax callback
		*/
		public function reset_top_panel_callback(){
		
			delete_option($this->jplist_options->jplist_top);	
			echo($this->jplist_controls->top_panel);		
			die();
		}
		
		/**
		* reset bottom panel -> ajax callback
		*/
		public function reset_bot_panel_callback(){
		
			delete_option($this->jplist_options->jplist_bot);	
			echo($this->jplist_controls->bot_panel);
			die();
		}
		
		/**
		* reset template panel -> ajax callback
		*/
		public function reset_js_template_callback(){
		
			delete_option($this->jplist_options->jplist_template);	
			echo($this->jplist_controls->template);
			die();
		}
	
	}
?>