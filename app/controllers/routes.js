/*
app.routes.js - Handles app routing
*/

// Include User schema
var User = require('../models/user.js');


module.exports = function(app, passport) {

	/*
	 * Page Rendering
	 */
	// Home page
	app.get('/', function(req, res) {
		// Default main layout
		res.render('index.handlebars', {
			message: req.flash('loginMessage')
		});
	});
	// Signup page
	app.get('/signup', function(req, res) {
		// Default main layout
		res.render('signup.handlebars', {
			message: req.flash('signupMessage')
		});
	});
	// Profile page
	app.get('/profile', isLoggedIn, function(req, res) {

		// Pass either local or facebook name
		var userName;
		if(req.user.authType == 'local') userName = req.user.local.name;
		else userName = req.user.facebook.name

		// Default main layout
		res.render('profile.handlebars', {
			user:   req.user,
			name:   userName,
			age:    20,
			weight: 150
		});
	});


	/*
	 * Form Processing
	 */
	// Process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/',
		failureFlash: true // allow flash messages
	}));
	// Process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	// Doesn't do anything yet
	app.param('email', function(req, res, next, email) {
		User.findOne({'local.email': email}, function(err, user){
			if (err) {
				next(err);
			} else if (user) {
				req.user = user;
				next();
			} else {
				next(new Error('failed to load user'));
			}
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
		 }));

	// Facilitate log out functionality
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};

// Route middleware, makes sure user is logged in
var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/');
};