// app.routes.js
module.exports = function(app, passport) {

	// Render the home page, index.html
	app.get('/', function(req, res) {
		res.render('index.html');
	});

	// Render the login page, login.html
	app.get('/login', function(req, res) {
		res.render('login.html', { message: req.flash('loginMessage') });
	});

	// Process the login form
	//app.post('/login', passport stuff)

	// Render the signup page, signup.html
	app.get('/signup', function(req, res) {
		res.render('signup.html', { message: req.flash('signupMessage' )});
	});

	// Process the signup form
	//app.post('/signup', passport stuff);

	app.get('/profile', isLoggedIn, function(res, req) {
		res.render('profile.html', {
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