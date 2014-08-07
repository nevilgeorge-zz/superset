$(document).ready(function() {

	/*
	 * Globals
	 */



	/*
	 * Run on every page load (not event-driven)
	 */



	/* 
	 * Functions
	 */
	function signupCheck() {
		var email = $('#email').val(),
			emailExp = /^(\w+([-_.]?\w+)*@\w+([-_.]?\w+)*(.\w{2,3})+)$/;
			password = $('#password').val(),
			passwordConfirm = $('#password-confirm').val();

		// check if a valid email is entered
		if (!emailExp.test(email)) {
			$('#email-error').show();
			$('#email-error').val('Invalid email entered.');
		} else {
			$('#email-error').val('');
			$('#email-error').hide();
		}

		// check if the password meets the minimum size
		if (password.length < 8) {
			$('#password-error').show();
			$('#password-error').val('Password must be at least 8 characters long.');
		} else {
			// hide error div if no error
			$('#password-error').val('');
			$('#password-error').hide();
		}
		if (password !== passwordConfirm) {
			// show div when passwords entered do not match
			$('#password-confirm-error').show();
			$('#password-confirm-error').val('Passwords do not match.');
		} else {
			// leave the div when passwords match, but change the color to green for success
			$('#password-confirm-error').val('Password match.');
			$('#password-confirm-error').css('background-color', 'green');
		}
	}


	/* 
	 * Events
	 */
	$('#Sign-Up #submit').click(function() {
		console.log('Sign up form submit button clicked');
		signupCheck();
	});

});