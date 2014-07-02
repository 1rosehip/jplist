<?php

/**
* jPlist shortcodes class
*/
class jplist_shortcodes{

	public $jplist_relative_path;
	public $jplist_options;
	public $jplist_controls;
	
	/**
	* constructor
	*/
	public function jplist_shortcodes($jplist_relative_path, $jplist_options, $jplist_controls){
	
		//init properties
		$this->jplist_relative_path = $jplist_relative_path;
		$this->jplist_options = $jplist_options;
		$this->jplist_controls = $jplist_controls;
		
		/**
		* init shortcode: [jplist][/jplist]
		* @param {array} $atts - array of attributes
		* @param {string} $content - shortcode conent
		* @return {string} html
		*/
		add_shortcode('jplist',  array(&$this, 'init_shortcodes'));
	}
		
	/**
	* init jplist shortcodes
	*/
	public function init_shortcodes($atts, $content = null){

		//ios button: show/hide panel
		$ios_btn = '';
		$ios_btn .= '<div class="jplist-ios-button">';
		$ios_btn .= '<i class="fa fa-sort"></i>';
		$ios_btn .= 'jPList Actions';
		$ios_btn .= '</div>';
		
		//no results
		$no_results = '';
		$no_results .= '<div class="jplist-no-results">';
			$no_results .= '<p>No results found</p>';
		$no_results .= '</div>';
	
		$html = '';
		$html .= '<div class="jplist">';
		
		//top ios button
		$html .= $ios_btn;
		
		//top panel
		$html .= '<div class="jplist-panel panel-top">';
		
		if(!get_option('jplist_top')){				
			$html .= stripslashes_deep($this->jplist_controls->top_panel);
		} 
		else{
			$html .= stripslashes_deep(get_option('jplist_top'));
		}
		
		$html .= '</div>';
		
		//ajax content here
		$html .= '<div class="jplist-list"></div>';
		
		//no results
		$html .= $no_results;
		
		//bottom ios button
		$html .= $ios_btn;
		
		//bottom panel
		$html .= '<div class="jplist-panel panel-bottom">';
		
		if(!get_option('jplist_bot')){				
			$html .= stripslashes_deep($this->jplist_controls->bot_panel);
		} 
		else{
			$html .= stripslashes_deep(get_option('jplist_bot'));
		}
		
		$html .= '</div>';
		
		$html .= '</div>';
		
		//add jplist call script
		$html .= '<script>';
		
		if(!get_option('jplist_js')){				
			$html .= stripslashes_deep($this->jplist_controls->js_settings);
		} 
		else{
			$html .= stripslashes_deep(get_option('jplist_js'));
		}
		
		$html .= '</script>';
		
		//add handlebars template
		
		if(!get_option('jplist_template')){				
			$html .= stripslashes_deep($this->jplist_controls->template);
		} 
		else{
			$html .= stripslashes_deep(get_option('jplist_template'));
		}
		
		return $html;
	}
}	
?>