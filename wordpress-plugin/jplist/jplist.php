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
	* jplist controls instance
	*/
	public $jplist_controls;
	
	/**
	* jplist shortcodes instance
	*/
	public $jplist_shortcodes;
	
	/**
	* jplist logic
	*/
	public $domain;
	
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
		require_once($this->jplist_abs_path . '/php/shortcodes.php');
		require_once($this->jplist_abs_path . '/php/controls.php');
		require_once($this->jplist_abs_path . '/php/jplist-domain.php');
		
		//init jplist control
		$this->jplist_controls = new jplist_controls();
		$this->jplist_shortcodes = new jplist_shortcodes($this->jplist_relative_path, $this->jplist_options, $this->jplist_controls);
		$this->domain = new jplist_domain();
				
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
			
			//deregister jplist
			wp_deregister_script('handlebars');
			
			//register jplist
			wp_register_script('handlebars', '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.min.js', false, '2.0.0-alpha.4', true);
			
			//add jplist
			wp_enqueue_script('handlebars');
		});
		
		//save changes (ajax)
		add_action('wp_ajax_save_changes', array(&$this, 'save_changes_callback'));	
		
		//get posts (ajax)
		add_action('wp_ajax_jplist_get_posts', array(&$this, 'get_posts_callback'));
		
		//on plugin activation		
		register_activation_hook(__FILE__, array(&$this, 'register_activation'));
		
		//on plugin deactivation		
		//register_deactivation_hook(__FILE__, array(&$this, 'register_deactivation'));
			
		//on plugin uninstall		
		register_uninstall_hook(__FILE__, 'register_uninstall');			
	}
	
	/**
	* get posts -> ajax callback
	*/
	public function get_posts_callback(){
	
		$statuses = $_POST['statuses'];
		
		echo($this->domain->get_posts_json($statuses));
		
		die();
	}
	
	/**
	* save changes -> ajax callback
	*/
	public function save_changes_callback(){
	
		$jsSettings = $_POST['js'];
		$topPanel = $_POST['top'];
		$bottomPanel = $_POST['bot'];
		$template = $_POST['template'];
		
		update_option('jplist_js', $jsSettings);
		update_option('jplist_top', $topPanel);
		update_option('jplist_bot', $bottomPanel);
		update_option('jplist_template', $template);
		
		die();
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
		$autoformat = $this->jplist_relative_path . '/admin/codemirror/lib/util/formatting.js';		
		
		echo "<script src='$codemirror'></script>";
		echo "<script src='$show_hint'></script>";
		echo "<script src='$xml_hint'></script>";
		echo "<script src='$html_hint'></script>";
		echo "<script src='$codemirror_xml'></script>";
		echo "<script src='$codemirror_js'></script>";
		echo "<script src='$codemirror_css'></script>";
		echo "<script src='$htmlmixed'></script>";		
		echo "<script src='$autoformat'></script>";		
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
		<div class="wrap" id="jplist-admin-page">
		
			<div class="wrap">
				<h2>jPList - jQuery Data Grid Controls Settings</h2>
				<p>Welcome to the administration panel of the jPList plugin.</p>
			</div>		
			
			<div class="wrap">
				<p>
					<input type="button" value="Save changes" class="button-primary" data-type="save-changes" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
					<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/admin/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
				</p>
			</div>
			
			<div class="wrap">
			
				<!-- jPList admin content -->
				<div class="jp-box">
					
					<!-- jplist plugin call -->
					<div class="jp-box jp-settings-box">
					
						<!-- header -->
						<div class="jp-box jp-settings-header">
							<p>JavaScript Settings</p>
						</div>
						
						<!-- content -->
						<div class="jp-box jp-settings-content">
							
							<!-- codemirror placeholder -->
							<div id="js-settings-bar-ta"></div>
							
							<!-- hidden content -->
							<div class="hidden" id="js-settings-bar-ta-content">
<?php
if(!get_option('jplist_js')){

	echo($this->jplist_controls->js_settings);
} 
else{
	echo(stripslashes_deep(get_option('jplist_js')));
}
?>						
							</div>
						</div>
						
					</div>
					
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
							
<?php
if(!get_option('jplist_top')){

	print($this->jplist_controls->top_panel);
} 
else{
	echo(stripslashes_deep(get_option('jplist_top')));
}
?>
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
<?php  
if(!get_option('jplist_bot')){

	echo($this->jplist_controls->bot_panel);
} 
else{
	echo(stripslashes_deep(get_option('jplist_bot')));
}
?>
							</div>	
							<!-- end of hidden content -->
							
						</div>
					</div>
					<!-- end of bottom panel controls -->
					
					<!-- handlebars template -->
					<div class="jp-box jp-settings-box">
						
						<!-- header -->
						<div class="jp-box jp-settings-header">
							<p>Handlebars Template</p>
						</div>
						
						<!-- content -->
						<div class="jp-box handlebars-template-content">
							
							<!-- codemirror placeholder -->
							<div id="handlebars-template-bar-ta"></div>
							
							<!-- hidden content -->
							<div class="hidden" id="handlebars-template-bar-ta-content">
<?php  
if(!get_option('jplist_template')){

	echo($this->jplist_controls->template);
} 
else{
	echo(stripslashes_deep(get_option('jplist_template')));
}
?>
							</div>	
							<!-- end of hidden content -->
							
						</div>
					</div>
					<!-- end of handlebars template -->
				</div>
				
				
				
			</div>
		
			<div class="wrap">
				<p>
					<input type="button" value="Save changes" class="button-primary" data-type="save-changes" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
					<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/admin/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
				</p>
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
			//delete_option('jplist_top');
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