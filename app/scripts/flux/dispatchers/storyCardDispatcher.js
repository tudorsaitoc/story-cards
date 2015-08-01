teenyjs.define( 'storyCardDispatcher', [ 'storyCardStore', 'googleAuthStore' ], function ( storyCardStore, googleAuthStore ) {

	return DeLorean.Flux.createDispatcher({

		signIn: function ( key ) {

			this.dispatch( 'signIn', key );

		},

		signOut: function () {

			this.dispatch( 'signOut' );

		},

		addCardToList: function ( card ) {

			this.dispatch( 'addCardToList', card );

		},

		cardSaved: function () {

			this.dispatch( 'cardSaved' );

		},

		getStores: function () {

		    return {

		      storyCardStore: storyCardStore,
		      googleAuthStore: googleAuthStore

		    }

		},

		moved: function () {

			this.dispatch( 'moved' );

		},

		removeCards: function () {

			this.dispatch( 'removeCards' );

		}

	});

});	