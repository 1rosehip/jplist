<?php
		
	/**
	* jPList Controls Class
	*/
	class jplist_controls{
		
		//controls
		public $reset_btn;
		public $items_per_page;
		public $sort_dd;
		public $title_text_filter;
		public $pagination_results;
		public $pagination;
		
		//default panels html
		public $top_panel;
		public $bot_panel;
		public $js_settings;
		
		/**
		* constructor
		*/
		public function jplist_controls(){
			
			//init default controls html
			$this->reset_btn = $this->get_reset_btn_html();
			$this->items_per_page = $this->get_items_per_page_html();
			$this->sort_dd = $this->get_sort_dd_html();
			$this->title_text_filter = $this->get_title_text_filter_html();
			$this->pagination_results = $this->get_pagination_results_html();
			$this->pagination = $this->get_pagination_html();
			
			//init default panel html
			$this->top_panel = $this->reset_btn . $this->items_per_page . $this->sort_dd . $this->title_text_filter . $this->pagination_results . $this->pagination;
			$this->bot_panel = $this->items_per_page . $this->sort_dd . $this->pagination_results . $this->pagination;
			
			//init default js settings
			$this->js_settings = $this->get_js_settings();
		}
		
		/**
		* get javascript settings
		* @return {string}
		*/
		public function get_js_settings(){
			
			$js = '';
			
			$js .= "jQuery('document').ready(function(){";
	
				$js .= "jQuery('#jplist-box').jplist({";	
					$js .= "itemsBox: '.list' ";
					$js .= ",itemPath: '[data-type=\"item\"]' ";
					$js .= ",panelPath: '.jplist-panel' ";
				$js .= "});";
			$js .= "});";
			
			return $js;
		}
		
		/**
		* get reset button HTML
		* @return {string}
		*/
		public function get_reset_btn_html(){
			
			$html = '<button ';
				 $html .= 'type="button" ';
				 $html .= 'class="jplist-reset-btn" ';
				 $html .= 'data-control-type="reset" ';
				 $html .= 'data-control-name="reset" ';
				 $html .= 'data-control-action="reset">';
				 $html .= 'Reset  <i class="fa fa-share"></i>';
			$html .= '</button>';
			
			return $html;
		}
		
		/**
		* get items per page dropdown HTML
		* @return {string}
		*/
		public function get_items_per_page_html(){
			
			$html = '<div ';
				$html .= ' class="jplist-drop-down" ';
				$html .= 'data-control-type="drop-down" '; 
				$html .= ' data-control-name="paging" '; 
				$html .= 'data-control-action="paging">';
			 
				$html .= '<ul>';
					$html .= '<li><span data-number="3"> 3 per page </span></li>';
					$html .= '<li><span data-number="5" data-default="true"> 5 per page </span></li>';
					$html .= '<li><span data-number="10"> 10 per page </span></li>';
					$html .= '<li><span data-number="all"> view all </span></li>';
				$html .= '</ul>';
			$html .= '</div> ';
			
			return $html;
		}
		
		/**
		* get sort dropdown HTML
		* @return {string}
		*/
		public function get_sort_dd_html(){
			
			$html = '<div ';
				 $html .= 'class="jplist-drop-down" '; 
				 $html .= 'data-control-type="drop-down" '; 
				 $html .= 'data-control-name="sort" ';
				 $html .= 'data-control-action="sort" ';
				 $html .= 'data-datetime-format="{month}/{day}/{year}">';
				 
				 $html .= '<ul>';
					$html .= '<li><span data-path="default">Sort by</span></li>';
					$html .= '<li><span data-path=".title" data-order="asc" data-type="text">Title A-Z</span></li>';
					$html .= '<li><span data-path=".title" data-order="desc" data-type="text">Title Z-A</span></li>';
				 $html .= '</ul>';
			$html .= '</div>';
			
			return $html;
		}
		
		/**
		* get title text filter HTML
		* @return {string}
		*/
		public function get_title_text_filter_html(){
			
			$html = '<div class="text-filter-box">';

			$html .= '<i class="fa fa-search  jplist-icon"></i>';
			 
			$html .= '<!--[if lt IE 10]>';
			$html .= '<div class="jplist-label">Filter by Title:</div>';
			$html .= '<![endif]-->';
			 
			$html .= '<input ';
				$html .= 'data-path=".title" ';
				$html .= 'type="text" ';
				$html .= 'value="" ';
				$html .= 'placeholder="Filter by Title" ';
				$html .= 'data-control-type="textbox" ';
				$html .= 'data-control-name="title-filter" ';
				$html .= 'data-control-action="filter ';
			$html .= '/>';
			$html .= '</div>';
			
			return $html;
		}
		
		/**
		* get pagination results HTML
		* @return {string}
		*/
		public function get_pagination_results_html(){
			
			$html = '<div ';
				 $html .= 'class="jplist-label" ';
				 $html .= 'data-type="Page {current} of {pages}" ';
				 $html .= 'data-control-type="pagination-info" '; 
				 $html .= 'data-control-name="paging" ';
				 $html .= 'data-control-action="paging">';
			$html .= '</div>';
			
			return $html;
		}
		
		/**
		* get pagination HTML
		* @return {string}
		*/
		public function get_pagination_html(){
			
			$html = '<div ';
				$html .= 'class="jplist-pagination" ';
				$html .= 'data-control-type="pagination" ';
				$html .= 'data-control-name="paging" ';
				$html .= 'data-control-action="paging">';
			$html .= '</div>';
			
			return $html;
		}
	}
?>