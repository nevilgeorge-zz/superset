/*
passport.js - 
*/

// Inclusions
var LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	flash = require('connect-flash'),
	User = require('../app/models/user.js'),
	configAuth = require('./auth.js'),
	fb = require('fb'),
	redis = require('redis'),
	mysql = require('mysql'),
	uuid = require('node-uuid'),
	async = require('async'),

	// connecting to databases
	redisClient = redis.createClient(),
	SQLconnection = mysql.createConnection({
		host: 'localhost',
		user: 'nevil',
		password: 'xxxxxx'
	});

module.exports = function(passport) {
	// passport sessions set up. Required for login sessions.
	// Serialize (convert to text/binary form) when logged in, deserialize when logged out.

	var createExerciseList = function(user, uuid) {
			user.exerciseList = uuid + '-exercise-list';
			//return uuid + '-exercise-list';
		},

		createRoutineList = function(user, uuid) {
			user.routineList = uuid + '-routine-list';
		},

		createExerciseHash = function(user, uuid) {
			user.exerciseHash = uuid + '-exercise-hash';
		},

		createRoutineHash = function(user, uuid) {
			user.routineHash = uuid + '-routine-hash';
		};

	// Serialize user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
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
			User.findOne({ 'local.email': email }, function(err, user) {
				// check for errors first
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, false, req.flash('signupMessage', 'Email already exists!'));
				} else {
					// create the user
					var newUser = new User();
					newUser.authType = 'local';
					newUser.uuid = uuid.v1();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					// Since we are using body-parser with JSON, POSTed variables can be accessed from req.body
					newUser.local.name = req.body.name;
					async.parallel([
						createExerciseList(newUser, newUser.uuid),
						createRoutineList(newUser, newUser.uuid),
						createExerciseHash(newUser, newUser.uuid),
						createRoutineHash(newUser, newUser.uuid)
						]);
					newUser.save(function(err) {
						if (err) {
							throw err;
						} else {
							return done(err, newUser);
						}
					});
				}
			});
		});	
	}
	));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	// callback with email and password from our form
	function(req, email, password, done) {
		User.findOne({ 'local.email': email }, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, req.flash('loginMessage', 'Incorrect username!'));
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
			}
			req.user = user;
			return done(null, user);
		});
	}
	));

	// Facebook login authorization
	// From Passport-facebook documentaiton
	passport.use(new FacebookStrategy({
		// call values stored in auth.js
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			// find user based on Facebook login credentials
			User.findOne({ 'facebook.id': profile.id }, function(err, user) {
				var profPic, birthday;
				// if error, throw error
				if (err) {
					return done(err);
				}

				// if the user exists, simply log them in
				if (user) {
					return done(null, user);
				} else {
					// if they aren't logged in, let's create a facebook account for them
					var newUser = new User();
					// pass in the form of authentication for this user
					newUser.authType = 'facebook'
					newUser.uuid = uuid.v1();
					// set all the information required in the User model
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.email = profile.emails[0].value;
					newUser.facebook.firstName = profile.name.givenName;
					newUser.facebook.lastName = profile.name.familyName;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;

					// pull data from Facebook using the API
					fb.setAccessToken(token);

					fb.api('fql', { q: 'SELECT birthday, pic_big FROM user WHERE uid=' + profile.id }, function(response) {
						if (!response || response.error) {
							console.log(!response ? 'error occurred' : response.error);
							return;
						}
						newUser.facebook.profilePicture = response.data[0].pic_big;
						newUser.facebook.birthday = response.data[0].birthday;

						async.parallel([
							createExerciseList(newUser, newUser.uuid),
							createRoutineList(newUser, newUser.uuid),
							createExerciseHash(newUser, newUser.uuid),
							createRoutineHash(newUser, newUser.uuid)
							]);

						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					});
					
				}
			});
		});
	}
	));
}