define( [], function () {

	//Create the store
	return DeLorean.Flux.createStore({

		actions: {

			'signIn': 'signInMethod',
			'signOut': 'signOutMethod',

		},
		signInMethod: function ( key ) {

			this.emit( 'change', MODULES.constants.SIGN_IN, key );

		},
		signOutMethod: function () {

			this.emit( 'change', MODULES.constants.SIGN_OUT );

		}

	});

});