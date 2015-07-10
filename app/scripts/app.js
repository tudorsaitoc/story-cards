/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

( function ( document ) {
  'use strict';

  var app = document.querySelector('#app'); //Attached to binding template
  app.actionPerformed = false;              //Reveals if the user has added a new card today
  app.cardContent = '';                     //Holds the content of the card which the user creates
  app.addCardClicked = false;               //Shows/Hides the card used for creating new cards
  app.signedIn = false;                     //By default the user is signed out

  require([ 'flux/actions/googleAuthAction', 'flux/stores/googleAuthStore', 'flux/actions/storyCardAction', 
    'flux/stores/storyCardStore', 'flux/firebase/firebaseRef'], 
    function ( GoogleAuthAction, googleAuthStore, StoryCardAction, storyCardStore, firebaseRef ) {

    var googleAuthAction = new GoogleAuthAction();  //Action for communicating signing in/out
    var storyCardAction = new StoryCardAction();    //Action for communicating changes to cards

    /**
     * Helper function for restoring defaults after card has been created
     * @return {[type]} [description]
     */
    function afterMoveRoutine () {

      document.querySelector('#moveToast').show();
      app.actionPerformed = true;
      app.addCardClicked = false;
      app.cardContent = '';
      googleAuthAction.signOut();

    };

    /**
     * Helper function to check if a user has already moved
     * @return {[type]} [description]
     */
    function alreadyMoved() {

      var auth = firebaseRef.getAuth();

      if ( auth !== null ) {

        //Get logged in user id
        var id = auth.uid;

        //Check the cards to see if they have created one
        var cardRef = _.find( app.cards, function ( card ) {

          return card.uid === id;

        });

        //If so, kick them out
        return ( cardRef !== undefined );

      }

      return false;

    };

    /**
     * Go to previous story
     * @return {[type]} [description]
     */
    app.previousStory = function () {

      app.currentDate = app.currentDate.setUTCDate( app.currentDate.getUTCDate() - 1 );

      //app.route = 'pastStory';
      page.redirect( '/pastStory/' + app.currentDate.toString() );

    };

    /**
     * Got to next story
     * @return {[type]} [description]
     */
    app.nextStory = function () {

      app.currentDate = app.currentDate.setUTCDate( app.currentDate.getUTCDate() + 1 );

      //app.route = 'pastStory';
      page.redirect( '/pastStory/' + app.currentDate.toString() );

    };
        
    /**
     * Called when the sign in button is clicked
     * @return {[type]} [description]
     */
    app.signInClicked = function ( e ) {

      if ( e.detail.signedIn === true ) {

        googleAuthAction.signIn();

      } else {

        googleAuthAction.signOut();

      }

    };

    /**
     * Adding a story card
     * @param {[type]} data [description]
     */
    app.addClicked = function ( data ) {

      //This is the first card in the list
      app.addCardClicked = true;

    };

    /**
     * Save button clicked
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    app.saveClicked = function ( e ) {

      storyCardAction.saveCard( e.detail.content );

    };

    /**
     * Listen for sign in/sign out changes
     * @param  {[type]} data )             
     * @return {[type]}      [description]
     */
    googleAuthStore.onChange( function ( data ) {

      switch ( data ) {

        case MODULES.constants.SIGN_IN:

          app.signedIn = true;

          //Check to see if the user has already moved today
          //Put it on the event queue to check, otherwise
          //the firebase sign in can win in a race conditino
          setTimeout( function () {

            if ( alreadyMoved() ) {

              storyCardAction.moved();

            } 

          });

          break;

        case MODULES.constants.SIGN_OUT:
          
          app.signedIn = false;
          break;  

      }

    });

    /**
     * Listen for changes to the story cards
     * @param  {[type]} data )             {      switch ( data ) {        case fluxConstants.SIGN_IN:          break;      }    } [description]
     * @return {[type]}      [description]
     */
    storyCardStore.onChange( function ( data ) {

      switch ( data ) {

        case MODULES.constants.CARD_LIST:
          
          app.cards = storyCardStore.cards;
          break; 

        case MODULES.constants.CARD_SAVED:

          afterMoveRoutine(); //A card has been saved, signout and restore defaults
          break;  

        case MODULES.constants.MOVED:

          afterMoveRoutine(); //A move has been detected, signout and restore defaults
          break;  

      }

    });


  });

})( document );
