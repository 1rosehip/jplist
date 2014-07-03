<?php
/*
Plugin Name: jPList - jQuery Data Grid Controls
Plugin URI: http://jplist.com
Description: jPList - jQuery Data Grid Controls is a flexible jQuery plugin for sorting, pagination and filtering of any HTML structure (DIVs, UL/LI, tables, etc). 
Version: 1.0
Author: Miriam Zusin
Author URI: http://jplist.com

For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com 
*/

	/**
	* JPlist class
	*/
	class jplist{
		
		/** @type {string} */
		public $jplist_abs_path;
		public $jplist_relative_path;
		
		//properties
		public $jplist_options;
		public $jplist_controls;
		public $jplist_shortcodes;
		public $db;
		public $jplist_page;
		
		//jplist admin page (UI)
		public $jplist_admin;
		public $jplist_admin_ajax;
		
		//jPlist TinyMCE editor
		public $jplist_editor;	
		
		/**
		* contructor
		*/
		function jplist(){
			
			//init includes path
			$this->jplist_abs_path = dirname(__FILE__); //ABSPATH
			$this->jplist_relative_path = get_bloginfo('wpurl') . '/wp-content/plugins/jplist';
					
			//includes
			require_once($this->jplist_abs_path . '/php/domain/shortcodes.php');
			require_once($this->jplist_abs_path . '/php/domain/controls.php');
			require_once($this->jplist_abs_path . '/php/dal/db.php');
			require_once($this->jplist_abs_path . '/php/dal/options.php');
			require_once($this->jplist_abs_path . '/php/ui/admin/admin.php');
			require_once($this->jplist_abs_path . '/php/ui/admin/admin-ajax.php');
			require_once($this->jplist_abs_path . '/php/ui/page/page.php');
			require_once($this->jplist_abs_path . '/php/ui/editor.php');
			
			//init jplist classes
			$this->db = new jplist_db();
			$this->jplist_options = new jplist_options();
			$this->jplist_controls = new jplist_controls($this->jplist_relative_path);
			$this->jplist_shortcodes = new jplist_shortcodes($this->jplist_relative_path, $this->jplist_options, $this->jplist_controls);	

			//init admin
			$this->jplist_admin = new jplist_admin($this->jplist_relative_path, $this->jplist_options, $this->jplist_controls);
			$this->jplist_admin_ajax = new jplist_admin_ajax($this->jplist_relative_path, $this->jplist_options, $this->jplist_controls);
			
			//jplist page
			$this->jplist_page = new jplist_page($this->jplist_relative_path, $this->jplist_options, $this->db);
			
			//TinyMCE editor
			$this->jplist_editor = new jplist_editor($this->jplist_relative_path);
			
			//on plugin activation		
			register_activation_hook(__FILE__, array(&$this, 'register_activation'));
			
			//on plugin deactivation		
			//register_deactivation_hook(__FILE__, array(&$this, 'register_deactivation'));
				
			//on plugin uninstall		
			register_uninstall_hook(__FILE__, 'register_uninstall');			
		}
		
		/**
		* on plugin activation
		*/
		public function register_activation(){
				
			//delete old options (if they exist)
			$this->jplist_options->delete_options();		
		}
		
		/**
		* on plugin uninstall
		*/
		public static function register_uninstall(){
			
			//delete old options (if they exist)
			$this->jplist_options->delete_options();
		}
	}	

	/**
	* jplist new class instance
	*/
	$jplist = new jplist();


?>