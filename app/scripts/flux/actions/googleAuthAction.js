define( [ 'flux/firebase/firebaseRef', 'flux/dispatchers/storyCardDispatcher' ], 
	function ( firebaseRef,  storyCardDispatcher ) {

	//Listens for us to be signed in
	firebaseRef.onAuth( function ( data ) {

		//Signing in
		if ( data !== null ) {

			storyCardDispatcher.signIn();

		} else {

			//Signing out
			storyCardDispatcher.signOut();

		}

	});

	//We will return this to get a new instance each time
	var googleAuthAction = function () {

		//New instance
		var instance = {};

		instance.signIn = function () {

			firebaseRef.authWithOAuthPopup( 'google', function( error ) {

				if ( error && error.code === "TRANSPORT_UNAVAILABLE") {

					firebaseRef.authWithOAuthRedirect("google", function( error ) {

						if ( error ) {

							//Handle Error

						}

					});

				} else if ( error ) {

					//Handle Error

				}

			});

		}

		instance.signOut = function () {

			firebaseRef.unauth();

		}

		return instance;

	};

	return googleAuthAction;

});