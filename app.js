/*
app.js - this is the central file of the app. It glues everything together.
*/

// Add modules to the app
var flash = require('connect-flash'),
	express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session');

// Instantiate the app
var app = express();

// Connect to database
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// Include passport
require('./config/passport.js')(passport);

// Set up ejs
app.set('view engine', 'ejs');

// Include all files not just in root
app.set('views', __dirname + '/app/views');
app.use('/assets', express.static(__dirname + '/app/views/assets'));
app.use('/includes', express.static(__dirname + '/app/views/includes'));

// Set app to use modules when needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'nevilandjonmakeanapp'}));
app.use(passport.initialize());
app.use(passport.session());


// Link router to app
require('./app/routes.js')(app, passport); // pass in our app and our fully configured passport

// Console start message
app.listen(8080, function() {
	console.log('Listening for some crazy cool shit on port 8080...');
});