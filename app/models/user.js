// app/models/user.js
// require modules we need in this file
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
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