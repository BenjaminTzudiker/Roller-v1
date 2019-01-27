// Info used to communicate with particle
var myParticleAccessToken = "87ebbe7294883ac85c9659ca08cdb00735b91c51";
var myDeviceId = "210036001947343438323536";
var topic = "omnaria/roller-v1";

//var connectionRetries = -1; // Number of times the initial connection should be attempted; set to -1 for unlimited
//var retryDelay = 5000; // Time in ms between retry attempts

// Function called when photon publishes state
var newCloudEvent = function( state ) {
	
	// Attempt to make a json object from state info, this may fail silently if state is not in the correct format
	var obj = state.data;
	obj = JSON.parse( obj );
	
	// Updates the cloud variables and passes information to app JS
	cloud.updateCloudVariables( obj );
	cloud.stateChange( );

}

// Cloud object, stores a copy of the last received photon state and handles communication between the UI (App.js) and the photon
var cloud = {
	
	// Local state info
	dispensing: false,

	particle: null, // Particle variable, set in setup
	listener: null, // App JS listener function used to update app information, set in setListener
	
	// Sends a dispense request to the photon
	"dispense": function( ) {
		
		var functionData = {

			deviceId: myDeviceId,
			name: "dispense",
			argument: "",
			auth: myParticleAccessToken

		};
		
		function onSuccess(e) { console.log( "Sending dispense request..." ) }
		function onFailure(e) { console.dir( e ); }
		particle.callFunction( functionData ).then( onSuccess, onFailure );
		
	},
	
	// Updates variables in cloud object to match state
	"updateCloudVariables": function( state ) {
	
		cloud.dispensing = state.dispensing;
	
	},
	
	// Sets the UI listener for the stateChange function
	"setListener": function( listener ) {

		cloud.listener = listener;

	},
	
	// Calls the listener function and passes the current state stored in the cloud object
	"stateChange": function( ) {

		var state = {
			
			dispensing: cloud.dispensing

		};

		cloud.listener( state );

	},
	
	// Attempts to set up initial communication with the photon and subscribe to the event stream used in publishState
	"setup": function( ) {

		particle = new Particle();
		
		// If the getEventStream call below succeeds
		function onSuccess( stream ) {
			
			// Start the event stream, setting newCloudEvent as the function called when an event occurs
			stream.on( 'event', newCloudEvent );
			
			// Request initial state information
			var functionData = {

				deviceId: myDeviceId,
				name: "publishState",
				argument: "",
				auth: myParticleAccessToken

			};

			function onSuccess(e) { console.log( "Setup complete!" ) }
			function onFailure(e) { console.dir( e ); }
			particle.callFunction( functionData ).then( onSuccess, onFailure );

		}

		function onFailure( e ) { console.dir( e ); }
		
		// Try to get the event stream, then go to onSuccess above if successful
		particle.getEventStream( { name: topic, auth: myParticleAccessToken } ).then( onSuccess, onFailure );

	}

}
