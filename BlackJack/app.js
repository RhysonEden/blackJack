// I wrote this code to try and show a little of everything we
// were taught I was able to actually retain, plus leaning more
// heavily on base JS.

let cards = [];
let playerCard = [];
let dealerCard = [];
let cardCount = 0;
let myDollars = 100;
let suits = ["spades", "hearts", "clubs", "diams"];
let numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
// let numb = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"];
let output = document.getElementById("output");
let dealerHand = document.getElementById("dealer-hand");
let playerHand = document.getElementById("player-hand");
let message = document.getElementById("message");
let playerValue = document.getElementById("playerValue");
let dealerValue = document.getElementById("dealerValue");
let endPlay = false;
let payoutJack = 1;
let dollarValue = document.getElementById("dollars");

document.getElementById("playerbet").onchange = function() {
  if ($(this).val() < 0) {
    $(this).val() = 0;
  }
  if ($(this).val() > myDollars) {
    $(this).val() = myDollars;
  }
  message.innerHTML = "Bet Changed to $" + $(this).val();
};

function brokeAF() {
  if (myDollars <= 0) {
    alert("You're Broke, there's an ATM over there");
    location.reload();
    maxBet();
  }
}

for (s in suits) {
  let suit = suits[s][0].toUpperCase();
  let bgcolor = suit == "S" || suit == "C" ? "black" : "red";
  for (n in numb) {
    // output.innerHTML += "<span style='color:" + bgcolor + "'>&" + suits[s] + ";" + numb[n] + "</span> ";
    let cardValue = n > 9 ? 10 : parseInt(n) + 1;
    // let cardValue = 1;
    let card = {
      suit: suit,
      icon: suits[s],
      bgcolor: bgcolor,
      cardnum: numb[n],
      cardvalue: cardValue
    };
    cards.push(card);
  }
}

function Start() {
  shuffleDeck(cards);
  dealNew();
  document.getElementById("start").style.display = "none";
  document.getElementById("dollars").innerHTML = myDollars;
}

function dealNew() {
  dealerValue.innerHTML = "?";
  playerCard = [];
  dealerCard = [];
  dealerHand.innerHTML = "";
  playerHand.innerHTML = "";
  let betValue = document.getElementById("playerbet").value;
  if (betValue > myDollars) {
    betValue = myDollars;
    //added this guy in thanks to a friend who found if he used
    // a negative number like -234234232432, if he intentionally
    // lost, then he'd have almost unlimited money, by checking
    // to see if betValue is less than 0 and if so making it
    //equal to the current bank, it fixed the issue.
  } else if (betValue < 0) {
    betValue = myDollars;
  }
  document.getElementById("playerbet").value = betValue;
  myDollars = myDollars - betValue;
  document.getElementById("dollars").innerHTML = myDollars;
  document.getElementById("player-actions").style.display = "block";
  document.getElementById("btnDeal").style.display = "block";
  message.innerHTML = "Currently Betting $" + betValue;
  document.getElementById("playerbet").disabled = true;
  document.getElementById("maxbet").disabled = true;
  deal();
}

function deckCheck() {
  cardCount++;
  if (cardCount > 40) {
    // console.log("new deck");
    shuffleDeck(cards);
    cardCount = 0;
  }
}

function deal() {
  for (x = 0; x < 2; x++) {
    dealerCard.push(cards[cardCount]);
    dealerHand.innerHTML += cardOutput(cardCount, x);
    if (x == 0) {
      dealerHand.innerHTML += "<div id='cover'></div>";
    }
    deckCheck();
    playerCard.push(cards[cardCount]);
    playerHand.innerHTML += cardOutput(cardCount, x);
    deckCheck();
  }
  let cardValue = cardSum(playerCard);
  playerValue.innerHTML = cardValue;
  // console.log(dealerCard);
  // console.log(playerCard);
}

