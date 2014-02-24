var printToScreen = function(text){
  document.getElementById('demo').innerHTML += text + "<br>";
  document.getElementById('demo_parent').style.display = 'none';
  document.getElementById('demo_parent').style.display = 'block';


}

function Deck(cards){
  //creates blank array to store deck of cards
    this.cards = [];
}

Deck.prototype.push = function(arg){
  //allows cards to be pushed onto Deck
    this.cards.push(arg);
};

Deck.prototype.createDeck = function(numOfDecks){
  //hold value of self for inside
  var self = this;
  var generateCards = function(numOfCards, cardSuit){
    var i = 1;
    while(i<(numOfCards+1)){
      var myCard = new Card(i, cardSuit);
      self.cards.push(myCard);
      i++;
    }
  };
  //Generates 13*numDecks cards of each type of card in a standard deck;
  for(var i = 0; i<numOfDecks; i++){
    generateCards(13, "Hearts");
    generateCards(13, "Clubs");
    generateCards(13, "Diamonds");
    generateCards(13, "Spades");
  }
};

Deck.prototype.draw = function(){
  var self = this;
  var drawCount = 0;

  var cardDraw = function(){
    //checks number of cards left in the deck
    var deckSize = self.cards.length;
    if(drawCount<deckSize){
      //chooses a random card in the deck
      var cardPosition = Math.floor(Math.random()*deckSize);
      //returns the randomly choosen card at the posistion, and removes the card in that posistion.
      var drawnCard = self.cards.splice(cardPosition,1);

      drawCount++;
      return drawnCard[0];
    }else{
      throw "Out of Cards";
    }

  }
  return cardDraw();
};

function Card(val, suit){
  this.val = val;
  this.suit = suit;
}

Card.prototype.identify = function(){
  var orgNum = this.val;
  var renamed = "";

  if(orgNum ===1){
      renamed =  "Ace";
    }else if(orgNum < 11){
      renamed =  orgNum;
    }else if(orgNum === 11){
      renamed =  "Jack";
    }else if(orgNum === 12){
      renamed =  "Queen";
    }else if(orgNum === 13){
      renamed =  "King";
    }

  return renamed + " of " + this.suit;
};

//creates a new object for cards in hand using the prototype for deck
function HeldCards(cards){
  Deck.call(this,cards);
  //this.cards = [];
}
HeldCards.prototype = new Deck;

HeldCards.prototype.total = function(){
  var count = 0;
  var self = this;
  var aceCheck = false;
  for(var i = 0; i<this.cards.length; i++){
    if(self.cards[i].val>10){
      count += 10;
    }else if(self.cards[i].val === 1){
      count +=11;
      aceCheck = true;
      }else{
      count += self.cards[i].val;
    }
  }
  if(count > 21 && aceCheck === true){
    return count-10;
  }else{
    return count;
  }
};

HeldCards.prototype.getCards = function(deck, who){
  var x = 1;
  if(who ==="player"){
    moreCards = true;
    while(moreCards && this.total() <21){
      var hitOrStand = prompt("Hit or Stand?");
      switch(hitOrStand.toLowerCase()){
        case "hit":
          printToScreen("You Hit");
          this.cards.push(deck.draw());
          x++;
          printToScreen("You drew a(n) " + this.cards[x].identify());
          break;
        case "stand":
          printToScreen("You Stand");
          moreCards = false;
          break;
        default:
          printToScreen("You need to enter Hit or Stand");
        }
      printToScreen("Your total is: " + this.total());
    }
  }else{
    printToScreen("The dealer has a(n) " + this.cards[0].identify() + " and a(n) " + this.cards[1].identify());
    while(this.total() < 17){
      this.cards.push(deck.draw());
      x++;
      printToScreen("The dealer hit");
      printToScreen("The dealer drew a(n) " + this.cards[x].identify());
      printToScreen("The dealer total is " + this.total());
    }
    if(this.total()>16){
      printToScreen("The dealer has " + this.total());
    }
  }
}

function Player (hands){
    this.hands = [];
}

Player.prototype.push = function(arg){
    this.hands.push(arg);
}

var checkForWin = function(playerHand, dealerHand){
  if((playerHand.total() > dealerHand.total()) && (playerHand.total() < 22)){
    printToScreen("You Win!");
  }else if(playerHand.total() === dealerHand.total()){
    printToScreen("Push");
  }else if(playerHand.total()<22 && dealerHand.total()>21){
    printToScreen("You Win!");
  }else{
    printToScreen("You Lose!!!");
  }
};

var main = function(){
  printToScreen("Let's Play Blackjack!");
  var howMany = prompt("How many decks?");
  var shouldDealer = false;
  var newDeck = new Deck();
  var playerHands = new Player();
  var playerCards = new HeldCards();
  var dealerCards = new HeldCards();
  newDeck.createDeck(howMany);
  var currentHand = 0;

  for(var i = 0; i<2; i++){
    playerCards.push(newDeck.draw());
    dealerCards.push(newDeck.draw());
  }
/*  testCards = new Card(4, "spades");
  testCards2 = new Card(4, "clubs");
  playerCards.push(testCards2);
 	playerCards.push(testCards);*/

 	playerHands.push(playerCards);

  printToScreen("Your cards are: " + playerHands.hands[0].cards[0].identify() + " and " + playerHands.hands[0].cards[1].identify());
  printToScreen("Your cards total: " + playerHands.hands[0].total());
  printToScreen("The computer is showing a: " + dealerCards.cards[0].identify());

  if(playerHands.hands[currentHand].cards[0].val === playerHands.hands[currentHand].cards[1].val){
  	var splitCheck = prompt("Would you like to split? (yes or no)");
  	  switch(splitCheck.toLowerCase()){
        case "yes":
        	printToScreen("You split");
        	splitHand = new HeldCards();
        	splitHand.push(playerHands.hands[currentHand].draw());
        	splitHand.push(newDeck.draw());
        	playerHands.hands[currentHand].push(newDeck.draw());
        	playerHands.push(splitHand);

        	currentHand = currentHand +1;
        	break;
        case "no":
        	break;
        default:
        	break;
      }
  }

 for(var x = 0; x<playerHands.hands.length; x++){
   if(playerHands.hands.length>1){
   printToScreen("Hand " + (x + 1));
   printToScreen(playerHands.hands[x].cards[0].identify() + " " + playerHands.hands[x].cards[1].identify());
 	}
   playerHands.hands[x].getCards(newDeck, "player");
	}

	for(var n = 0; n<playerHands.hands.length; n++){
		if(playerHands.hands[n].total() < 22){
			shouldDealer = true;
		}
	}
	if(shouldDealer === true){
		dealerCards.getCards(newDeck);
	}

	for(var i = 0; i<playerHands.hands.length; i++){
   if(playerHands.hands.length>1){
		printToScreen("Hand " + (i+1))
	}
		checkForWin(playerHands.hands[i], dealerCards)
	}
};

main();
