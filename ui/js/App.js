// Pages and subpages

var pageMain;
var pageLoading;

// Inputs and text

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

	fullyUpdateLocalState( state );
	updateSiteInformationFromLocalState( );

	if( !loaded ) {

		openPageMain( );
		loaded = true;

	}

}

// Updates localState variables
var fullyUpdateLocalState = function( state ) {

	localState.dispensing = state.dispensing;

}

// Changes webpage content to match the variables in localState
var updateSiteInformationFromLocalState = function( ) {

	

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
	textLoading = document.getElementById( "textLoading" );

	// Open initial loading page
	loaded = false;
	openPageLoading( );

	// Set listener and attempt to connect to the particle
	cloud.setListener( stateCallback );
	cloud.setup( );

});
