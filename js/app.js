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
    state: ['open', 'match', 'mismatch'],
    counter: 0,
    moves: 0,
    clicks: 0,
    music: ['audio/science.mp3', 'audio/northern_pastures.mp3'],
    soundEffects: ['audio/card_flip.mp3', 'audio/match.mp3'],
    stars: 3,
    player: undefined
};


//---------- APP CONTROLLER ----------//
const memoryController = {

    init() {
        memoryView.init();
        memoryLeaderboardView.init();
        memoryPlayerscreenView.init();
    },

    getAllCards() {
        return memoryModel.cards;
    },

    getOpenCards() {
        return memoryModel.openCards;
    },

    getMusic() {
        return memoryModel.music;
    },

    getSoundEffects() {
        return memoryModel.soundEffects;
    },

    playSoundEffect(sound) {
        let effect = new Audio(sound);
        effect.play();
    },

    getStars() {
        return memoryModel.stars;
    },

    getPlayer() {
        return memoryModel.player;
    },

    setPlayer(name) {
        return memoryModel.player = name;
    },

    showNumOfMoves() {
        let moves = memoryModel.moves;
        moves % 2 === 0 ? moves /= 2 : null;
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

    hideBodyOverflow() {
        document.body.style.overflow = 'hidden';
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

    leaderboard(moves, time, stars, player) {
        let newScore = {};
        let leaderboard;
        newScore.moves = moves;
        newScore.time = time;
        newScore.stars = stars;
        newScore.player = player;

        sessionStorage.leaderboard ? leaderboard = JSON.parse(sessionStorage.getItem('leaderboard')) : leaderboard = [];

        leaderboard.push(newScore);
        sessionStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        sessionStorage.getItem('leaderboard');
    },

    audioControl(el, vol, autoplay, src, loop) {
        el.volume = vol;
        el.autoplay = autoplay;
        el.src = src;
        el.loop = loop;
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
        this.leaderboardCounter = document.getElementById('leaderboardCounter');
        this.gameboardCounter = document.getElementById('gameboardCounter');
        this.musicPlayer = document.getElementById('backgroundMusic');

        const restartButton = document.getElementsByClassName('restart')[0];
        const scorePanelBtnReload = document.getElementById('btn-reloadGame');

        // Stars
        this.star2 = document.getElementById('star2');
        this.star3 = document.getElementById('star3');
        this.star2_copy = document.getElementById('star2-copy');
        this.star3_copy = document.getElementById('star3-copy');

        // Get songs
        this.song = memoryController.getMusic();

        // Instantiate stopwatch object
        this.watch = new Stopwatch(this.leaderboardCounter, this.gameboardCounter);

        // Get sound effects
        this.soundEffects = memoryController.getSoundEffects();

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

        // Start music
        this.musicPlayer = memoryController.audioControl(this.musicPlayer, 0.3, true, this.song[0], true);

        // Card states
        const open = memoryController.openCard();
        const match = memoryController.matchedCard();
        const mismatch = memoryController.mismatchedCard();

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

                // Get a number of stars
                let stars = memoryController.getStars();

                // Get a number of moves
                let numOfMoves = memoryController.showNumOfMoves();

                // Increment clicks
                let numOfClicks = memoryController.incrementClicks();

                // Prevents multiple pushes of the same card
                if (liElem.classList.contains(open)) {
                    return false;

                } else {
                    memoryController.incrementMoves();

                    // Play card flip sound
                    memoryController.playSoundEffect(memoryView.soundEffects[0]);

                    if (numOfClicks === 1) {
                        // Start timer
                        memoryView.watch.start();
                    }

                    // Removes stars depending on the number of moves
                    if (numOfMoves > 24 && numOfMoves < 36) {
                        memoryView.star3.style.color = 'rgba(255, 255, 255, 0.24)';
                        memoryView.star3_copy.style.color = 'rgba(255, 255, 255, 0.24)';
                        stars = 2;

                    } else if (numOfMoves > 36) {
                        memoryView.star2.style.color = 'rgba(255, 255, 255, 0.24)';
                        memoryView.star2_copy.style.color = 'rgba(255, 255, 255, 0.24)';
                        stars = 1;
                    }

                    liElem.classList.add(open);

                    // Adds the card to a *list* of "open" cards
                    openCards.push(liElem);

                    // If the list already has another card, check to see if the two cards match
                    if (openCards.length === 2) {

                        let card1 = openCards[0];
                        let card2 = openCards[1];

                        if (card1.classList.contains(card.name) && card2.classList.contains(card.name)) {
                            // Play the match sound effect
                            memoryController.playSoundEffect(memoryView.soundEffects[1]);

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
                            }, 900);
                        }
                    }

                    // Game ends
                    if (memoryModel.counter === 16) {
                        // End timer
                        memoryView.watch.stop();

                        memoryController.leaderboard(memoryController.showNumOfMoves(), memoryView.leaderboardCounter.innerHTML, stars, memoryController.getPlayer());
                        setTimeout(function() {
                            // Victory music
                            memoryView.musicPlayer = memoryController.audioControl(memoryView.musicPlayer, 0.3, true, memoryView.song[1], false);
                            // If all cards have matched, display a message with the final score
                            memoryView.congratulationsPopup.style.display = 'block';
                            memoryController.hideBodyOverflow();
                        }, 600);
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
        this.leaderboard_btnClose.addEventListener('click', function() {
            memoryLeaderboardView.leaderboardContainer.style.display = 'none';
        });

        // Open leaderboard
        this.leaderboard_btnOpen.addEventListener('click', function() {
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
                let liElem3 = document.createElement('li');
                let liElem4 = document.createElement('li');

                h4Elem.className = 'upperCase';

                h4Elem.textContent = `Game ${games += 1}`;
                liElem1.textContent = `Moves: ${obj[r].moves}`;
                liElem2.textContent = `Time: ${obj[r].time}`;
                liElem3.textContent = `Stars: ${obj[r].stars}`;
                liElem4.textContent = `Player name: ${obj[r].player}`;

                memoryController.setPlayer(obj[r].player);

                this.leaderboard.appendChild(h4Elem);
                this.leaderboard.appendChild(liElem4);
                this.leaderboard.appendChild(liElem1);
                this.leaderboard.appendChild(liElem2);
                this.leaderboard.appendChild(liElem3);
            }
        }
    }
};


//---------- APP PLAYER SCREEN VIEW ----------//
const memoryPlayerscreenView = {
    init() {
        // DOM pointers
        this.formElem = document.getElementById('playerScreen');
        this.playerName = document.getElementsByClassName('player-name')[0];
        this.btnCancel = document.getElementsByClassName('player-screen-btn-cancel')[0];
        this.subTitle = document.getElementsByClassName('player-screen-subTitle')[0];
        this.welcomeText = document.getElementsByClassName('player-screen-text')[0];
        this.switchPlayerText = document.getElementsByClassName('player-screen-text-switchPlayer')[0];

        // Set the player's name
        const createPlayer = (name) => name;

        // Open player screen
        this.playerName.addEventListener('click', () => memoryPlayerscreenView.formElem.style.display = 'block');

        // Close player screen
        this.btnCancel.addEventListener('click', () => memoryPlayerscreenView.formElem.style.display = 'none');


        this.formElem.addEventListener('submit', (e) => {
            e.preventDefault();
            let playerName = document.getElementById('playerName').value;
            playerName = createPlayer(playerName);
            memoryController.setPlayer(playerName);
            this.formElem.style.display = 'none';
            memoryPlayerscreenView.render();
        });

        this.render();
    },

    render() {
        this.playerName.textContent = memoryController.getPlayer();

        if (sessionStorage.length > 0) {
            this.formElem.style.display = 'none';
            this.subTitle.style.display = 'none';
            this.welcomeText.style.display = 'none';
        } else {
            this.btnCancel.style.display = 'none';
            this.switchPlayerText.style.display = 'none';
        }
    }
};


//---------- INVOKATIONS ----------//
memoryController.init();
