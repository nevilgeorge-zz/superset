// app.routes.js
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
	//app.post('/login', passport stuff)

	// Render the signup page, signup.ejs
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage' )});
	});

	// Process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile.ejs',
		failureRedirect: '/signup.ejs',
		failureFlash: true // allow flash messages
	}));

	app.get('/profile', isLoggedIn, function(res, req) {
		res.render('profile.ejs', {
			user: req.user
		});
	});

	app.get('/logout', function(res, req) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure user is logged in
var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/');
	}
}