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
		public $template;
		
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
			
			//get handlebars template content
			$this->template = $this->get_template_content();
		}
		
		/**
		* get handlebars template content
		*/
		public function get_template_content(){
			
			$content = "";
			
			$content .= "<!-- handlebars template -->\r\n";
			$content .= "<script id='jplist-template' type='text/x-handlebars-template'>\r\n";
				$content .= "\t{{#each this}}\r\n";
				
					$content .= "\t\t<div class='list-item box'>\r\n";	
						$content .= "\t\t\t<div class='img left'>\r\n";
							$content .= "\t\t\t\t<img src='{{image}}' alt='' title=''/>\r\n";
						$content .= "\t\t\t</div>\r\n";
						
						$content .= "\t\t\t<div class='block right'>\r\n";
							$content .= "\t\t\t\t<p class='title'>{{title}}</p>\r\n";
							$content .= "\t\t\t\t<p class='desc'>{{description}}</p>\r\n";
							$content .= "\t\t\t\t<p class='like'>{{likes}} Likes</p>\r\n";
							$content .= "\t\t\t\t<p class='theme'>{{keyword1}}, {{keyword2}}</p>\r\n";
						$content .= "\t\t\t</div>\r\n";
					$content .= "\t\t</div>\r\n";
					
				$content .= "\t{{/each}}\r\n";
			$content .= "</script>\r\n";
			
			return $content;
		}
		
		/**
		* get javascript settings
		* @return {string}
		*/
		public function get_js_settings(){
			
			$js = '';
			
			$js .= "jQuery('document').ready(function(){\r\n\r\n";
	
				$js .= "\tjQuery('#jplist-box').jplist({\r\n";	
					$js .= "\t\titemsBox: '.list' \n";
					$js .= "\t\t,itemPath: '[data-type=\"item\"]' \r\n";
					$js .= "\t\t,panelPath: '.jplist-panel' \r\n";
				$js .= "\t});\r\n";
			$js .= "});\r\n";
			
			return $js;
		}
		
		/**
		* get reset button HTML
		* @return {string}
		*/
		public function get_reset_btn_html(){
			
			$html = "";
			$html .= "<!-- reset button -->\r\n";
			$html .= "<button \r\n";
				 $html .= "type='button' \r\n";
				 $html .= "class='jplist-reset-btn' \r\n";
				 $html .= "data-control-type='reset' \r\n";
				 $html .= "data-control-name='reset' \r\n";
				 $html .= "data-control-action='reset'>\r\n";
				 $html .= "\tReset  <i class='fa fa-share'></i>\r\n";
			$html .= "</button>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get items per page dropdown HTML
		* @return {string}
		*/
		public function get_items_per_page_html(){
			
			$html = "";
			$html .= "<!-- items per page dropdown -->\r\n";
			$html .= "<div \r\n";
				$html .= "class='jplist-drop-down' \r\n";
				$html .= "data-control-type='drop-down' \r\n"; 
				$html .= " data-control-name='paging' \r\n"; 
				$html .= "data-control-action='paging'>\r\n";
			 
				$html .= "\t<ul>\r\n";
					$html .= "\t\t<li><span data-number='3'> 3 per page </span></li>\r\n";
					$html .= "\t\t<li><span data-number='5' data-default='true'> 5 per page </span></li>\r\n";
					$html .= "\t\t<li><span data-number='10'> 10 per page </span></li>\r\n";
					$html .= "\t\t<li><span data-number='all'> view all </span></li>\r\n";
				$html .= "\t</ul>\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get sort dropdown HTML
		* @return {string}
		*/
		public function get_sort_dd_html(){
			
			$html = "";
			$html .= "<!-- sort dropdown -->\r\n";
			$html .= "<div \r\n";
				 $html .= "class='jplist-drop-down' \r\n"; 
				 $html .= "data-control-type='drop-down' \r\n"; 
				 $html .= "data-control-name='sort' \r\n";
				 $html .= "data-control-action='sort' \r\n";
				 $html .= "data-datetime-format='{month}/{day}/{year}'>\r\n";
				 
				 $html .= "\t<ul>\r\n";
					$html .= "\t\t<li><span data-path='default'>Sort by</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.title' data-order='asc' data-type='text'>Title A-Z</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.title' data-order='desc' data-type='text'>Title Z-A</span></li>\r\n";
				 $html .= "\t</ul>\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get title text filter HTML
		* @return {string}
		*/
		public function get_title_text_filter_html(){
			
			$html = "";
			$html .= "<!-- filter by title -->\r\n";
			$html .= "<div class='text-filter-box'>\r\n";

			$html .= "\t<i class='fa fa-search  jplist-icon'></i>\r\n\r\n";
			 
			$html .= "\t<!--[if lt IE 10]>\r\n";
			$html .= "\t<div class='jplist-label'>Filter by Title:</div>\r\n";
			$html .= "\t<![endif]-->\r\n\r\n";
			 
			$html .= "\t<input \r\n";
				$html .= "\tdata-path='.title' \r\n";
				$html .= "\ttype='text' \r\n";
				$html .= "\tvalue='' \r\n";
				$html .= "\tplaceholder='Filter by Title' \r\n";
				$html .= "\tdata-control-type='textbox' \r\n";
				$html .= "\tdata-control-name='title-filter' \r\n";
				$html .= "\tdata-control-action='filter' \r\n";
			$html .= "/>\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get pagination results HTML
		* @return {string}
		*/
		public function get_pagination_results_html(){
			
			$html = "";
			$html .= "<!-- pagination info -->\r\n";
			$html .= "<div \r\n";
				 $html .= "\tclass='jplist-label' \r\n";
				 $html .= "\tdata-type='Page {current} of {pages}' \r\n";
				 $html .= "\tdata-control-type='pagination-info' \r\n"; 
				 $html .= "\tdata-control-name='paging' \r\n";
				 $html .= "\tdata-control-action='paging'>\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get pagination HTML
		* @return {string}
		*/
		public function get_pagination_html(){
			
			$html = "";
			$html .= "<!-- pagination -->\r\n";
			$html .= "<div \r\n";
				$html .= "\tclass='jplist-pagination' \r\n";
				$html .= "\tdata-control-type='pagination' \r\n";
				$html .= "\tdata-control-name='paging' \r\n";
				$html .= "\tdata-control-action='paging'>\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
	}
?>