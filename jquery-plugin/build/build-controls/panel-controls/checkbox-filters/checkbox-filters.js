/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/checkbox-filters.min.js'
]

//source files
,[	
	'../../../../source-code/ui/panel/controls/checkbox-filters/checkbox-group-filter-view.js'
	,'../../../../source-code/ui/panel/controls/checkbox-filters/checkbox-group-filter-dto.js'
	,'../../../../source-code/ui/panel/controls/checkbox-filters/checkbox-text-filter-view.js'
	,'../../../../source-code/ui/panel/controls/checkbox-filters/checkbox-text-filter-dto.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);