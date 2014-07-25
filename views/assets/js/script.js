$(document).ready(function() {

	/*
	 * Run on every page load (not event-driven)
	 */

	removeBackButton();



	/* 
	 * Functions
	 */
	 
	/* Checks if page is (page) */
	function isPage(page) {
		if($('.content').attr('id') == page) {
			return true;
		}
		return false;
	}
	/* Removes back button on pages where it's not needed */
	function removeBackButton() {
		if(!isPage('Log-In')) {
			$('header > nav .back').show();
		}
	}
	/* Moves mobile nav menu */
	function moveMobileNav() {
		var $menu = $('header > nav > nav');

		if($menu.is(':visible')) $menu.slideUp();
		else $menu.slideDown(); 
	}



	/* 
	 * Events
	 */

	/* Mobile nav menu cilcked */
	$('header > nav i').click(function() {
		moveMobileNav();
	});

});