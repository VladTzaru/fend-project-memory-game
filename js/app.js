'use strict';

//---------- APP MODEL ----------//
const memoryModel = {
    //  A list that holds all cards
    cards: [{
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
    state: ['open', 'match', 'mismatch'],
    counter: 0,
    moves: 0,
    clicks: 0
};


//---------- APP CONTROLLER ----------//
const memoryController = {

    init() {
        memoryView.init();
        memoryLeaderboardView.init();
    },

    getAllCards() {
        return memoryModel.cards;
    },

    getOpenCards() {
        return memoryModel.openCards;
    },

    showNumOfMoves() {
      let moves = memoryModel.moves;
      moves % 2 === 0 ? moves /= 2 : undefined;
      return moves;
    },

    clearList(arr) {
        arr.length = 0;
        return arr;
    },

    openCard() {
        return memoryModel.state[0];
    },

    matchedCard() {
        return memoryModel.state[1];
    },

    mismatchedCard() {
        return memoryModel.state[2];
    },

    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

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

    incrementClicks() {
        return memoryModel.clicks += 1;
    },

    reloadGame() {
        location.reload();
    },

    startTime() {
      return new Date();
    },

    endTime(startT) {
      let endTime = new Date();
      let timeDiff = endTime - startT; //in ms
      // Strip the ms
      timeDiff /= 1000;

      // Get seconds and minutes
      let seconds = Math.round(timeDiff % 60);
      let minutes = Math.floor(timeDiff / 60);

      return (`${minutes} min ${seconds} sec`);
    },

    leaderboard (moves, time) {
      let newScore = {};
      let leaderboard;
      newScore.moves = moves;
      newScore.time = time;

      sessionStorage.leaderboard ? leaderboard = JSON.parse(sessionStorage.getItem('leaderboard')) : leaderboard = [];

      leaderboard.push( newScore );
      sessionStorage.setItem( 'leaderboard', JSON.stringify(leaderboard) );

      sessionStorage.getItem('leaderboard');
    }
};


//---------- APP VIEW ----------//
const memoryView = {

    init() {
        // DOM pointers
        this.deck = document.getElementsByClassName('deck')[0];
        this.overlay = document.getElementById('bodyOverlay');
        this.movesCount = document.getElementsByClassName('moves')[0];
        this.movesCountPopup = document.getElementById('movesPopup');
        this.scorePanel = document.getElementsByClassName('score-panel')[0];
        this.congratulationsPopup = document.getElementById('congratulations-popup');
        this.timer = document.getElementById('timer');

        const restartButton = document.getElementsByClassName('restart')[0];
        const scorePanelBtnReload = document.getElementById('btn-reloadGame');

        // Stars
        this.star2 = document.getElementById('star2');
        this.star3 = document.getElementById('star3');
        this.star2_copy = document.getElementById('star2-copy');
        this.star3_copy = document.getElementById('star3-copy');

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
        const match = memoryController.matchedCard();
        const mismatch = memoryController.mismatchedCard();

        // Set the starting point for the timer
        let startTime;

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
            liElem.addEventListener('click', function() {

                // Get a number of moves
                let numOfMoves = memoryController.showNumOfMoves();

                // Increment clicks
                let numOfClicks = memoryController.incrementClicks();

                // Prevents multiple pushes of the same card
                if (liElem.classList.contains(open)) {
                    return false;

                } else {
                    memoryController.incrementMoves();

                    if (numOfClicks === 1) {
                        // Start timer
                        startTime = memoryController.startTime();
                    }

                    // Removes stars depending on the number of moves
                    if (numOfMoves === 25) {
                        memoryView.star3.className = 'hide-star';
                        memoryView.star3_copy.className = 'hide-star';
                    }

                    else if (numOfMoves > 36) {
                        memoryView.star2.className = 'hide-star';
                        memoryView.star2_copy.className = 'hide-star';
                    }

                    liElem.classList.add(open);

                    // Adds the card to a *list* of "open" cards
                    openCards.push(liElem);

                    // If the list already has another card, check to see if the two cards match
                    if (openCards.length === 2) {

                        let card1 = openCards[0];
                        let card2 = openCards[1];

                        if (card1.classList.contains(card.name) && card2.classList.contains(card.name)) {
                            memoryController.incrementCount();
                            card1.classList.add(match);
                            card2.classList.add(match);
                            memoryController.clearList(openCards);

                            memoryView.movesCount.textContent = memoryController.showNumOfMoves();
                            memoryView.movesCountPopup.textContent = memoryController.showNumOfMoves();

                        } else {
                            // Added overlay in case the user tries to click on multiple cards too fast
                            memoryView.overlay.classList.add('overlay');
                            card1.classList.add(mismatch);
                            card2.classList.add(mismatch);

                            memoryView.movesCount.textContent = memoryController.showNumOfMoves();
                            memoryView.movesCountPopup.textContent = memoryController.showNumOfMoves();


                            // setTimeout allows the user to see the 2nd card before flipping
                            setTimeout(function() {
                                card1.classList.remove(open, mismatch);
                                card2.classList.remove(open, mismatch);
                                memoryController.clearList(openCards);
                                memoryView.overlay.classList.remove('overlay');
                            }, 800);
                        }
                    }

                    // Game ends
                    if (memoryModel.counter === 16) {
                        // End timer
                        memoryView.timer.textContent = memoryController.endTime(startTime);
                        memoryController.leaderboard(memoryController.showNumOfMoves(), memoryController.endTime(startTime));
                        setTimeout(function() {
                            // If all cards have matched, display a message with the final score
                            memoryView.congratulationsPopup.style.display = 'block';
                        }, 200);
                    }
                }
            });
        }
    }
};


//---------- APP LEADERBOARD VIEW ----------//
const memoryLeaderboardView = {
  init() {
    // DOM pointers
    this.leaderboard = document.getElementById('leaderboard');
    this.leaderboardContainer = document.getElementsByClassName('leaderboard-container')[0];
    this.leaderboard_btnClose = document.getElementsByClassName('leaderboard-btn-close')[0];
    this.leaderboard_btnOpen = document.getElementsByClassName('leaderboard-btn-open')[0];

    // Close leaderboard
    this.leaderboard_btnClose.addEventListener('click', function () {
      memoryLeaderboardView.leaderboardContainer.style.display = 'none';
    });

    // Open leaderboard
    this.leaderboard_btnOpen.addEventListener('click', function () {
      memoryLeaderboardView.leaderboardContainer.style.display = 'block';
    });

    this.render();

  },

  render() {

    let games = 0;

    // If sessionStorage is empty, hide the leaderboard
    if (sessionStorage.length > 0) {
      this.leaderboard_btnOpen.style.display = 'initial';
      this.leaderboardContainer.style.display = 'block';
    }

    // Iterate over the sessionStorage keys and append them
    for (let i = 0; i < sessionStorage.length; i++) {
      let obj = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));

      for (let r = 0; r < obj.length; r++) {

        let h4Elem = document.createElement('h4');
        let liElem1 = document.createElement('li');
        let liElem2 = document.createElement('li');

        h4Elem.textContent = `Game ${games += 1}`;
        liElem1.textContent = 'Moves: ' + obj[r].moves;
        liElem2.textContent = 'Time: ' + obj[r].time;

        this.leaderboard.appendChild(h4Elem);
        this.leaderboard.appendChild(liElem1);
        this.leaderboard.appendChild(liElem2);
      }
    }
  }
};


//---------- INVOKATIONS ----------//
memoryController.init();
