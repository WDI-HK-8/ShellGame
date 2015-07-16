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
      $('#communication').html('FINDER WIN')
      finderScore++;
      //increase difficulty
      speed *= 0.8
    } else {
      $('#communication').html('SWINDLER WIN')
      swindlerScore++;
      //default speed when lose
      speed = 600
    }
    //update score
    updateScoreboard();
    //create reset button
    $('#game-buttons').html('<button id="reset-game" class="btn btn-danger btn-lg">Play Again</button>');
  });
}

//------------------------------------------------------------
// GAME Class
//------------------------------------------------------------
function Game() {
  //variables
  var cupArray = [];
  var movesArray = [];
  this.numberOfCups = 3;
  var playerMoveArray = [];
  var startPosition;

  Game.prototype.createCups = function () {
    //generate cups
    for (var i = 0; i < this.numberOfCups; i++) {
      cupArray.push(new Cup("cup" + eval('i+1'),false));
    }
    console.log("Cup Array:" + cupArray);
  }

  //generate computer start position and x random moves
  Game.prototype.generateComputer = function (numberOfMoves) {
    //generate start position
    var randomStartPosition = rand(2);
    console.log(randomStartPosition);
    cupArray[randomStartPosition].hasBall = true;
    startPosition = randomStartPosition;
    for (var i = 0; i < numberOfMoves; i++) {
      //generate numbers for move
      var randomPosition = rand(2);
      var randomDirection = rand(1);
      var randomDirectionString
      randomDirection===0 ? randomDirectionString = 'left' : randomDirectionString = 'right';
      movesArray.push(new Move(randomPosition,randomDirectionString));
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
     // var movesArray = movesArray;
    //remove the balls inside the cup
    $('.ball').remove();
    //Change text on communication
    $('#communication').html("Click start when ready");
    $('#game-buttons').html('<button id="start-shuffle" class="btn btn-success btn-lg">Start</button>')
    //showing initial position
    console.log($('.cup')[startPosition]);
    $($('.cup')[startPosition]).append('<div class="ball"></div>');
    $($('.cup')[startPosition]).children('.cup-overlay').animate({ 
      left: '+=60', top: '-=60'
    }, 200);
    $($('.cup')[startPosition]).children('.cup-overlay').addClass('selected');
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
      animateMovesArray(movesArray);
      var ballLocatedAt = placeBall(cupArray);
      findBall(ballLocatedAt);
    });
  }
  
  //Versus player function 
  Game.prototype.versusPlayer = function () {
    var startingPosition
    //Bind hover event
    $('.cup').bind('mouseenter',animateUp);
    $('.cup').bind('mouseleave',animateDown);
    //create click event
    $('.cup').click(function () {
      $(this).children('.cup-overlay').animate({ left: '-=60', top: '+=60' }, 200);
      //unbind event from all cups
      $('.cup').unbind();
      startPosition = $(this).index();
      cupArray[startPosition].hasBall = true;
      console.log(cupArray);
      //Create buttons
      $('#create-buttons').slideDown()
      $('.create-move button').click(game.recordPlayerMove);
      //Change communication
      $('#communication').text('Click on an arrow to shuffle a cup!');
    });
    //Change communication
    $('#communication').text('Click on a shell to hide the ball!');
    //
  }

  Game.prototype.recordPlayerMove = function () {
    //remove buttons
    $('#game-buttons button').remove();
    var move;
    var direction;
    move = $(this).parent().index();
    direction = $(this).index();
    switch (direction) {
      case 0:
        direction = "left";
        break;
      case 1:
        direction = "right";
        break;
    }
    var newMove = new Move(move, direction);
    console.log(move, direction);
    animateMove(newMove);
    movesArray.push(newMove);
    console.log(movesArray);
    if (movesArray.length >= 1) {
      //generate next button
      $('#game-buttons').html('<button class="btn btn-success btn-lg" id="record-complete">Finished Shuffling</button>');
    }
  }
}

//------------------------------------------------------------
// RESET
//------------------------------------------------------------
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

//------------------------------------------------------------
// SCOREBOARD
//------------------------------------------------------------
var updateScoreboard = function () {
  //update finder scoreboard
  $('#scoreboard-finder > .score').text(finderScore);
  //update swindler scoreboard
  $('#scoreboard-swindler > .score').text(swindlerScore);
}

//Instantiating new game
var game = new Game();

$(document).ready(function() {
  var tempArr;
  updateScoreboard();
  $(document).on('click', '#reset-game', function () {
    game = resetGame();
  });

  $(document).on('click', '#game-computer', function () {
    game.start(true);
  });
  $(document).on('click', '#game-player', function () {
    game.start();
  });
      //bind event to that button
  $(document).on('click', '#record-complete', function () {
    game.finderFollow();
    $('#create-buttons').slideUp();
  })  
});
