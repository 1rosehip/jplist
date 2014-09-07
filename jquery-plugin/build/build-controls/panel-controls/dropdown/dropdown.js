/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/dropdown.min.js'
]

//source files
,[
	'../../../../source-code/ui/panel/controls/dropdown/dropdown-view.js'
	,'../../../../source-code/ui/panel/controls/dropdown/select-view.js'
	,'../../../../source-code/ui/panel/controls/dropdown/dto/dropdown-filter-dto.js'
	,'../../../../source-code/ui/panel/controls/dropdown/dto/dropdown-pagination-dto.js'
	,'../../../../source-code/ui/panel/controls/dropdown/dto/dropdown-sort-dto.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);