define( [ 'flux/constants/fluxConstants' ], function ( fluxConstants ) {

	//Create the store
	return DeLorean.Flux.createStore({

		actions: {

			'signIn': 'signInMethod',
			'signOut': 'signOutMethod'

		},
		signInMethod: function () {

			this.emit( 'change', fluxConstants.SIGN_IN );

		},
		signOutMethod: function () {

			this.emit( 'change', fluxConstants.SIGN_OUT );

		}

	});

});