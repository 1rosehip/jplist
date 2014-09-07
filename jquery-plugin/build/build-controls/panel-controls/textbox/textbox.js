/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/textbox.min.js'
]

//source files
,[
	'../../../../source-code/ui/panel/controls/textbox/textbox-view.js'
	,'../../../../source-code/ui/panel/controls/textbox/textbox-dto.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);