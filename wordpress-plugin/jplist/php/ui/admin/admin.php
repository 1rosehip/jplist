<?php
	
	/**
	* jPList Admin UI Class
	*/
	class jplist_admin{
		
		public $jplist_relative_path;
		public $jplist_controls;
		public $jplist_options;
		
		/**
		* constructor
		*/
		public function jplist_admin($jplist_relative_path, $jplist_options, $jplist_controls){
			
			$this->jplist_relative_path = $jplist_relative_path;
			$this->jplist_controls = $jplist_controls;
			$this->jplist_options = $jplist_options;
			
			//add settings page
			add_action('admin_menu',  array(&$this, 'add_settings_page'));
			
			//content head
			add_action('admin_head', array(&$this, 'admin_register_head'));	
		}	

		/**
		* add html head section
		*/
		public function admin_register_head(){
			
			//add jplist css and js for admin
			$css = $this->jplist_relative_path . '/content/css/jplist-admin.min.css';
			$js = $this->jplist_relative_path . '/content/js/jplist-admin.min.js';
			
			echo "<link rel='stylesheet' href='//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css' />";
			echo "<link rel='stylesheet' href='$css' />";
			echo "<script src='$js'></script>";
			
			//add codemirror files
			
			$codemirror_css =  $this->jplist_relative_path . '/content/codemirror/lib/codemirror.css';
			$show_hint_css = $this->jplist_relative_path . '/content/codemirror/addon/hint/show-hint.css';
			
			echo "<link rel='stylesheet' href='$codemirror_css' />";
			echo "<link rel='stylesheet' href='$show_hint_css' />";
			
			$codemirror = $this->jplist_relative_path . '/content/codemirror/lib/codemirror.js';
			$show_hint = $this->jplist_relative_path . '/content/codemirror/addon/hint/show-hint.js';
			$xml_hint = $this->jplist_relative_path . '/content/codemirror/addon/hint/xml-hint.js';
			$html_hint = $this->jplist_relative_path . '/content/codemirror/addon/hint/html-hint.js';
			$codemirror_xml = $this->jplist_relative_path . '/content/codemirror/mode/xml/xml.js';
			$codemirror_js = $this->jplist_relative_path . '/content/codemirror/mode/javascript/javascript.js';
			$codemirror_css = $this->jplist_relative_path . '/content/codemirror/mode/css/css.js';
			$htmlmixed = $this->jplist_relative_path . '/content/codemirror/mode/htmlmixed/htmlmixed.js';
			$autoformat = $this->jplist_relative_path . '/content/codemirror/lib/util/formatting.js';		
			
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
					<p>Welcome to the administration panel of the jPList plugin. Get started at <a href="http://jplist.com">jplist.com</a>, fork it on <a href="https://github.com/no81no/jplist">GitHub</a> or read license <a href="http://jplist.com/home/download" title="">here</a>.</p>
				</div>		
				
				<div class="wrap">
					<p>
						<input type="button" value="Save changes" class="button-primary" data-type="save-changes" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
						<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
					</p>
				</div>
				
				<div class="wrap">
				
					<!-- jPList admin content -->
					<div class="jp-box">
						
						
						<!-- top panel controls -->
						<div class="jp-box jp-settings-box">
							
							<!-- header -->
							<div class="jp-box jp-settings-header">
								<p class="jp-left">
									<a href="http://jplist.com/home/controls" title="jPList Controls"><i class="fa fa-question-circle"></i></a>
									Top Panel Controls
								</p>
								<p class="jp-right">
									<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
									<input type="button" value="Reset" class="button-primary" data-type="reset-top-panel" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
								</p>
							</div>
							
							<!-- content -->
							<div class="jp-box jp-settings-content">
								
								<!-- codemirror placeholder -->
								<div id="top-bar-ta"></div>
								
								<!-- hidden content -->
								<div class="hidden" id="top-bar-ta-content">
								
	<?php
	if(!get_option($this->jplist_options->jplist_top)){

		print($this->jplist_controls->top_panel);
	} 
	else{
		echo(stripslashes_deep(get_option($this->jplist_options->jplist_top)));
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
								<p class="jp-left">
									<a href="http://jplist.com/home/controls" title="jPList Controls"><i class="fa fa-question-circle"></i></a>
									Bottom Panel Controls
								</p>
								<p class="jp-right">
									<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
									<input type="button" value="Reset" class="button-primary" data-type="reset-bot-panel" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
								</p>
							</div>
							
							<!-- content -->
							<div class="jp-box jp-settings-content">
								
								<!-- codemirror placeholder -->
								<div id="bottom-bar-ta"></div>
								
								<!-- hidden content -->
								<div class="hidden" id="bottom-bar-ta-content">
	<?php  	
	if(!get_option($this->jplist_options->jplist_bot)){

		echo($this->jplist_controls->bot_panel);
	} 
	else{
		echo(stripslashes_deep(get_option($this->jplist_options->jplist_bot)));
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
								<p class="jp-left">
									<a href="http://handlebarsjs.com" title="Handlebars"><i class="fa fa-question-circle"></i></a>
									Handlebars Template
								</p>
								<p class="jp-right">
									<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
									<input type="button" value="Reset" class="button-primary" data-type="reset-template" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
								</p>
							</div>
							
							<!-- content -->
							<div class="jp-box handlebars-template-content">
								
								<!-- codemirror placeholder -->
								<div id="handlebars-template-bar-ta"></div>
								
								<!-- hidden content -->
								<div class="hidden" id="handlebars-template-bar-ta-content">
	<?php  
	if(!get_option($this->jplist_options->jplist_template)){

		echo($this->jplist_controls->template);
	} 
	else{
		echo(stripslashes_deep(get_option($this->jplist_options->jplist_template)));
	}
	?>
								</div>	
								<!-- end of hidden content -->
								
							</div>
						</div>
						<!-- end of handlebars template -->
						
						<!-- jplist plugin call -->
						<div class="jp-box jp-settings-box">
						
							<!-- header -->
							<div class="jp-box jp-settings-header">
								<p class="jp-left">
									<a href="http://jplist.com/home/js-settings" title="jPList JavaScript Settings"><i class="fa fa-question-circle"></i></a>
									JavaScript Settings
								</p>
								<p class="jp-right">								
									<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
									<input type="button" value="Reset" class="button-primary" data-type="reset-js" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
								</p>
							</div>
							
							<!-- content -->
							<div class="jp-box jp-settings-content">
								
								<!-- codemirror placeholder -->
								<div id="js-settings-bar-ta"></div>
								
								<!-- hidden content -->
								<div class="hidden" id="js-settings-bar-ta-content">
	<?php
	if(!get_option($this->jplist_options->jplist_js)){

		echo($this->jplist_controls->js_settings);
	} 
	else{
		echo(stripslashes_deep(get_option($this->jplist_options->jplist_js)));
	}
	?>						
								</div>
							</div>
							
						</div>
						
					</div>
					
				</div>
			
				<div class="wrap">
					<p>
						<input type="button" value="Save changes" class="button-primary" data-type="save-changes" data-url="<?php echo(admin_url('admin-ajax.php')); ?>" />
						<img class="jp-preloader" src="<?php echo($this->jplist_relative_path); ?>/content/img/common/ajax-loader.gif" alt="Loaing..." title="Loaing..." />
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
	
	}
?>