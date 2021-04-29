var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	const template = 'index';
	const userinfo = req.userContext && req.userContext.userinfo;
	res.render(template, {
	  isLoggedIn: !!userinfo,
	  userinfo: userinfo,
	  title: 'ejs'
	});
    //res.render('index', { title: 'ejs' });
});

module.exports = router;
