// Pages and subpages

var pageMain;
var pageLoading;

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

	if( !loaded ) {

		openPageMain( );
		loaded = true;

	}

}

var fullyUpdateLocalState = function( state ) {

	localState.dispensing = state.dispensing;

	updateSiteInformationFromLocalState( );

}

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

var updateLoading = function( ) {

	if( pageLoading.innerText.length < 10 ) {

		pageLoading.innerText += '.';

	} else {

		pageLoading.innerText = "Loading";

	}

}


// Page load

document.addEventListener( "DOMContentLoaded", function( e ) {

	pageMain = document.getElementById( "main" );
	pageLoading = document.getElementById( "loading" );

	// Open initial loading page
	loaded = false;
	openPageLoading( );
	//openPageLogin( );

	// Set up listener
	cloud.setListener( stateCallback );
	cloud.setup( );

});
