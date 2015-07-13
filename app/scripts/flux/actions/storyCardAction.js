define( [ 'flux/firebase/firebaseRef', 'flux/dispatchers/storyCardDispatcher' ], function ( firebaseRef, storyCardDispatcher ) {

	var firebaseCards = firebaseRef.child( 'cards' );

	/**
	 * Used to update cards selected by date
	 * @param  {[type]} snapshot [description]
	 * @return {[type]}          [description]
	 */
	function cardsForDateCallback ( snapshot, prev ) {

		var card = snapshot.val();
		//card.cid = snapshot.key();

		storyCardDispatcher.addCardToList( card );

	};

	/**
	 * Action object
	 * @return {[type]} [description]
	 */
	var storyCardAction = function () {

		var instance = {};

		/**
		 * If you detect the player has moved communicate it
		 * @return {[type]} [description]
		 */
		instance.moved = function () {

			storyCardDispatcher.moved();
			
		};

		/**
		 * Updates or saves a new card to the db
		 * @param  {[type]} card [description]
		 * @return {[type]}      [description]
		 */
		instance.saveCard = function ( content ) {

			var auth = firebaseRef.getAuth();
			var firebaseAuthedCard = firebaseCards.child( auth.uid );

			firebaseCards.push({

				content: content.content,
				timestamp: Firebase.ServerValue.TIMESTAMP,
				author: firebaseRef.getAuth().google.displayName,
				key: content.key

			}, function ( error ) {

				if ( error !== null ) {

					//Handle the error

				}

				storyCardDispatcher.cardSaved();

			});

			auth = undefined;

		};

		/**
		 * Retrieves cards for the given date
		 * @param  {[type]} aDate [description]
		 * @return {[type]}       [description]
		 */
		instance.cardsForDate = function ( aDate ) {

			var startDate = aDate.setUTCHours( 0, 0, 0, 0 );

			var endDate = aDate.setUTCHours( 23, 59, 59, 999 );

			firebaseCards.orderByChild( 'timestamp' ).startAt( startDate ).endAt( endDate )
			.on( 'child_added', cardsForDateCallback );

		};

		/**
		 * Stop listening for cards added on the date
		 * @param  {[type]} aDate [description]
		 * @return {[type]}       [description]
		 */
		instance.cardsForDateOff = function ( aDate ) {

			var startDate = aDate.setUTCHours( 0, 0, 0, 0 );

			var endDate = aDate.setUTCHours( 23, 59, 59, 999 );

			firebaseCards.orderByChild( 'timestamp' ).startAt( startDate ).endAt( endDate )
			.off( 'child_added', cardsForDateCallback );

			storyCardDispatcher.removeCards();

		};

		return instance;

	};

	return storyCardAction;

});