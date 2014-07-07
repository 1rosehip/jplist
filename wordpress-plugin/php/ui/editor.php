<?php

/**
* jPlist editor (TinyMCE) class
*/
class jplist_editor{

	public $jplist_relative_path;
	
	/**
	* constructor
	*/
	public function jplist_editor($jplist_relative_path){
			
		//init properties
		$this->jplist_relative_path = $jplist_relative_path;
		
		//add new buttons		
		add_filter('mce_external_plugins', array(&$this, 'jplist_add_buttons'));
		add_filter('mce_buttons', array(&$this, 'jplist_register_buttons'));
	}
	
	/**
	* jplist register buttons
	*/
	public function jplist_register_buttons($buttons){		
		array_push($buttons, 'separator', 'jplist');
		return $buttons;
	}	
	
	/**
	* jplist add buttons
	*/
	public function jplist_add_buttons($plugin_array){
		$plugin_array['jplist'] = $this->jplist_relative_path. '/content/js/editor.js';
		return $plugin_array;
	}
	
}	
?>