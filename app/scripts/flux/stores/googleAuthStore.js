teenyjs.define( 'googleAuthStore', ['constants'], function ( constants ) {

	//Create the store
	return DeLorean.Flux.createStore({

		actions: {

			'signIn': 'signInMethod',
			'signOut': 'signOutMethod',

		},
		signInMethod: function ( key ) {

			this.emit( 'change', constants.SIGN_IN, key );

		},
		signOutMethod: function () {

			this.emit( 'change', constants.SIGN_OUT );

		}

	});

});