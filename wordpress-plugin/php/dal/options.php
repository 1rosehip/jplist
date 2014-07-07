<?php

/**
* jPlist Wordpress options class
*/
class jplist_options{
	
	//option properties
	public $jplist_top;
	public $jplist_bot;
	public $jplist_js;
	public $jplist_template;
	
	/**
	* constructor
	*/
	public function jplist_options(){
		
		//init default values
		$this->jplist_top = 'jplist_top';
		$this->jplist_bot = 'jplist_bot';
		$this->jplist_js = 'jplist_js';
		$this->jplist_template = 'jplist_template';
	}
	
	/**
	* delete all options
	*/
	public function delete_options(){
		
		try{
			delete_option($this->jplist_top);	
			delete_option($this->jplist_bot);
			delete_option($this->jplist_js);
			delete_option($this->jplist_template);
		}
		catch(Exception $ex){
			print 'Exception: ' . $ex->getMessage();
		}
	}
}