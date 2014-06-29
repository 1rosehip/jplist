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
		
		//add jplist css and js for admin
		$css = $this->jplist_relative_path . '/admin/css/jplist-admin.min.css';
		$js = $this->jplist_relative_path . '/admin/js/jplist-admin.min.js';
		
		echo "<link rel='stylesheet' href='$css' />";
		echo "<script src='$js'></script>";
		
		//add codemirror files
		
		$codemirror_css =  $this->jplist_relative_path . '/admin/codemirror/lib/codemirror.css';
		$show_hint_css = $this->jplist_relative_path . '/admin/codemirror/addon/hint/show-hint.css';
		
		echo "<link rel='stylesheet' href='$codemirror_css' />";
		echo "<link rel='stylesheet' href='$show_hint_css' />";
		
		$codemirror = $this->jplist_relative_path . '/admin/codemirror/lib/codemirror.js';
		$show_hint = $this->jplist_relative_path . '/admin/codemirror/addon/hint/show-hint.js';
		$xml_hint = $this->jplist_relative_path . '/admin/codemirror/addon/hint/xml-hint.js';
		$html_hint = $this->jplist_relative_path . '/admin/codemirror/addon/hint/html-hint.js';
		$codemirror_xml = $this->jplist_relative_path . '/admin/codemirror/mode/xml/xml.js';
		$codemirror_js = $this->jplist_relative_path . '/admin/codemirror/mode/javascript/javascript.js';
		$codemirror_css = $this->jplist_relative_path . '/admin/codemirror/mode/css/css.js';
		$htmlmixed = $this->jplist_relative_path . '/admin/codemirror/mode/htmlmixed/htmlmixed.js';
		
		echo "<script src='$codemirror'></script>";
		echo "<script src='$show_hint'></script>";
		echo "<script src='$xml_hint'></script>";
		echo "<script src='$html_hint'></script>";
		echo "<script src='$codemirror_xml'></script>";
		echo "<script src='$codemirror_js'></script>";
		echo "<script src='$codemirror_css'></script>";
		echo "<script src='$htmlmixed'></script>";		
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
			<div class="wrap">
				<h2>jPList - jQuery Data Grid Controls Settings</h2>
				<p>Welcome to the administration panel of the jPList plugin.</p>
			</div>		
			
			<div class="wrap">
				<p>
					<input type="button" value="Save changes" class="button-primary" />
				</p>
			</div>
			
			<div class="wrap">
			
				<!-- jPList admin content -->
				<div class="jp-box">
					
					<!-- top panel controls -->
					<div class="jp-box jp-settings-box">
						
						<!-- header -->
						<div class="jp-box jp-settings-header">
							<p>Top Panel Controls</p>
						</div>
						
						<!-- content -->
						<div class="jp-box jp-settings-content">
							
							<!-- codemirror placeholder -->
							<div id="top-bar-ta"></div>
							
							<!-- hidden content -->
							<div class="hidden" id="top-bar-ta-content">
  <!-- reset button -->
  <button 
	 type="button" 
	 class="jplist-reset-btn"
	 data-control-type="reset" 
	 data-control-name="reset" 
	 data-control-action="reset">
	 Reset  <i class="fa fa-share"></i>
  </button>
  
  <!-- items per page dropdown -->
  <div 
	 class="jplist-drop-down" 
	 data-control-type="drop-down" 
	 data-control-name="paging" 
	 data-control-action="paging">
	 
	 <ul>
		<li><span data-number="3"> 3 per page </span></li>
		<li><span data-number="5"> 5 per page </span></li>
		<li><span data-number="10" data-default="true"> 10 per page </span></li>
		<li><span data-number="all"> view all </span></li>
	 </ul>
  </div>
  
  <!-- sort dropdown -->
  <div 
	 class="jplist-drop-down" 
	 data-control-type="drop-down" 
	 data-control-name="sort" 
	 data-control-action="sort"
	 data-datetime-format="{month}/{day}/{year}"> 
	 <!-- {year}, {month}, {day}, {hour}, {min}, {sec} -->
	 
	 <ul>
		<li><span data-path="default">Sort by</span></li>
		<li><span data-path=".title" data-order="asc" data-type="text">Title A-Z</span></li>
		<li><span data-path=".title" data-order="desc" data-type="text">Title Z-A</span></li>
		<li><span data-path=".desc" data-order="asc" data-type="text">Description A-Z</span></li>
		<li><span data-path=".desc" data-order="desc" data-type="text">Description Z-A</span></li>
		<li><span data-path=".like" data-order="asc" data-type="number" data-default="true">Likes asc</span></li>
		<li><span data-path=".like" data-order="desc" data-type="number">Likes desc</span></li>
		<li><span data-path=".date" data-order="asc" data-type="datetime">Date asc</span></li>
		<li><span data-path=".date" data-order="desc" data-type="datetime">Date desc</span></li>
	 </ul>
  </div>

  <!-- filter by title -->
  <div class="text-filter-box">
  
	 <i class="fa fa-search  jplist-icon"></i>
	 
	 <!--[if lt IE 10]>
	 <div class="jplist-label">Filter by Title:</div>
	 <![endif]-->
	 
	 <input 
		data-path=".title" 
		type="text" 
		value="" 
		placeholder="Filter by Title" 
		data-control-type="textbox" 
		data-control-name="title-filter" 
		data-control-action="filter"
	 />
  </div>
		
  <!-- pagination results -->
  <div 
	 class="jplist-label" 
	 data-type="Page {current} of {pages}" 
	 data-control-type="pagination-info" 
	 data-control-name="paging" 
	 data-control-action="paging">
  </div>
	 
  <!-- pagination -->
  <div 
	 class="jplist-pagination" 
	 data-control-type="pagination" 
	 data-control-name="paging" 
	 data-control-action="paging">
  </div>							
							</div>	
							<!-- end of hidden content -->
							
						</div>
					</div>
					<!-- end of top panel controls -->
					
					<!-- bottom panel controls -->
					<div class="jp-box jp-settings-box">
						
						<!-- header -->
						<div class="jp-box jp-settings-header">
							<p>Bottom Panel Controls</p>
						</div>
						
						<!-- content -->
						<div class="jp-box jp-settings-content">
							
							<!-- codemirror placeholder -->
							<div id="bottom-bar-ta"></div>
							
							<!-- hidden content -->
							<div class="hidden" id="bottom-bar-ta-content">
  
  <!-- items per page dropdown -->
  <div 
	 class="jplist-drop-down" 
	 data-control-type="drop-down" 
	 data-control-name="paging" 
	 data-control-action="paging">
	 
	 <ul>
		<li><span data-number="3"> 3 per page </span></li>
		<li><span data-number="5"> 5 per page </span></li>
		<li><span data-number="10"> 10 per page </span></li>
		<li><span data-number="all"> view all </span></li>
	 </ul>
  </div>
  
  <!-- sort dropdown -->
  <div 
	 class="jplist-drop-down" 
	 data-control-type="drop-down" 
	 data-control-name="sort" 
	 data-control-action="sort"
	 data-datetime-format="{month}/{day}/{year}"> 
	 <!-- {year}, {month}, {day}, {hour}, {min}, {sec} -->
	 
	 <ul>
		<li><span data-path="default">Sort by</span></li>
		<li><span data-path=".title" data-order="asc" data-type="text">Title A-Z</span></li>
		<li><span data-path=".title" data-order="desc" data-type="text">Title Z-A</span></li>
		<li><span data-path=".desc" data-order="asc" data-type="text">Description A-Z</span></li>
		<li><span data-path=".desc" data-order="desc" data-type="text">Description Z-A</span></li>
		<li><span data-path=".like" data-order="asc" data-type="number" data-default="true">Likes asc</span></li>
		<li><span data-path=".like" data-order="desc" data-type="number">Likes desc</span></li>
		<li><span data-path=".date" data-order="asc" data-type="datetime">Date asc</span></li>
		<li><span data-path=".date" data-order="desc" data-type="datetime">Date desc</span></li>
	 </ul>
  </div>
		
  <!-- pagination results -->
  <div 
	 class="jplist-label" 
	 data-type="Page {current} of {pages}" 
	 data-control-type="pagination-info" 
	 data-control-name="paging" 
	 data-control-action="paging">
  </div>
	 
  <!-- pagination -->
  <div 
	 class="jplist-pagination" 
	 data-control-type="pagination" 
	 data-control-name="paging" 
	 data-control-action="paging">
  </div>							
							</div>	
							<!-- end of hidden content -->
							
						</div>
					</div>
					<!-- end of bottom panel controls -->
				</div>
				
			</div>
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