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
					$html .= '<a href="' . get_permalink($post->ID) . '" title="' . $post->post_title . '">Read More</a';
				$html .= '</div>';
			}
		}

		return $html;
	}
	
	/**
	* get panel
	* @param {Boolean} $is_top - if true -> return top panel html, otherwise return bottom panel html
	* @return {string} html
	*/
	public static function getPanelHTML($is_top){
		
		$html = '';
		
		//reset button
		$reset = '';
		$reset .= '<button ';
			 $reset .= 'type="button" ';
			 $reset .= 'class="jplist-reset-btn" ';
			 $reset .= 'data-control-type="reset" ';
			 $reset .= 'data-control-name="reset" ';
			 $reset .= 'data-control-action="reset">';
			 $reset .= 'Reset  <i class="fa fa-share"></i>';
		$reset .= '</button>';
		
		//items per page dropdown
		$items_per_page = '';
		$items_per_page .= '<div ';
			$items_per_page .= ' class="jplist-drop-down" ';
			$items_per_page .= 'data-control-type="drop-down" '; 
			$items_per_page .= ' data-control-name="paging" '; 
			$items_per_page .= 'data-control-action="paging">';
		 
			$items_per_page .= '<ul>';
				$items_per_page .= '<li><span data-number="3"> 3 per page </span></li>';
				$items_per_page .= '<li><span data-number="5" data-default="true"> 5 per page </span></li>';
				$items_per_page .= '<li><span data-number="10"> 10 per page </span></li>';
				$items_per_page .= '<li><span data-number="all"> view all </span></li>';
			$items_per_page .= '</ul>';
		$items_per_page .= '</div> ';
		
		//sort dropdown
		$sort_dd = '';
		$sort_dd .= '<div ';
			 $sort_dd .= 'class="jplist-drop-down" '; 
			 $sort_dd .= 'data-control-type="drop-down" '; 
			 $sort_dd .= 'data-control-name="sort" ';
			 $sort_dd .= 'data-control-action="sort" ';
			 $sort_dd .= 'data-datetime-format="{month}/{day}/{year}">';
			 
			 $sort_dd .= '<ul>';
				$sort_dd .= '<li><span data-path="default">Sort by</span></li>';
				$sort_dd .= '<li><span data-path=".title" data-order="asc" data-type="text">Title A-Z</span></li>';
				$sort_dd .= '<li><span data-path=".title" data-order="desc" data-type="text">Title Z-A</span></li>';
			 $sort_dd .= '</ul>';
		$sort_dd .= '</div>';
		
		//filter by title
		$text_filter = '';
		$text_filter .= '<div class="text-filter-box">';

		$text_filter .= '<i class="fa fa-search  jplist-icon"></i>';
		 
		$text_filter .= '<!--[if lt IE 10]>';
		$text_filter .= '<div class="jplist-label">Filter by Title:</div>';
		$text_filter .= '<![endif]-->';
		 
		$text_filter .= '<input ';
			$text_filter .= 'data-path=".title" ';
			$text_filter .= 'type="text" ';
			$text_filter .= 'value="" ';
			$text_filter .= 'placeholder="Filter by Title" ';
			$text_filter .= 'data-control-type="textbox" ';
			$text_filter .= 'data-control-name="title-filter" ';
			$text_filter .= 'data-control-action="filter ';
		$text_filter .= '/>';
		$text_filter .= '</div>';
		
		//pagination results
		$pagination_label = '';
		$pagination_label .= '<div ';
			 $pagination_label .= 'class="jplist-label" ';
			 $pagination_label .= 'data-type="Page {current} of {pages}" ';
			 $pagination_label .= 'data-control-type="pagination-info" '; 
			 $pagination_label .= 'data-control-name="paging" ';
			 $pagination_label .= 'data-control-action="paging">';
		$pagination_label .= '</div>';
		
		//pagination
		$pagination = '';
		$pagination .= '<div ';
			$pagination .= 'class="jplist-pagination" ';
			$pagination .= 'data-control-type="pagination" ';
			$pagination .= 'data-control-name="paging" ';
			$pagination .= 'data-control-action="paging">';
		$pagination .= '</div>';		
		
		if($is_top){		
			$html .= $reset . $items_per_page . $sort_dd . $text_filter . $pagination_label . $pagination;
		}
		else{
			$html .= $items_per_page . $sort_dd . $pagination_label . $pagination;
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
			$html .= '<div id="demo" class="box jplist" style="float: left; width: 100%;">';
			
			//top ios button
			$html .= $ios_btn;
			
			//top panel
			$html .= '<div class="jplist-panel box panel-top" style="float: left; width: 100%; margin: 0 0 15px 0">';
			$html .= jplist_shortcodes::getPanelHTML(true);
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
			$html .= jplist_shortcodes::getPanelHTML(false);
			$html .= '</div>';
			
			$html .= '</div>';
			
			//call jplist ...
			$html .= "<script>";
				$html .= "jQuery(document).ready(function(){";
					$html .= "jQuery('#demo').jplist({";	
						$html .= "itemsBox: '.list' ";
						$html .= ",itemPath: '[data-type=\"item\"]'";
						$html .= ",panelPath: '.jplist-panel'";
					$html .= "});";
				$html .= "});";
			$html .= "</script>";
			
			return $html;
		});
		
	}
}	
?>