function cardOutput(n, x) {
  let hpos = x > 0 ? x * 60 + 100 : 100;
  return (
    '<div class="icard ' +
    cards[n].icon +
    '" style="left:' +
    hpos +
    'px;">  <div class="top-card suit">' +
    cards[n].cardnum +
    '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' +
    cards[n].cardnum +
    "<br></div> </div>"
  );
}

function cardAction(a) {
  // console.log(a);
  switch (a) {
    case "hit":
      playOneCard();
      break;
    case "hold":
      playEnd();
      break;
    case "double":
      let betValue = parseInt(document.getElementById("playerbet").value);
      if (myDollars - betValue < 0) {
        betValue = betValue + myDollars;
        myDollars = 0;
      } else {
        myDollars = myDollars - betValue;
        betValue = betValue * 2;
      }
      document.getElementById("dollars").innerHTML = myDollars;
      document.getElementById("playerbet").value = betValue;
      playOneCard();
      playEnd();
      break;
    default:
      // console.log("done");
      playEnd();
  }
}

function playOneCard() {
  playerCard.push(cards[cardCount]);
  playerHand.innerHTML += cardOutput(cardCount, playerCard.length - 1);
  deckCheck();
  let cardValue = cardSum(playerCard);
  playerValue.innerHTML = cardValue;
  if (cardValue > 21) {
    message.innerHTML = "<h2>Player Busts!</h2>";
    playEnd();
  }
}

function playEnd() {
  endPlay = true;
  document.getElementById("cover").style.display = "none";
  document.getElementById("player-actions").style.display = "none";
  document.getElementById("btnDeal").style.display = "block";
  document.getElementById("playerbet").disabled = false;
  document.getElementById("maxbet").disabled = false;
  message.innerHTML = "Game Over<br>";
  let dealerCardValue = cardSum(dealerCard);
  dealerValue.innerHTML = dealerCardValue;
  while (dealerCardValue < 17) {
    dealerCard.push(cards[cardCount]);
    dealerHand.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
    deckCheck();
    dealerCardValue = cardSum(dealerCard);
    dealerValue.innerHTML = dealerCardValue;
  }
  let playerCardValue = cardSum(playerCard);
  if (playerCardValue == 21 && playerCard.length == 2) {
    message.innerHTML = "BLACKJACK!<br>";
    payoutJack = 1.5;
  }
  let betValue =
    parseInt(document.getElementById("playerbet").value) * payoutJack;

  if (
    (playerCardValue < 22 && dealerCardValue < playerCardValue) ||
    (dealerCardValue > 21 && playerCardValue < 22)
  ) {
    message.innerHTML +=
      '<span style="color:blue;">You WIN! You won $' + betValue + "</span>";
    myDollars = myDollars + betValue * 2;
  } else if (playerCardValue > 21) {
    message.innerHTML +=
      '<span style="color:red;">Dealer wins! You lost $' + betValue + "</span>";
  } else if (playerCardValue == dealerCardValue) {
    message.innerHTML += '<span style="color:blue;">Push!</span>';
    myDollars = myDollars + betValue;
  } else {
    message.innerHTML +=
      '<span style="color:red;">Dealer wins! You lost $' + betValue + "</span>";
  }
  playerValue.innerHTML = playerCardValue;
  dollarValue.innerHTML = myDollars;
  brokeAF();
}

function maxBet() {
  document.getElementById("playerbet").value = myDollars;
  message.innerHTML = "Bet Changed to $" + myDollars;
}

function cardSum(arr) {
  let rValue = 0;
  let aceAdjust = false;
  for (let i in arr) {
    if (arr[i].cardnum == "A" && !aceAdjust) {
      // console.log("Ace!");
      aceAdjust = true;
      rValue = rValue + 10;
    }
    rValue = rValue + arr[i].cardvalue;
  }
  if (aceAdjust && rValue > 21) {
    rValue = rValue - 10;
  }
  return rValue;
}

function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function outputCard() {
  output.innerHTML += `<span style=color:${cards[cardCount].bgcolor}>${cards[cardCount].cardnum}
    &${cards[cardCount].icon};</span>`;
}
