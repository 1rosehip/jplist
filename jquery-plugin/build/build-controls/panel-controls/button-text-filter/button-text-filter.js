/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/button-text-filter.min.js'
]

//source files
,[
	'../../../../source-code/ui/panel/controls/button-text-filter/button-text-filter-view.js'
	,'../../../../source-code/ui/panel/controls/button-text-filter/button-text-filter-dto.js'
	,'../../../../source-code/ui/panel/controls/button-text-filter/button-text-filter-group-view.js'
	,'../../../../source-code/ui/panel/controls/button-text-filter/button-text-filter-group-dto.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);