/*
user.js - User model schema
*/

// Include necessary modules
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

// Define User schema
var userSchema = mongoose.Schema({
	authType: String,
	uuid: String,
	exerciseList: String,
	routineList: String,
	exerciseHash: String,
	routineHash: String,
	local: {
		email: String,
		password: String,
		name: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		firstName: String,
		lastName: String,
		name: String,
		birthday: String,
		profilePicture: String
	}
});


// Encrypts password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checks password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// Export User schema
module.exports = mongoose.model('User', userSchema);