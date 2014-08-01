// app.routes.js
var User = require('../app/models/user.js');

module.exports = function(app, passport) {

	// Render the home and login page, index.ejs
	app.get('/', function(req, res) {
		res.render('index.ejs', { message: req.flash('loginMessage')});
	});

	// Process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/',
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

	app.get('/profile/:email', isLoggedIn, function(req, res) {
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