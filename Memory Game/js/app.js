/*
 * Create a list that holds all of your cards
 */
//variables of deck box
const deck = document.getElementById("card-deck");
let card = document.getElementsByClassName("card");
let cards = [...card];
console.log(cards);


// variables for star icons
const stars = document.querySelectorAll(".star");

//declare array for open cards
let openedCards = [];

//variables for moves
let countMoves = 0;
let moves = document.querySelector(".moves");
let movesNumber = document.querySelector("#moves-number");

//variable of matched cards
let matchedCard = document.getElementsByClassName("match");
let matchedCards = 0;

//variabled for timer
let second, minute;
let timer = document.querySelector("#timer");
let timerMins = document.querySelector("#timer-mins");
let timerSecs = document.querySelector("#timer-secs");
let interval;

//variable for close icon in popup
let closeicon = document.querySelector(".close");

//variable for popup modal
let modal = document.getElementById("alert-window");
let heading = document.getElementById('alert').childNodes[3];
let paragraph1 = document.querySelector('#alert-paragraph-1');

//variable for keypress function
let keyPressPlay;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//initialize the game after page load
document.body.onload = startGame();


//function that initialize the game
function startGame() {
    //reset open cards array
    openedCards = [];

    //reset matched cards
    matchedCards = 0;
    console.log('Matched cards: ' + matchedCards + ';');

    //reset moves
    countMoves = 0;
    movesNumber.innerHTML = countMoves;

    //reset star rating
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i].childNodes[0];
        star.className = 'fa fa-star';
    }

    //reset timer
    second = 0;
    minute = 3;
    timerMins.innerHTML = minute;
    timerSecs.innerHTML = '0' + second;
    clearInterval(interval);

    //reset style for countdown
    timer.style.animationName = "";
    timer.style.animationDuration = "";
    timer.style.color = "";

    //shuffle decked cards for new game
    cards = shuffle(cards);

    for (let i = 0; i < cards.length; i++) {
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        //remove action classes
        cards[i].classList.remove("open", "show", "match", "disable");
        //add click events on a card
        cards[i].addEventListener("click", flipCard);
        cards[i].addEventListener("click", openedCard);
    };
}

function flipCard() {
    //add new class names to flipped cards
    this.classList.add("open", "show", "disable");
}

function matched(openedCard) {
    //if two card matched add new class name
    openedCard.classList.add("match");
}

function unmatched(openedCard) {
    //if two card unmatched add new class name
    openedCard.classList.add("unmatch");
    //remove new classes from unmatched cards
    setTimeout(function() {
        openedCard.classList.remove("open", "show", "disable", "unmatch");
    }, 1000);
}

function openedCard() {
    openedCards.push(this);
    let len = openedCards.length;
    if (len === 2) {
        moveCounter();
        //check if two flipped cards match
        if (openedCards[0].className == openedCards[1].className) {
            openedCards.forEach(matched);
            openedCards = [];
            matchedCards += 2;
            console.log(matchedCards);
            //if all of cards found their pair then display popup window with congratulations
            if (matchedCards == 16) {
                endOfGame('win');
            }
        } else {
            openedCards.forEach(unmatched);
            openedCards = [];
        }
    }

}

function moveCounter() {
    countMoves++;
    movesNumber.innerHTML = countMoves;
    if (countMoves >= 1 && second == 0 && minute == 3) {
        //start game timer after first click on a card
        startTimer();
    }

    //rating score
    if (countMoves >= 7 && countMoves <= 13) {
        const star3 = document.getElementById('star3').childNodes[0];
        star3.className = 'fa fa-star-o';
    } else if (countMoves >= 14 && countMoves <= 20) {
        const star2 = document.getElementById('star2').childNodes[0];
        star2.className = 'fa fa-star-o';
    } else if (countMoves >= 21) {
        const star1 = document.getElementById('star1').childNodes[0];
        star1.className = 'fa fa-star-o';
        setTimeout(function() {
            endOfGame("noLives");
        }, 1000);
    }
}

// 'end of game' popup window
// there are 3 types of popup: after end of time, after end of lives and after winning
function endOfGame(result) {
    clearInterval(interval);
    // declare star rating variable
    const starRating = document.querySelector(".stars").innerHTML;

    if (result == 'timeLeft') {
        heading.innerHTML = 'End of Game';
        paragraph1.innerHTML = 'You lose! Time is over';
        // reset star rating
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i].childNodes[0];
            star.className = 'fa fa-star-o';
        }
        document.querySelector(".totalTime").style.display = "none";

    } else if (result == 'noLives') {
        heading.innerHTML = 'End of Game';
        paragraph1.innerHTML = 'You lose! You lost all your lives';

    } else if (result == 'win') {
        heading.innerHTML = 'Congratulations!';
        const img = document.createElement('img');
        paragraph1.innerHTML = 'You win!<br />';
        paragraph1.appendChild(img);

    }

    if (result == 'win' || result == 'noLives') {
        document.getElementById("finalMove").innerHTML = countMoves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = calculateTime();

    }

    // add class to display popup
    modal.classList.add("show");
    //close icon
    closeButton();

    //add keypress action to initialize playAgain() after enter
    keyPressPlay = function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("play-again").click();
        }
    }
    document.addEventListener("keypress", keyPressPlay);

    //showing move, rating
    if (countMoves == 1) {
        document.getElementById("finalMove").innerHTML = countMoves + ' move';
    } else {
        document.getElementById("finalMove").innerHTML = countMoves + ' moves';
    }
    document.getElementById("starRating").innerHTML = starRating;

}

// close button in a popup
function closeButton() {
    closeicon.addEventListener("click", function(e) {
        document.removeEventListener("keypress", keyPressPlay);
        modal.classList.remove("show");
        startGame();
    });
}

// 'play again' button in a popup
function playAgain() {
    document.removeEventListener("keypress", keyPressPlay);
    modal.classList.remove("show");
    startGame();
}

// countdown timer
function startTimer() {
    interval = setInterval(function() {
        second--;

        //change minute
        if (second == -1) {
            minute--;
            second = 59;
        }

        timerMins.innerHTML = minute;

        //add leading zero
        if (second < 10) {
            timerSecs.innerHTML = '0' + second;
        } else {
            timerSecs.innerHTML = second;
        }

        //add style for last 10sec countdown
        if (minute == 0 && second < 10) {
            timer.style.animationName = "flash";
            timer.style.animationDuration = ".75s";
            timer.style.color = "red";
        }

        //if time is over display popup
        if (minute < 0 && second == 59) {
            endOfGame("timeLeft");
        }

    }, 1000);
}

// calculate how much time takes the game
function calculateTime() {
    const startTime = 3 * 60;
    const timeLeft = minute * 60 + second;
    const finalTimeTotal = startTime - timeLeft;
    const finalTimeMinutes = Math.floor(finalTimeTotal / 60);
    const finalTimeSeconds = finalTimeTotal - finalTimeMinutes * 60;
    clearInterval(interval);
    const finalTime = "in " + finalTimeMinutes + " mins " + finalTimeSeconds + " secs";

    return finalTime;
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
