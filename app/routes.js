// app.routes.js

var User = require('../app/models/user.js');

module.exports = function(app, passport) {

	// Render the home page, index.ejs
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// Render the login page, login.ejs
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// Process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true // allow flash messages
	}));

	// Render the signup page, signup.ejs
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	// Process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		//console.log('Render profile now');
		console.log(req.user);
		res.render('profile.ejs', {
			user: req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure user is logged in
var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/');
}