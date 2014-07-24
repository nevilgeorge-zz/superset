/*
app.js - this is the central file of the app. It glues everything together.
*/

// Let's start with adding all the modules to our app
var flash = require('connect-flash'),
	express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session');

// Finally, let's instantiate our app
var app = express();

var configDB = require('./config/database.js');
// connect to database
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

// set up ejs for templating
app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));

// Set up the app to use modules when needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'nevilandjonmakeanapp'}));
app.use
app.use(passport.initialize());
app.use(passport.session());


// Let's link our routes.js file to the main app.js file
require('./app/routes.js')(app, passport); // pass in our app and our fully configured passport

app.listen(8080, function() {
	console.log('Listening on port 8080...');
});