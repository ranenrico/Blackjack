// Deck

function Deck() {
    this.cards = [];
    this.buildDeck();
    this.shuffleDeck();
}

Deck.prototype.buildDeck = function() {
    this.cards = [];
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let suits = ['c', 'd', 'h', 's'];
    for(let i = 0; i < 4; i++){
        for (let suit of suits) {
            for (let value of values) {
                this.cards.push(new Card(suit, value));
            }
        }
    }
}

Deck.prototype.shuffleDeck = function() {
    for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
}

Deck.prototype.drawCard = function() {
    return this.cards.pop();
}

// Card

function Card(suit, value) {
    this.suit = suit;
    this.value = value;
}

Card.prototype.getValue = function() {
    if (this.value === 'A'){
        return 11;
    }
    if (['K', 'Q', 'J'].includes(this.value)){
        return 10;
    }
    return parseInt(this.value);
}

Card.prototype.toString = function() {
    return this.suit + this.value;
}

// Player

function Player() {
    
    this.cards = [];
    this.sum = 0;
    this.aceCount = 0;
}

Player.prototype.addCard = function(card) {
    this.cards.push(card);
    this.sum += card.getValue();
    if (card.value === 'A') this.aceCount++;
    this.reduceAce();
}

Player.prototype.reduceAce = function() {
    while (this.sum > 21 && this.aceCount > 0) {
        this.sum -= 10;
        this.aceCount--;
    }
}

Player.prototype.reset = function() {
    this.cards = [];
    this.sum = 0;
    this.aceCount = 0;
}

Player.prototype.hit = function(deck) {
    if (this.sum >= 21) {
        return;
    }
    let card = deck.drawCard();
    this.addCard(card);
    return card;
}

// Dealer

function Dealer() {
    Player.call(this);
    this.hiddenCard = null;
}

Dealer.prototype = Object.create(Player.prototype);
Dealer.prototype.constructor = Dealer;

Dealer.prototype.setHiddenCard = function(card) {
    this.hiddenCard = card;
    this.addCard(card);
    this.sum -= card.getValue();
}

Dealer.prototype.revealHiddenCard = function() {
    if (this.hiddenCard) {
        this.sum += this.hiddenCard.getValue();
        this.hiddenCard = null;
    }
}

// Inizio codice di gioco

let deck;
let gameCount = 0;
let canHit = true;
let bust = false;
let blackjack = false;
let results, yourScore, yourCards, dealerScore, newGameButton;
let player = new Player();
let dealer = new Dealer();

window.onload = function() {
    results = document.getElementById("results");
    yourScore = document.getElementById("yourScore");
    yourCards = document.getElementById("yourCards");
    dealerScore = document.getElementById("dealerScore");
    newGameButton = document.getElementById("newGame");

    document.getElementById("hit").addEventListener("click", playerHit);
    document.getElementById("stay").addEventListener("click", stay);
    newGameButton.addEventListener("click", newGame);

    newGame();
}

function newGame() {
    if (gameCount == 5 || !deck) {
        deck = new Deck();
        gameCount = 0;
    }
    // if (!deck || deck.cards.length < 10) {
    //     deck = new Deck();
    // }
    

    startGame();
    gameCount++;
}

function startGame() {
    player.reset();
    dealer.reset();
    canHit = true;
    bust = false;
    blackjack = false;

    yourCards.innerHTML = "";
    document.getElementById("dealerCards").innerHTML = '<img id="hiddenCard" src="../assets/images/backs/BACK.png"><img id="dealerCard1">';
    results.innerText = "";
    yourScore.innerText = "";
    dealerScore.innerText = "";
    newGameButton.style.display = "none";

    dealer.setHiddenCard(deck.drawCard());

    let card = deck.drawCard();
    dealer.addCard(card);
    document.getElementById("dealerCard1").src = `../assets/images/cards/${card.toString()}.png`;

    for (let i = 0; i < 2; i++) {
        let card = player.hit(deck);
        addCardImage(card, player);
    }

    if (player.sum === 21) {
        canHit = false;
        yourScore.innerText = player.sum + "! BLACKJACK!";
        blackjack = true;
        stay();
    }
}

function playerHit() {
    if (!canHit) return;
    let card = player.hit(deck);
    if (card) {
        addCardImage(card, player);
        if (player.sum > 21 && player.aceCount === 0) {
            bust = true;
            stay();
        }
    }
}

function stay() {
    canHit = false;
    dealer.revealHiddenCard();
    document.getElementById("hiddenCard").src = `../assets/images/cards/${dealer.cards[0].toString()}.png`;
    dealerScore.innerText = dealer.sum;

    if (blackjack) {
        results.innerText = dealer.sum === 21 ? "Draw!" : "BLACKJACK!";
        endGame();
        return;
    }
    if (bust) {
        results.innerText = "Busted!";
        endGame();
        return;
    }
    while (dealer.sum < 17) {
        let card = dealer.hit(deck);
        if (card) addCardImage(card, dealer);
    }

    if (dealer.sum > 21 || player.sum > dealer.sum) {
        results.innerText = "You won!";
    } else if (dealer.sum > player.sum) {
        results.innerText = "You lost!";
    } else {
        results.innerText = "Draw!";
    }
    endGame();
}

function addCardImage(card, player) {
    let cardImg = document.createElement("img");
    cardImg.src = `../assets/images/cards/${card.toString()}.png`;
    if (player instanceof Dealer) {
        document.getElementById("dealerCards").appendChild(cardImg);
        dealerScore.innerText = dealer.sum;
    } else {
        yourCards.appendChild(cardImg);
        yourScore.innerText = player.sum;
    }
}

function endGame() {
    newGameButton.style.display = "block";
}