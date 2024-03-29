teenyjs.define( 'storyCardStore', ['constants'], function ( constants ) {

	//*** Private ***
	
	/**
	 * Helper function to sort cards
	 * @return {[type]} [description]
	 */
	function sortCards() {

		//Sort the list by sortNumber
		cardStore.cards = _.sortBy( cardStore.cards, function ( card ) {

			return card.timestamp;

		});

	};

	/**
	 * Adds the card, if it already exists it removes the other
	 * @param {[type]} card [description]
	 */
	function addCard( card ) {

		var index = -1;

		//See if there is an existing card with matching id
		for ( var i = 0; i < cardStore.cards.length; ++i ) {

			if ( card.key === cardStore.cards[i].key ) {

				index = i;
				break;

			}

		}

		if ( index !== -1 ) {

			cardStore.cards.splice( index, 1 );

		}

		cardStore.cards.push( card );

	};

	//*** Public ***

	//Create the store
	var cardStore = DeLorean.Flux.createStore({

		actions: {

			'addCardToList': 'addCardToListMethod',
			'cardSaved': 'cardSavedMethod',
			'moved': 'movedMethod',
			'removeCards': 'removeCardsMethod'

		},
		cards: [],
		addCardToListMethod: function( card ) {

			//A the new one
			addCard( card );

			//Tidy it up
			sortCards();

			//Let em know
			this.emit( 'change', constants.CARD_LIST );

		},
		cardSavedMethod: function () {

			this.emit( 'change', constants.CARD_SAVED );

		},
		movedMethod: function () {

			this.emit( 'change', constants.MOVED );

		},
		removeCardsMethod: function () {

			this.cards = [];
			this.emit( 'change', constants.CARD_LIST );

		}

	});

	return cardStore;

});