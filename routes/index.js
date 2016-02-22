var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/home', { title: 'Tuscany' });
});

router.get('/login', function(req, res, next){
	res.render('pages/login', {title: 'Login'});
});

router.get('/register', function(req, res, next){
	res.render('pages/register');
});

module.exports = router;
