'use strict';
//Global Variables
//controls the speed of the shuffling in ms (Higher = slower)
var speed = 500;
var finderScore = 0;
var swindlerScore = 0;

//Random Function
var rand = function (limit) {
  return Math.floor((Math.random()*(limit+1)));
}

//------------------------------------------------------------
// CUP Class
//------------------------------------------------------------
var Cup = function (name, hasBall) {
  this.name = name || "tempCup";
  this.hasBall = hasBall || false;
}

//------------------------------------------------------------
// Move Class
//------------------------------------------------------------
var Move = function (position, direction) {
  this.position = position;
  this.direction = direction;
}

//------------------------------------------------------------
// Execute Move Function
//------------------------------------------------------------
var executeMove = function (move, arr) {
  var cupMovePosition = move.position;
  var cupMoveDirection = move.direction;
  var cupAffectedPosition;
  var tempArr = [];
  tempArr = cloneCups(arr);
  switch (cupMoveDirection) {
    case 'left': 
      if (cupMovePosition > 0) {
        cupAffectedPosition = move.position - 1;
      } else {
        cupAffectedPosition = 2;
      }
      break;
    case 'right': 
      if (cupMovePosition < 2) {
        cupAffectedPosition = move.position + 1;
      } else {
        cupAffectedPosition = 0;
      }
      break;
  }
  var tempCup = arr[cupMovePosition];
  tempArr[cupMovePosition] = tempArr[cupAffectedPosition];
  tempArr[cupAffectedPosition] = tempCup;
  return tempArr;
}

var cloneCups = function (arr) {
  var newCupArray = [];
  arr.forEach(function (element) {
    newCupArray.push(element);
  })
  return newCupArray;
}

//------------------------------------------------------------
// Animations
//------------------------------------------------------------
var animateMovesArray = function (arr) {
  $('#communication').html('Shuffling the cups!');
  var countdown=0;
  var timer = setInterval(function() {
    animateMove(arr[countdown]);
    countdown++;
    if (countdown > arr.length-1) {
      clearInterval(timer);
    }
  },speed);
};

var animateMove = function (move) {
  var movePosition = move.position;
  var moveDirection = move.direction;
  var animateLength = 265;
  var direction;
  var reverse;
  var affectedCup;
  switch (moveDirection) {
    case 'left':
      if (movePosition === 0) {
        affectedCup = 2;
        direction = '+='
        animateLength = animateLength * 2;
      } else {
        affectedCup = movePosition - 1;
        direction = '-=';
      }
      break;
    case 'right': 
      if (movePosition == 2) {
        affectedCup = 0;
        direction = '-='
        animateLength = animateLength * 2;
      } else {
        affectedCup = movePosition + 1;
        direction = '+=';
      }
      break;
  }

  direction=='-=' ? reverse = '+=' : reverse = '-=';

  $('.cup:nth-child(' + eval(movePosition + 1) + ')').animate({
    left: direction+animateLength
  },speed, function () {
    $(this).removeAttr('style');
  });
  $('.cup:nth-child(' + eval(affectedCup + 1) + ')').animate({
    left: reverse+animateLength
  },speed, function () {
    $(this).removeAttr('style');
  });
}

var animateUp = function () {
  $(this).children('.cup-overlay').animate({ 
   left: '+=60', top: '-=60'
  }, 200)
}

var animateDown = function () {
  $(this).children('.cup-overlay').animate({ 
    left: '-=60', top: '+=60'
  }, 200)
}

//------------------------------------------------------------
// Ball Functions
//------------------------------------------------------------
var placeBall = function (cupArray) {
  var ballLocatedAt;
  cupArray.forEach(function(element, index) {
    //check element for has ball
    $(this).removeClass('selected');
    if (element.hasBall) {
      ballLocatedAt = index;
    }
  });
  //Remove any current balls placed
  $('.ball').remove();
  //place ball into cup
  $('.cup:nth-child(' + eval(ballLocatedAt+1) + ')').append('<div class="ball"></div>'); 
  return ballLocatedAt;
}

var findBall = function (ballLocatedAt) {
  //Change Instruction
  $('#communication').html('Click on a shell and find the Ball!');
  //remove buttons
  $('#game-buttons button').remove();
  //bind event
  $('.cup').click(function () {
    $(this).children('.cup-overlay').animate({ 
      left: '+=60', top: '-=60'
    }, 200);
    $('.cup').unbind();
    var clickedIndex = $(this).index();
    if (clickedIndex === ballLocatedAt) {
      $('#communication').html('YOU WIN')
      finderScore++;
    } else {
      $('#communication').html('YOU LOSE')
      swindlerScore++;
    }
    //create reset button
    $('#game-buttons').html('<button id="reset-game" class="btn btn-danger btn-lg">Reset</button>');
  });
}

