/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/range-slider-toggle-filter.min.js'
]

//source files
,[
	'../../../../source-code/ui/panel/controls/range-slider-toggle-filter/range-slider-toggle-filter-view.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);