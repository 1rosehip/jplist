/**
* compile with google closure compiler
*/
var compiler = require('../../../closure/modules/compiler.js');

//result files
compiler.compile([
	'../../../../minified/sections/panel-controls/back-button.min.js'
]

//source files
,[
	'../../../../source-code/ui/panel/controls/back-button/back-button-view.js'
]

//externs
,[
	'../../../closure/externs/jquery-1.7.externs.js'
	,'../../../closure/externs/jplist.addons.externs.js'
]

//don't set version in package.json
,false);