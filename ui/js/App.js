// Pages and subpages

var pageMain;
var pageLoading;

// Inputs and text

var buttonRoll;
var textLoading;

// Other variables

var loadingHandle;

// Local states

var localState = {

	dispensing: false

};


// State functions

// Passed to and called by the model
var stateCallback = function( state ) {

	updateAppVariables( state );
	updateSiteInformationFromLocalState( );

	if( !loaded ) {

		openPageMain( );
		loaded = true;

	}

}

// Updates localState variables to match state
var updateAppVariables = function( state ) {

	localState.dispensing = state.dispensing;

}

// Changes webpage content to match the variables in localState
var updateSiteInformationFromLocalState = function( ) {

	buttonRoll.innerText = localState.dispensing ? "Dispensing..." : "Roll";

}


// Open page functions

var openPageMain = function( ) {

	pageMain.style.display = "block";
	pageLoading.style.display = "none";

	pageMain.style.visibility = "visible";

}

var openPageLoading = function( ) {

	pageMain.style.display = "none";
	pageLoading.style.display = "block";

	pageLoading.style.visibility = "visible";

	loadingHandle = setInterval( updateLoading, 333 );

}

// Misc functions

// Function called when the roll button is pressed
var clickButtonRoll = function( ) {
	
	if( !localState.dispensing ) {
	
		cloud.dispense( );
	
	}
	
}

// Does a single update of the loading screen
var updateLoading = function( ) {

	if( textLoading.innerText.length < 10 ) {

		textLoading.innerText += '.';

	} else {

		textLoading.innerText = "Loading";

	}

}


// Page load

document.addEventListener( "DOMContentLoaded", function( e ) {
	
	// Get pages
	pageMain = document.getElementById( "pageMain" );
	pageLoading = document.getElementById( "pageLoading" );
	
	// Get inputs and text
	buttonRoll = document.getElementById( "buttonRoll" );
	textLoading = document.getElementById( "textLoading" );
	
	// Set up event listeners
	buttonRoll.addEventListener( "click", clickButtonRoll );

	// Open initial loading page
	loaded = false;
	openPageLoading( );

	// Set listener and attempt to connect to the particle
	cloud.setListener( stateCallback );
	cloud.setup( );

});
