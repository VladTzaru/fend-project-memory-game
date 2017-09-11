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
        },
        {
            name: 'anchor',
            class: 'card',
            icon: 'fa fa-anchor'
        },
        {
            name: 'anchor',
            class: 'card',
            icon: 'fa fa-anchor'
        },
        {
            name: 'bolt',
            class: 'card',
            icon: 'fa fa-bolt'
        },
        {
            name: 'bolt',
            class: 'card',
            icon: 'fa fa-bolt'
        },
        {
            name: 'cube',
            class: 'card',
            icon: 'fa fa-cube'
        },
        {
            name: 'cube',
            class: 'card',
            icon: 'fa fa-cube'
        },
        {
            name: 'leaf',
            class: 'card',
            icon: 'fa fa-leaf'
        },
        {
            name: 'leaf',
            class: 'card',
            icon: 'fa fa-leaf'
        },
        {
            name: 'bicycle',
            class: 'card',
            icon: 'fa fa-bicycle'
        },
        {
            name: 'bicycle',
            class: 'card',
            icon: 'fa fa-bicycle'
        },
        {
            name: 'bomb',
            class: 'card',
            icon: 'fa fa-bomb'
        },
        {
            name: 'bomb',
            class: 'card',
            icon: 'fa fa-bomb'
        }
    ],
    openCards: [],
    state: ['open', 'show', 'match'],
    counter: 0,
    moves: 0
};

//---------- APP CONTROLLER ----------//
const memoryController = {

    init() {
        memoryView.init();
    },

    getAllCards() {
        return memoryModel.cards;
    },

    getOpenCards() {
        return memoryModel.openCards;
    },

    showNumOfMoves() {
        return memoryModel.moves;
    },

    clearList(arr) {
        arr.length = 0;
        return arr;
    },

    openCard() {
        return memoryModel.state[0];
    },

    showCard() {
        return memoryModel.state[1];
    },

    matchedCard() {
        return memoryModel.state[2];
    },

    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    incrementCount() {
      return memoryModel.counter += 2;
    },

    incrementMoves() {
      return memoryModel.moves += 1;
    },

    reloadGame() {
      location.reload();
    },

    timer: (function () {
      let totalSeconds = 0;
      return function () {
        ++totalSeconds;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);

        document.getElementById("timer").innerHTML = minute + ":" + seconds;
      }
    })(),

};

//---------- APP VIEW ----------//
const memoryView = {

    init() {
        // DOM pointers
        this.deck = document.getElementsByClassName('deck')[0];
        this.overlay = document.getElementById('bodyOverlay');
        this.movesCount = document.getElementsByClassName('moves')[0];
        this.scorePanel = document.getElementsByClassName('score-panel')[0];
        this.congratulationsPopup = document.getElementById('congratulations-popup');
        const restartButton = document.getElementsByClassName('restart')[0];
        const scorePanelBtnReload = document.getElementById('btn-reloadGame');

        // stars
        this.star2 = document.getElementById('star2');
        this.star3 = document.getElementById('star3');

        restartButton.addEventListener('click', () => memoryController.reloadGame());
        scorePanelBtnReload.addEventListener('click', () => memoryController.reloadGame());

        this.render();
    },

    render() {
        // Card lists
        const cards = memoryController.getAllCards();
        const openCards = memoryController.getOpenCards();

        // Shuffle cards
        memoryController.shuffle(cards);

        // Card states
        const open = memoryController.openCard();
        const show = memoryController.showCard();
        const match = memoryController.matchedCard();

        // Start timer
        const timer = setInterval(memoryController.timer, 1000);

        for (let card of cards) {

            // Creates li and i elements
            let liElem = document.createElement('li');
            let iElem = document.createElement('i');

            // Assigns different values (classes, names...)
            liElem.classList.add(card.class, card.name, show);
            iElem.className = card.icon;

            // Append elements
            liElem.appendChild(iElem);
            this.deck.appendChild(liElem);

            // Sets up the event listener for a card
            liElem.addEventListener('click', function() {

              // Get a number of moves
              let numOfMoves = memoryController.showNumOfMoves();

                // Prevents multiple pushes of the same card
                if (liElem.classList.contains(open, show)) {
                    return false;

                } else {

                    // Increment moves
                    memoryController.incrementMoves();
                    memoryView.movesCount.textContent = memoryController.showNumOfMoves();

                    // Removes stars depending on the number of moves
                    if (numOfMoves === 26) {
                      memoryView.star3.className = 'hide-star';

                    } else if (numOfMoves === 40) {
                      memoryView.star2.className = 'hide-star';
                    }

                    liElem.classList.add(open, show);

                    // Adds the card to a *list* of "open" cards
                    openCards.push(liElem);

                    // If the list already has another card, check to see if the two cards match
                    if (openCards.length === 2) {

                        let card1 = openCards[0];
                        let card2 = openCards[1];

                        if ( card1.classList.contains(card.name) && card2.classList.contains(card.name) ) {
                            memoryController.incrementCount();
                            card1.classList.add(match);
                            card2.classList.add(match);
                            memoryController.clearList(openCards);

                        } else {
                          // Added overlay in case the user tries to click on multiple cards too fast
                          memoryView.overlay.classList.add('overlay');

                          // setTimeout allows the user to see the 2nd card before flipping
                            setTimeout(function() {
                                card1.classList.remove(open, show);
                                card2.classList.remove(open, show);
                                memoryController.clearList(openCards);
                                memoryView.overlay.classList.remove('overlay');
                            }, 400);
                        }
                    }

                    // Game ends
                    if (memoryModel.counter === 16) {
                      clearInterval(timer);
                      setTimeout(function() {
                        memoryView.congratulationsPopup.style.display = 'block';
                      }, 200);
                    }
                }
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
