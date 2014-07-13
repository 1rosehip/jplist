var express = require('express')
	,router = express.Router();

/**
* get /index (home page)
*/
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
