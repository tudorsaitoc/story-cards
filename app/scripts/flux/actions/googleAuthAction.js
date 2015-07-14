define( [ 'flux/firebase/firebaseRef', 'flux/dispatchers/storyCardDispatcher' ], 
	function ( firebaseRef,  storyCardDispatcher ) {

	//Listens for us to be signed in
	firebaseRef.onAuth( function ( data ) {

		//Signing in
		if ( data === null ) {

			//Signing out
			storyCardDispatcher.signOut();

		}

	});

	/**
	 * The user has succesfully logged in, get the user key, if it doesn't exist make it
	 * @return {[type]} [description]
	 */
	function getUserKey ( lastTry ) {

		firebaseRef.child( 'users' ).child( firebaseRef.getAuth().uid ).once( 'value', function ( snapshot ) {


			if ( snapshot.val() === null ) {

				var ref = firebaseRef.child( 'users' ).child( firebaseRef.getAuth().uid ).push();

				ref.set( { key: ref.key() });

				//Get the key you just inserted
				if ( lastTry === undefined ) {

					getUserKey( true );

				}

			} else {

				snapshot.forEach( function ( child ) {

					storyCardDispatcher.signIn( child.key() );;

				});

			}

		});

	};

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

						} else {

							//Get the user key, make it if it doesn't exist
							getUserKey();

						}

					});

				} else if ( error ) {

					//Handle Error

				} else {

					firebaseRef.child( 'users' ).child( firebaseRef.getAuth().uid ).once( 'value', function ( snapshot ) {

						//Get the user key, make it if it doesnt exist
						getUserKey();

					});

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