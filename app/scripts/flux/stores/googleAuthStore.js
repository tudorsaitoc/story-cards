define( [], function () {

	//Create the store
	return DeLorean.Flux.createStore({

		actions: {

			'signIn': 'signInMethod',
			'signOut': 'signOutMethod'

		},
		signInMethod: function () {

			this.emit( 'change', MODULES.constants.SIGN_IN );

		},
		signOutMethod: function () {

			this.emit( 'change', MODULES.constants.SIGN_OUT );

		}

	});

});