//------------------------------------------------------------
// GAME Class
//------------------------------------------------------------
function Game() {
  //variables
  this.cupArray = [];
  this.movesArray = [];
  this.numberOfCups = 3;
  this.startPosition;

  Game.prototype.createCups = function () {
    //generate cups
    for (var i = 0; i < this.numberOfCups; i++) {
      this.cupArray.push(new Cup("cup" + eval('i+1'),false));
    }
    console.log("Cup Array:" + this.cupArray);
  }

  //generate computer start position and x random moves
  Game.prototype.generateComputer = function (numberOfMoves) {
    //generate start position
    var randomStartPosition = rand(2);
    console.log(randomStartPosition);
    this.cupArray[randomStartPosition].hasBall = true;
    this.startPosition = randomStartPosition;
    for (var i = 0; i < numberOfMoves; i++) {
      //generate numbers for move
      var randomPosition = rand(2);
      var randomDirection = rand(1);
      var randomDirectionString
      randomDirection===0 ? randomDirectionString = 'left' : randomDirectionString = 'right';
      this.movesArray.push(new Move(randomPosition,randomDirectionString));
    }
  }

//------------------------------------------------------------
// GAME FUNCTIONS
//------------------------------------------------------------
  //Starts the games, takes a boolean to get which opponent the user chose
  Game.prototype.start = function (versusComputerPlayer) {
    this.createCups();
    if (versusComputerPlayer) {
      this.versusComputer();
    } else {
      this.versusPlayer();
    }
  }

  //versus computer flow
  Game.prototype.versusComputer = function () {
    var computerMoves = prompt("How many moves should the Computer Do?") || 10;

    //generate computer flow
    this.generateComputer(computerMoves);
    this.finderFollow();
  }

  Game.prototype.finderFollow = function () {
    //Grab arrays to ensure scope
     var movesArray = this.movesArray;
     var cupArray = this.cupArray;
    //remove the balls inside the cup
    $('.ball').remove();
    //Change text on communication
    $('#communication').html("Click start when ready");
    $('#game-buttons').html('<button id="start-shuffle" class="btn btn-success btn-lg">Start</button>')
    //showing initial position
    console.log(this.startPosition);
    console.log($('.cup')[this.startPosition]);
    $($('.cup')[this.startPosition]).append('<div class="ball"></div>');
    $($('.cup')[this.startPosition]).children('.cup-overlay').animate({ 
      left: '+=60', top: '-=60'
    }, 200);
    $($('.cup')[this.startPosition]).children('.cup-overlay').addClass('selected');

    //actually execute moves
    for (var i = 0; i < movesArray.length; i++) {
      cupArray = executeMove(movesArray[i], cupArray);
    }

    console.log(cupArray);

    $('#start-shuffle').click(function () {
      $('.selected').animate({ left: '-=60', top: '+=60' }, 200);
      //unbind event
      $(this).unbind();
      //call animateMoves
      console.log(movesArray);
      animateMovesArray(movesArray);
      var ballLocatedAt = placeBall(cupArray);
      findBall(ballLocatedAt);
    });
  }
}

//Versus player function 
var versusPlayer = function () {
  $('.cup').bind('mouseenter',animateUp);
  $('.cup').bind('mouseleave',animateDown);
}

//RESET
var resetGame = function () {
  var resetGame = new Game();
  //remove styles on cups
  $(".cup-overlay").removeAttr("style");
  $(".cup-overlay").removeClass("selected");
  //generate buttons
  $('#game-buttons').html('<button class="btn btn-primary btn-lg" id="game-player">Player</button> <button class="btn btn-danger btn-lg" id="game-computer">Computer</button>')
  //change communication
  $('#communication').text('Choose an opponent')
  return resetGame
}

//Instantiating new game
var game = new Game();

$(document).ready(function() {
  $(document).on('click', '#reset-game', function () {
    game = resetGame();
  });

  $(document).on('click', '#game-computer', function () {
    game.start(true);
  });
  $(document).on('click', '#game-player', function () {
    game.start();
  });
});
