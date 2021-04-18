var express = require('express');
var router = express.Router();

/* GET settings page. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('settings', { title: 'ejs' });
});

module.exports = router;