var express = require('express');
var router = express.Router();

/* GET settings page. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var credentials = JSON.parse(fs.readFileSync('./public/fauxUserCredentials/userCredentials.json','utf-8')).userCredentials;
  res.render('userProfile', { credentials: credentials });
});

module.exports = router;