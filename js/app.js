'use strict';

//---------- APP MODEL ----------//
 const memoryModel = {
  //  A list that holds all cards
   cards: [
     {
       name: 'diamond',
       icon: 'fa fa-diamond',
       class: 'card'
     },
     {
       name: 'diamond',
       class: 'card',
       icon: 'fa fa-diamond'
     },
     {
       name: 'plane',
       class: 'card',
       icon: 'fa fa-paper-plane-o'
     },
     {
       name: 'plane',
       class: 'card',
       icon: 'fa fa-paper-plane-o'
     }
   ],
   openCards: [],
   state: ['open', 'show', 'match'],
   counter: 0
 };

 //---------- APP CONTROLLER ----------//
 const memoryController = {
   init() {memoryView.init();},
   getAllCards() {return memoryModel.cards;},
   getOpenCards() {return memoryModel.openCards;},
   openCard() {return memoryModel.state[0];},
   showCard() {return memoryModel.state[1];},
   closeCard(el) {
     const open = this.openCard();
     const show = this.showCard();
     el.classList.remove(open, show);
   },
   matchedCard() {return memoryModel.state[2];},
   checkIfMatch(icon) {
     const cards = this.getOpenCards();
     const state = this.matchedCard();
     if (cards[0].classList.contains[icon] && cards[1].classList.contains[icon]) {
       return state;
     } else {
       console.log('fire');
     }
   }
 };


 //---------- APP VIEW ----------//
 const memoryView = {
   init() {
     // DOM pointers
     this.deck = document.getElementsByClassName('deck')[0];
     this.render();

   },

   render() {
     // Card lists
     const cards = memoryController.getAllCards();
     const openCards = memoryController.getOpenCards();

     // Card states
     const open = memoryController.openCard();
     const show = memoryController.showCard();
     const match = memoryController.matchedCard();

     for (let card of cards) {

       // Creates li and i elements
       let liElem = document.createElement('li');
       let iElem = document.createElement('i');

       // Assigns different values (classes, names...)
       liElem.classList.add(card.class, card.name);
       iElem.className = card.icon;

       // Append elements
       liElem.appendChild(iElem);
       this.deck.appendChild(liElem);

       // Sets up the event listener for a card
       liElem.addEventListener('click', function () {
         liElem.classList.add(open, show);
         openCards.push(liElem);


         if (openCards.length === 2) {
           if (openCards[0].classList.contains(card.name) && openCards[1].classList.contains(card.name) ) {
             openCards[0].classList.add(match);
             openCards[1].classList.add(match);
             setTimeout(function() {})
             openCards.length = 0;
           } else {
             setTimeout(function() {
               openCards[0].classList.remove(open, show);
               openCards[1].classList.remove(open, show);
               openCards.length = 0;
             },1000)
           }
         }


        // Adds the card to a *list* of "open" cards


       });




     }

   }
 };



 //---------- INVOKATIONS ----------//
memoryController.init();






/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
