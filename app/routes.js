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
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// Process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user
		});
	});

	// Route to get Facebook authentication
	/*
	The 'scope' is used to get extra information that isn't provided by default in the token
	that is returned from Facebook. The token is an OAuth token, since Facebook authorization
	uses OAuth 2.0.
	 */
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// Route after Facebook authorization/ OAuth token received
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook',
			{ 
				successRedirect: '/profile',
				failureRedirect: '/'
				failureFlash: 'Facebook login not authorized!'
		 }));

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
};