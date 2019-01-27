var myParticleAccessToken = "87ebbe7294883ac85c9659ca08cdb00735b91c51"
var myDeviceId =			"210036001947343438323536"
var topic =					"omnaria/roller-v1"

var newCloudEvent = function( state ) {

	var obj = state.data;
	obj = JSON.parse( obj );
	
	cloud.updateCloudVariables( obj );
	cloud.stateChange( );

}

var cloud = {

	dispensing: false,

	particle: null,
	listener: null,
	
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
	
	"updateCloudVariables": function( state ) {
	
		cloud.dispensing = state.dispensing;
	
	},

	"setListener": function( listener ) {

		cloud.listener = listener;

	},

	"stateChange": function( ) {

		var state = {
			
			dispensing: cloud.dispensing

		};

		cloud.listener( state );

	},

	"setup": function( ) {

		particle = new Particle();

		function onSuccess( stream ) {

			stream.on( 'event', newCloudEvent );

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

		particle.getEventStream( { name: topic, auth: myParticleAccessToken } ).then( onSuccess, onFailure );

	}

}
