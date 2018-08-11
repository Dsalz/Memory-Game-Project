
//Array of fontAwesome icons to be shuffled when game starts

let originalArray = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb", "bolt" , "paper-plane-o" , "bicycle", "diamond", "anchor", "cube", "leaf", "bomb"];


//declaring global variables

let shuffledArray;
    
let clickedCardArray;
    
let clickedCardDataArray;

let moveCount;

let timerCount;

let timerInterval;

let starsContent; 

let solvedCards = 0;

let deckOfCards = document.querySelector('.deck');

let moveCounter = document.querySelector('.moves');

let starsSection = document.querySelector('.stars');

let timerSection = document.querySelector('.timer');


function shuffle(array) {  
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//calling the function that starts new game

startGame();

//declaring function that starts new game after calling it ( thanks hoisting! :) )

function startGame(){

//initializing global variables to default when game starts and shuffling icons array 
    
shuffledArray = shuffle(originalArray);
    
clickedCardArray = [];

clickedCardDataArray = [];
    
moveCount = 0;
    
timerCount = 0;

solvedCards = 0;
    
starsContent = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
    
timerSection.innerHTML = '0 seconds';
    
moveCounter.innerHTML = `${moveCount} Moves`;

deckOfCards.innerHTML="";

starsSection.innerHTML= starsContent;
    

//IIFE used for the Game's Timer declared

const gameTimer = function(){
    
  function updateTime(){
      
    timerCount++; 
      
    timerSection.innerHTML = `${timerCount} seconds`;
      
    }
  
    return{
        
      start: function(){
          
        timerInterval = setInterval(updateTime, 1000);
          
      }
        ,
      stop: function(){
          
      clearInterval(timerInterval);
          
      }
        
    }
    
  }();
  
    
//stop property of the game timer IIFE used to stop timer
    
gameTimer.stop();


//looping through the array to create cards and append them to the page  
    
for(let i=0; i<16; i++){

let card = document.createElement('li');
    
card.classList.add('card');
    
card.innerHTML = "<i class= 'fa fa-" + shuffledArray[i] + "'></i>";
  
deckOfCards.appendChild(card);
    
}

//Adding an event listener to the cards that ensures that the card clicked doesnt contain the classes "open", "match", "show" and that the current number of open cards isnt more than 1 (to prevent people from clicking a third card while animating a wrong or right card on the page)
    
//The callback function to the event listener adds the flip-in animation and shows the card then adds the card to an array(for animating and hiding if wrong), adds the cards html to a different array(for comparing) then checks to see if all cards have been matched
    
deckOfCards.addEventListener('click', function(e){
    if(e.target.nodeName == "LI"){
        if (!e.target.classList.contains('match') && !e.target.classList.contains('open')
            && !e.target.classList.contains('show') && document.getElementsByClassName('open').length < 2){
            e.target.classList.add("flipInY", "animated", "open", "show" );
            addCard(e.target);
            addCardData(e.target.innerHTML);
            finito();
        }
    }
})

    
//hiding the congrats screen  
    
document.querySelector('.congratsModal').style.display = "none";
    
// function for adding a move to the move counter
    
function addMoveCount(){
    
moveCount++; 
    
moveCounter.innerHTML= `${moveCount} Moves`;
        
    if(moveCount === 1){
        
      gameTimer.start();  //start property of the game timer IIFE used to start timer
        
    }
    
    if(moveCount > 15){   //updates the stars section when the number of moves is more than 15
        
        updateStars();
        
    }
}
    
//function for updating stars section
    
function updateStars(){ 
    
    if(moveCount > 30){ //updates the stars section to 1 star when the number of moves is more than 30
        
        starsContent = '<li><i class="fa fa-star"></i></li>';
        
        starsSection.innerHTML= starsContent;
        
    }
    
    else if (moveCount > 15){  //updates the stars section to 2 stars when the number of moves is more than 15
        
       starsContent = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
           
       starsSection.innerHTML= starsContent;
        
    }
    
}

//function for adding card to array
    
function addCard(card){
    clickedCardArray.push(card);
}
    

//function for adding card data to array
    
function addCardData(cardData){
    clickedCardDataArray.push(cardData);
    if (clickedCardDataArray.length > 1){ // when there are two cards in the array update the move counter and validating the cards clicked
        addMoveCount();
        validateCard();
    }
}


//function for validating cards in the clicked card data array
function validateCard(){
    if(clickedCardDataArray[0]==clickedCardDataArray[1]){  // checking if the two cards are the same
        rightCardChosen(); 
    }
    else{
        wrongCardChosen();
    }
}

//function executed when the wrong card was chosen
    
function wrongCardChosen(){
    
    for (let i = 0; i<clickedCardArray.length; i++){ //looping through the array to animate the cards
    
        animateWrongCard(clickedCardArray[i]);
    }
  
  setTimeout(function(){     //delaying the hiding of cards and emptying of the arrays for a second so the animation can play out
      
    for (let i = 0; i<clickedCardArray.length; i++){
        
     hideCard(clickedCardArray[i]);
        
    }
      
        clickedCardArray = [];
      
        clickedCardDataArray = [];
      
  }, 1000);
    
}


//function for animating wrong cards
    
function animateWrongCard(chosenCard){
    
    chosenCard.classList.remove('flipInY' , 'animated');
    
    chosenCard.classList.add('wrong', 'shake', 'animated');
    
}
    
    
//function for hiding wrong card
    
function hideCard(chosenCard){ 
    
    chosenCard.classList.remove('show','open','wrong', 'animated','shake');
    
}

    
//function executed when the right card was chosen
    
function rightCardChosen(){
    
    for (let i = 0; i<clickedCardArray.length; i++){ //looping through the array to animate the cards and incrementing number of solved cards;
    
        animateRightCard(clickedCardArray[i]);
        
        solvedCards++;
        
    }
    
        clickedCardArray = [];  // emptying of the arrays
    
        clickedCardDataArray=[];
}

    
//function for animating right cards
    
function animateRightCard(chosenCard){
  
  chosenCard.classList.remove('flipInY' , 'animated');
    
  chosenCard.classList.add('match','bounce','animated');
    
  chosenCard.classList.remove('open' , 'show');
    
}
  
    
//function for checking if all cards are solved and displaying the congrats screen if so
    
function finito(){
   
  if (solvedCards == 16){
      
// adding player stats to congrats screen
      
   document.querySelector('.congratsModalStats').innerHTML = `<ul class="congratsModalStars"> ${starsContent}</ul><p>Moves:  
<strong>${moveCount}</strong></p><p>Time Spent: <strong>${timerCount} seconds</strong></>` 
   
// showing congrats screen
    document.querySelector('.congratsModal').style.display ="block";
      
  }
    
  };
    
}


    

document.querySelector('.restart').addEventListener('click' , startGame);

document.querySelector('.congratsModalRestart').addEventListener('click' , startGame);

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
