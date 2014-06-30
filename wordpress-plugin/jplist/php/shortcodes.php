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
	
		//init vars
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
	* get content html
	* @return {string} content html
	*/
	public function getContentHTML($atts, $content){
		
		$html = '';

		//global $post;
		$args = array('numberposts' => -1); 
		$posts = get_posts($args);
		if ($posts){	
			foreach($posts as $post){
				
				$html .= '<div data-type="item" style="float: left; width: 100%; margin: 20px 0">';
					$html .= '<div style="float: left; margin: 0 15px 15px 15px;">';
						$html .= '<a href="' . get_permalink($post->ID) . '">';
							$html .= get_the_post_thumbnail($post->ID, 'thumbnail', '');			
						$html .= '</a>';
					$html .= '</div>';
					$html .= '<a title="' . $post->post_title . '" href="' . get_permalink($post->ID) . '" class="title">' . $post->post_title . '</a>';
					$html .= '<p>' . wp_trim_words($post->post_content) . '</p>';
					$html .= '<a href="' . get_permalink($post->ID) . '" title="' . $post->post_title . '">Read More</a>';
				$html .= '</div>';
			}
		}

		return $html;
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
		$no_results .= '<div class="box jplist-no-results text-shadow align-center">';
			$no_results .= '<p>No results found</p>';
		$no_results .= '</div>';
	
		$html = '';
		$html .= '<div id="jplist-box" class="box jplist" style="float: left; width: 100%;">';
		
		//top ios button
		$html .= $ios_btn;
		
		//top panel
		$html .= '<div class="jplist-panel box panel-top" style="float: left; width: 100%; margin: 0 0 15px 0">';
		
		if(!get_option('jplist_top')){				
			$html .= stripslashes_deep($this->jplist_controls->top_panel);
		} 
		else{
			$html .= stripslashes_deep(get_option('jplist_top'));
		}
		
		$html .= '</div>';
		
		//data
		$html .= '<div class="list box text-shadow">';
		$html .= $this->getContentHTML($atts, $content);
		$html .= '</div>';
		
		//no results
		$html .= $no_results;
		
		//bottom ios button
		$html .= $ios_btn;
		
		//bottom panel
		$html .= '<div class="jplist-panel box panel-bottom" style="float: left; width: 100%; margin: 15px 0 0 0">';
		
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