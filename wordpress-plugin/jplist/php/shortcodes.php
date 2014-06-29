<?php

/**
* jPlist shortcodes class
*/

class jplist_shortcodes{

	public static $jplist_relative_path;
	public static $jplist_options;
	
	/**
	* entry point
	*/
	public static function init($jplist_relative_path, $jplist_options){
	
		//init vars
		jplist_shortcodes::$jplist_relative_path = $jplist_relative_path;
		jplist_shortcodes::$jplist_options = $jplist_options;
		
		//init shortcodes
		jplist_shortcodes::init_shortcodes();		
	}
	
	/**
	* get content html
	* @return {string} content html
	*/
	public static function getContentHTML($atts, $content){
		
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
	public static function init_shortcodes(){

		/**
		* user shortcode: [jplist][/jplist]
		* @param {array} $atts - array of attributes
		* @param {string} $content - shortcode conent
		* @return {string} html
		*/
		add_shortcode('jplist', function($atts, $content = null){
		
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
			$html .= stripslashes_deep(get_option('jplist_top'));
			$html .= '</div>';
			
			//data
			$html .= '<div class="list box text-shadow">';
			$html .= jplist_shortcodes::getContentHTML($atts, $content);
			$html .= '</div>';
			
			//no results
			$html .= $no_results;
			
			//bottom ios button
			$html .= $ios_btn;
			
			//bottom panel
			$html .= '<div class="jplist-panel box panel-bottom" style="float: left; width: 100%; margin: 15px 0 0 0">';
			$html .= stripslashes_deep(get_option('jplist_bot'));
			$html .= '</div>';
			
			$html .= '</div>';
			
			$html .= '<script>' . stripslashes_deep(get_option('jplist_js')) . '</script>';
			
			return $html;
		});
		
	}
}	
?>