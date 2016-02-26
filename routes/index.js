var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/home', { title: 'Tuscany' });
});

router.post('/register', function(req, res, next){
	if(!req.body.email || !req.body.password || !req.body.confirm_psswd
		|| !req.body.first_name || !req.body.last_name){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	if(req.body.password !== req.body.confirm_psswd){
		return res.status(400).json({message: "Passwords don't match!"});
	}

	var user = new User();
	if(!user.validEmail(req.body.email)){
		return res.status(400).json({message: "You need to enter a valid email."});
	}
	user.email = req.body.email;
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.setPassword(req.body.password)

	user.save(function (err){
		if(err){ 
			console.log(err);
			if(err.code === 11000){
				return res.status(500).json({message: 'Email is already in use.'});
			}
			return res.status(500).json({message: "Oops! Something went wrong. Please try again."});
		}
		return res.json({token: user.generateJWT()})
	});
});

router.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }

		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});
module.exports = router;
