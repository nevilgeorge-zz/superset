// app/models/user.js - User model schema
// require modules we need in this file
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	authType: String,
	local: {
		email: String,
		password: String,
		name: String,
		authType: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
		displayPictureURL: String,
		authType: String
	}
});

// methods:
// hashing the password before storing it in the database
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);