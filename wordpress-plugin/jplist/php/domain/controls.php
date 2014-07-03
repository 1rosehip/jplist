<?php
		
	/**
	* jPList Controls Class
	*/
	class jplist_controls{
		
		public $jplist_relative_path;
		
		//controls
		public $reset_btn;
		public $items_per_page;
		public $sort_dd;
		public $title_text_filter;
		public $pagination_results;
		public $pagination;
		public $preloader;
		
		//default panels html
		public $top_panel;
		public $bot_panel;
		public $js_settings;
		public $template;
		
		/**
		* constructor
		*/
		public function jplist_controls($jplist_relative_path){
			
			//init properties
			$this->jplist_relative_path = $jplist_relative_path;
			
			//init default controls html
			$this->reset_btn = $this->get_reset_btn_html();
			$this->items_per_page = $this->get_items_per_page_html();
			$this->sort_dd = $this->get_sort_dd_html();
			$this->title_text_filter = $this->get_title_text_filter_html();
			$this->pagination_results = $this->get_pagination_results_html();
			$this->pagination = $this->get_pagination_html();
			$this->preloader = $this->get_preloader_html();
			
			//init default panel html
			$this->top_panel = $this->reset_btn . $this->items_per_page . $this->sort_dd . $this->title_text_filter . $this->pagination_results . $this->pagination . $this->preloader;
			$this->bot_panel = $this->items_per_page . $this->sort_dd . $this->pagination_results . $this->pagination;
			
			//init default js settings
			$this->js_settings = $this->get_js_settings();
			
			//get handlebars template content
			$this->template = $this->get_template_content();
		}
		
		/**
		* get preloader 
		*/
		public function get_preloader_html(){
			
			$html = "";
			
			$html .= "<!-- preloader for data sources -->\r\n";
			$html .= "<div \r\n";
				$html .= "\tclass='jplist-hide-preloader jplist-preloader' \r\n";
				$html .= "\tdata-control-type='preloader' \r\n";
				$html .= "\tdata-control-name='preloader' \r\n";
				$html .= "\tdata-control-action='preloader'>\r\n";
				$html .= "\t<img src='" . $this->jplist_relative_path . "/content/img/common/ajax-loader-line.gif' alt='Loading...' title='Loading...' />\r\n";
			$html .= "</div>\r\n\r\n";
			
			return $html;
		}
		
		/**
		* get handlebars template content
		*/
		public function get_template_content(){
			
			$content = "";
			
			$content .= "<!-- handlebars template -->\r\n";
			$content .= "<script id='jplist-template' type='text/x-handlebars-template'>\r\n";
				
				$content .= "\t<!-- loop items -->\r\n";
				$content .= "\t{{#each this}}\r\n\r\n";				
					
					$content .= "\t\t<!-- jplist item --> \r\n";
					$content .= "\t\t<div class='jplist-item' id='jplist-item-{{ID}}' data-type='item'>\r\n";
					
					$content .= "\t\t\t\t<!-- title -->\r\n";	
					$content .= "\t\t\t\t<div class='jplist-title'><p><a href='{{link}}' title='{{post_title}}'>{{post_title}}</a></p></div>\r\n";	
					
					$content .= "\t\t\t\t<div class='jplist-thumb'><p><a href='{{link}}' title='{{post_title}}'>{{{thumb}}}</a></p></div>\r\n";
								
					$content .= "\t\t\t\t<div class='jplist-item-content'>\r\n";
					$content .= "\t\t\t\t\t<p class='jplist-date'>{{date}} {{time}}</p>\r\n";
					//$content .= "\t\t\t\t\t<p class='jplist-date-hidden'>{{hidden_date}}-{{hidden_time}}</p>\r\n";
					$content .= "\t\t\t\t\t<p class='jplist-excerpt'>{{excerpt}}</p>\r\n";
					$content .= "\t\t\t\t\t<p class='jplist-readmore'><a href='{{link}}' title='{{post_title}}'>Read More &#187;</a></p>\r\n";
					$content .= "\t\t\t\t</div>\r\n";
					
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
						
			$js = "";
			
			$js .= "jQuery('document').ready(function(){\r\n\r\n";
							
				$js .= "\tvar \$list = jQuery('.jplist .jplist-list')\r\n";
					$js .= "\t\t,template = Handlebars.compile(jQuery('#jplist-template').html());\r\n\r\n";
				
				$js .= "\t//init jplist with php + mysql data source, json and handlebars template\r\n";
				$js .= "\tjQuery('.jplist').jplist({\r\n\r\n";
				
					$js .= "\t\titemsBox: '.jplist-list'\r\n"; 
					$js .= "\t\t,itemPath: '[data-type=\"item\"]'\r\n"; 
					$js .= "\t\t,panelPath: '.jplist-panel'\r\n\r\n";
					
					$js .= "\t\t//data source\r\n";
					$js .= "\t\t,dataSource: {\r\n\r\n";
						
						$js .= "\t\t\ttype: 'server'\r\n";
						$js .= "\t\t\t,server: {\r\n\r\n";
						
							$js .= "\t\t\t\t//ajax settings\r\n";
							$js .= "\t\t\t\tajax:{\r\n";
							  $js .= "\t\t\t\t\turl: '" . admin_url('admin-ajax.php') . "'\r\n"; 
							  $js .= "\t\t\t\t\t,dataType: 'json'\r\n"; 
							  $js .= "\t\t\t\t\t,type: 'POST'\r\n";
							  $js .= "\t\t\t\t\t,data: { action: 'jplist_get_posts' }\r\n";
							$js .= "\t\t\t\t}\r\n";
						$js .= "\t\t\t}\r\n\r\n";
						
						$js .= "\t\t\t//render function for json + templates like handlebars, xml + xslt etc.\r\n";
						$js .= "\t\t\t,render: function(dataItem, statuses){\r\n";
							$js .= "\t\t\t\t\$list.html(template(dataItem.content));\r\n";
						$js .= "\t\t\t}\r\n";
					 $js .= "\t\t}\r\n\r\n";
					 
					 //panel controls
					 $js .= "\t\t,controlTypes:{\r\n";
						
						$js .= "\t\t\t'textbox':{\r\n";
						   $js .= "\t\t\t\tclassName: 'Textbox'\r\n"; 
						   $js .= "\t\t\t\t,options: {\r\n";
							  $js .= "\t\t\t\t\teventName: 'keyup' //'keyup', 'input' or other event\r\n";
							  $js .= "\t\t\t\t\t,ignore: '' \r\n";						
						   $js .= "\t\t\t\t}\r\n";
						$js .= "\t\t\t}\r\n";
					 $js .= "\t\t}\r\n\r\n";

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
				 $html .= "data-datetime-format='{year}-{month}-{day}-{hour}-{min}-{sec}'>\r\n";
				 
				 $html .= "\t<ul>\r\n";
					$html .= "\t\t<li><span data-path='default'>Sort by</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.jplist-title' data-order='asc' data-type='text'>Post Title A-Z</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.jplist-title' data-order='desc' data-type='text'>Post Title Z-A</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.jplist-date' data-order='asc' data-type='datetime'>Post Date asc</span></li>\r\n";
					$html .= "\t\t<li><span data-path='.jplist-date' data-order='desc' data-type='datetime'>Post Date desc</span></li>\r\n";
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
			$html .= "<!-- filter by post title -->\r\n";
			$html .= "<div class='text-filter-box'>\r\n";
			 
			$html .= "\t<!--[if lt IE 10]>\r\n";
			$html .= "\t<div class='jplist-label'>Filter by Post Title:</div>\r\n";
			$html .= "\t<![endif]-->\r\n\r\n";
			 
			$html .= "\t<input \r\n";
				$html .= "\tdata-path='.jplist-title' \r\n";
				$html .= "\ttype='text' \r\n";
				$html .= "\tvalue='' \r\n";
				$html .= "\tplaceholder='Filter by Post Title' \r\n";
				$html .= "\tdata-control-type='textbox' \r\n";
				$html .= "\tdata-control-name='title-filter' \r\n";
				$html .= "\tdata-control-action='filter' \r\n";
				$html .= "\tdata-button='#title-search-button' \r\n";
			$html .= "/>\r\n\r\n";
			
			$html .= "\t<button  \r\n";
				$html .= "\ttype='button' \r\n"; 
				$html .= "\tid='title-search-button'> \r\n";
				$html .= "\t<i class='fa fa-search'></i> \r\n";
			$html .= "\t</button> \r\n\r\n";
			
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