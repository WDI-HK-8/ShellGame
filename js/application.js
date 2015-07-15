'use strict';
//Global Variables
var speed = 600;

//Random Function
function rand(limit) {
  return Math.floor((Math.random()*(limit+1)));
}

//cup constructor
var Cup = function (name, hasBall) {
  this.name = name || "tempCup";
  this.hasBall = hasBall || false;
}

//Move constructor
var Move = function (position, direction) {
  this.position = position;
  this.direction = direction;
}

var executeMove = function (move, arr) {
  var cupMovePosition = move.position;
  var cupMoveDirection = move.direction;
  var cupAffectedPosition;
  var tempArr = [];
  //deep copy cupArray
  for (var i = 0; i < arr.length; i++) {
    tempArr.push(arr[i]);
  }
  if (cupMoveDirection == 'left') {
    if (cupMovePosition > 0) {
      cupAffectedPosition = move.position - 1;
    } else {
      cupAffectedPosition = 2;
    }
  } else if (cupMoveDirection == 'right') {
    if (cupMovePosition < 2) {
      cupAffectedPosition = move.position + 1;
    } else {
      cupAffectedPosition = 0;
    }
  }
  var tempCup = arr[cupMovePosition];
  tempArr[cupMovePosition] = tempArr[cupAffectedPosition];
  tempArr[cupAffectedPosition] = tempCup;
  return tempArr;
}

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
  var animateLength = 305;
  var direction;
  var reverse;
  var affectedCup;
  if (moveDirection == 'left') {
    if (movePosition === 0) {
      affectedCup = 2;
      direction = '+='
      animateLength = animateLength * 2;
    } else {
      affectedCup = movePosition - 1;
      direction = '-=';
    }
  } else if (moveDirection == 'right') {
    if (movePosition == 2) {
      affectedCup = 0;
      direction = '-='
      animateLength = animateLength * 2;
    } else {
      affectedCup = movePosition + 1;
      direction = '+=';
    }
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
  $('#communication').html('Find the Ball!');
  //bind event
  $('.cup').click(function () {
    $(this).children('.cup-overlay').animate({ 
      left: '+=50', top: '-=50'
    }, 200);
    $('.cup').unbind();
    var clickedIndex = $(this).index();
    if (clickedIndex === ballLocatedAt) {
      $('#communication').html('YOU WIN')
    } else {
      $('#communication').html('YOU LOSE')
    }
  });
}


//Game Class
function Game() {
  //variables
  this.cupArray = [];
  this.movesArray = [];
  this.startPosition;

  this.createCups = function () {
    //generate cups
    for (var i = 0; i < 3; i++) {
      this.cupArray.push(new Cup("cup" + eval('i+1'),false));
    }
  }

  //generate computer start position and 10 random moves
  this.generateComputer = function () {
    //generate start position
    var randomStartPosition = rand(2);
    this.cupArray[randomStartPosition].hasBall = true;
    this.startPosition = randomStartPosition;
    for (var i = 0; i < 10; i++) {
      //generate numbers for move
      var randomPosition = rand(2);
      var randomDirection = rand(1);
      var randomDirectionString
      randomDirection===0 ? randomDirectionString = 'left' : randomDirectionString = 'right';
      this.movesArray.push(new Move(randomPosition,randomDirectionString));
    }
  }

  //Starts the games, takes a boolean to get which opponent the user chose
  this.start = function (versusComputerPlayer) {
    this.createCups();
    $('button').prop("disabled",true);
    if (versusComputerPlayer) {
      this.versusComputer();
    } else {
      this.versusPlayer();
    }
  }

  //versus computer flow
  this.versusComputer = function () {
    //generate computer flow
    this.generateComputer();
    this.finderFollow();
  }

  this.finderFollow = function () {
    //Grab arrays to ensure scope
     var movesArray = this.movesArray;
     var cupArray = this.cupArray;
    //remove the balls inside the cup
    $('.ball').remove();
    //Change text on communication
    $('#communication').html("Click start when ready");
    $('#game-buttons').html('<button id="start-shuffle" class="btn btn-default">Start</button>')
    //showing initial position
    console.log(this.startPosition);
    console.log($('.cup')[this.startPosition]);
    $($('.cup')[this.startPosition]).append('<div class="ball"></div>');
    $($('.cup')[this.startPosition]).children('.cup-overlay').animate({ 
      left: '+=50', top: '-=50'
    }, 200);
    $($('.cup')[this.startPosition]).children('.cup-overlay').addClass('selected');

    //actually execute moves
    for (var i = 0; i < movesArray.length; i++) {
      cupArray = executeMove(movesArray[i], cupArray);
    }

    console.log(cupArray);

    $('#start-shuffle').click(function () {
      $('.selected').animate({ left: '-=50', top: '+=50' }, 200);
      //unbind event
      $(this).unbind();
      //call animateMoves
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

var animateUp = function () {
  $(this).children('.cup-overlay').animate({ 
   left: '+=50', top: '-=50'
  }, 200)
}

var animateDown = function () {
  $(this).children('.cup-overlay').animate({ 
    left: '-=50', top: '+=50'
  }, 200)
}


$(document).ready(function() {
  var game = new Game();
  $('#game-computer').click(function() {
    game.start(true);
  });
  $('#game-player').click(function() {
    game.start();
  });
});
