/**
* jplist
*/
var express = require('express')
	,router = express.Router()
	,mysql = require('mysql')
	,fs = require('fs')
	,pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'))	
	,connection; 
	
//init mysql connection
connection = mysql.createConnection({
	host      : pjson.db.host
	,user     : pjson.db.user
	,password : pjson.db.password
	,database : pjson.db.database 
});

connection.connect();  

connection.query('SELECT * from item', function(err, rows, fields) {
  if (err) throw err; 

  console.log('Rows length: ', rows.length);
});

connection.end();

/**
* post request: /jplist
*/	
router.post('/', function(req, res) {
  res.json({test: 'aaa'});
});

module.exports = router;
