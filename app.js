/*
app.js - Central file of the app, glues everything together
*/

// Add modules to the app
var flash        = require('connect-flash'),
	express      = require('express'),
	mongoose     = require('mongoose'),
	passport     = require('passport'),
	morgan       = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),
	session      = require('express-session'),
	exphbs       = require('express-handlebars');


// Instantiate the app
var app = express();


// Connect to database
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);


// Include passport
require('./config/passport.js')(passport);


// Use Handlebars as view engine
app.set('views',    __dirname + '/app/views');
app.use('/assets', express.static(__dirname + '/app/views/assets'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Set app to use modules when needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'nevilandjonmakeanapp'}));
app.use(passport.initialize());
app.use(passport.session());


// Include route controller
require('./app/controllers/routes.js')(app, passport);


// Console start message
app.listen(8080, function() {
	console.log('Listening for some crazy cool shit on port 8080...');
});