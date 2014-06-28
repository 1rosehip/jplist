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
	
	/**
	* @type {string}
	* the jplist options db record
	*/
	public $jplist_options;
	
	/**
	* contructor
	*/
	function jplist(){
		
		//init includes path
		$this->jplist_abs_path = dirname(__FILE__); //ABSPATH
		$this->jplist_relative_path = get_bloginfo('wpurl') . '/wp-content/plugins/jplist';
		
		//init jplist options db record
		$this->jplist_options = 'jplist_options';
		
		//include
		require_once($this->jplist_abs_path . '/php/shortcodes.php' );
		
		//add settings page
		add_action('admin_menu',  array(&$this, 'add_settings_page'));
		
		//admin head
		add_action('admin_head', array(&$this, 'admin_register_head'));	
		
		add_action('wp_enqueue_scripts', function(){

			//deregister jplist
			wp_deregister_style('jplist_styles');
			
			//register jplist
			wp_register_style('jplist_styles', '//cdnjs.cloudflare.com/ajax/libs/jplist/5.1.35/jplist.min.css', false, '5.1.35', 'all'); 
			
			//add jplist
			wp_enqueue_style('jplist_styles');
			
			//deregister jplist
			wp_deregister_script('jplist');
			
			//register jplist
			wp_register_script('jplist', '//cdnjs.cloudflare.com/ajax/libs/jplist/5.1.35/jplist.min.js', array('jquery'), '5.1.35', true);
			
			//add jplist
			wp_enqueue_script('jplist');
		});
		
		//init shorcodes
		jplist_shortcodes::init($this->jplist_relative_path, $this->jplist_options);
		
		//on plugin activation		
		register_activation_hook(__FILE__, array(&$this, 'register_activation'));
		
		//on plugin deactivation		
		//register_deactivation_hook(__FILE__, array(&$this, 'register_deactivation'));
			
		//on plugin uninstall		
		register_uninstall_hook(__FILE__, 'register_uninstall');			
	}
	
	/**
	* add html head section
	*/
	public function admin_register_head(){
		
		$url = $this->jplist_relative_path . '/admin/css/options.css';
		
		echo "<link rel='stylesheet' href='$url' />";
	}
	
	/**
	* add jplist settings page to the wordpress settings section
	*/
	public function add_settings_page(){
	
		if(function_exists('add_options_page')){
		
			// @param {string} page title
			// @param {string} menu item title
			// @param {string} capability
			// @param {file} file pointer
			// @param {function} function with options
			$this->jplist_options_page = add_options_page('jPList Settings' 
															 ,'jPList' 
															 ,'manage_options'
															 ,basename(__FILE__) 
															 ,array(&$this, 'settings_page_content'));
		}
	}
	
	/**
	* init settings page content
	*/
	public function settings_page_content(){
		
		//check permissions
		$this->check_permissions();	
		
		?>
		Test
		<?php
	}
	
	/**
	* check permissions
	*/ 
	public function check_permissions(){
	
		//check if user has privilages to change options
		if(function_exists('current_user_can') && !current_user_can('manage_options')){
			die('Permissions required');
		}
		
		//check if user was refered from one of admin pages
		//if(function_exists('check_admin_referer')){
			//check_admin_referer('');
		//}
	}
	
	/**
	* on plugin activation
	*/
	public function register_activation(){
	
		$options = false;
		$defaults = array();
		$data = NULL;
		
		//get jplist options from db
		$options = get_option($this->jplist_options);
		
		if($options){
		
			//delete options if exists
			delete_option($this->jplist_options);
		}
		
		/*
		//create one default jplist
		$data = new jplist_settings_data();
		
		//init default options list
		$defaults[] = $data->get_data_array();
		
		//test
		$test = new jplist_settings_data(); 
		$test->jplist_items_box_path = '12345';
		$defaults[] = $test->get_data_array();
		
		//save to db
		update_option($this->jplist_options, $defaults);
		*/
	}
	
	/**
	* on plugin uninstall
	*/
	public static function register_uninstall(){
		
		$options = false;
		
		//get jplist options from db
		$options = get_option($this->jplist_options);
		
		if($options){
		
			//delete options if exists
			delete_option($this->jplist_options);
		}
	}
		
}	

/**
* jplist new class instance
*/
$jplist = new jplist();


?>