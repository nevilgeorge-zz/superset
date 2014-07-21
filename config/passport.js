// config/passport.js

// load everything we need
var LocalStrategy = require('passport-local').Strategy,
	User = require('../app/models/user.js');

module.exports = function(passport) {
	// passport sessions set up. Required for login sessions.
	// Serialize (convert to text/binary form) when logged in, deserialize when logged out.

	// Serialize user
	passport.serializeUser(function(id, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, reply) {
			done(err, user);
		});
	});

	// Creating local signup strategy. 
	/*
	We are using named strategies since the local has one strategy
	for login and one for signup.
	*/

	passport.use('local-signup', new LocalStrategy ({
		// by default, local strategy uses username and password, but we override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass the entire request to a callback
	},
	function(req, email, password, done) {
		// asynchronous. User.findOne will not fire until data is sent back
		process.nextTick(function() {
			User.findOne({ 'local-email': email}, function(err, user) {
				// check for errors first
				if (err) {
					return done(err);
				}
				// then, check to see if an email is already being used
				if (user) {
					return done(null, false, req.flash('signUpMessage', 'Email already taken!'));
				} else {
					// create the user
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}
	));

}