function rand(limit) {
  return Math.floor((Math.random()*(limit+1)));
}

//Game Class
function Game() {
  //variables
  this.cupArray = [];
  this.movesArray = [];
  this.startPosition;

  //cup constructor
  this.cup = function (name,hasBall) {
    this.name = name || "tempCup";
    this.hasBall = hasBall || false;
    this.getKeyFromValue = function(value) {
      for(var keys in this) {
        if (this[keys]==value) {
          return this;
        }
      }
    }
  }

  this.createCups = function () {
    //generate cups
    for (var i = 0; i < 3; i++) {
      this.cupArray.push(new this.cup("cup" + eval('i+1'),false));
    }
  }

  //Move constructor
  this.move = function (position,direction) {
    this.position = position;
    this.direction = direction;
  }

  //methods
  //function that takes a move and executes it and returns
  //the move generated
  this.executeMove = function (move) {
    var cupMovePosition = move.position;
    var cupMoveDirection = move.direction;
    var cupAffectedPosition;
    var tempArr = [];
    //deep copy cupArray
    for (var i = 0; i < this.cupArray.length; i++) {
      tempArr.push(this.cupArray[i]);
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
    tempCup = this.cupArray[cupMovePosition];
    tempArr[cupMovePosition] = tempArr[cupAffectedPosition];
    tempArr[cupAffectedPosition] = tempCup;
    return tempArr;
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
      this.movesArray.push(new this.move(randomPosition,randomDirectionString));
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

  //Versus player function 
  this.versusPlayer = function () {
    $('.cup').bind('mouseenter',animateUp);
    $('.cup').bind('mouseleave',animateDown);
  }

  //versus computer flow
  this.versusComputer = function () {
    //generate computer flow
    this.generateComputer();
    
    this.finderFollow();
  }

  this.finderFollow = function () {
    //remove the balls inside the cup
    $('.ball').remove();
    //Change text on communication
    $('#communication').html("Click start when ready");
    $('#game-buttons').html('<button id="start-shuffle" class="btn btn-default">Start</button>')
    //showing initial position
    console.log(this.startPosition);
    console.log($('.cup')[this.startPosition]);
  }
  this.animateMoves = function () {
  }

}
var animateUp = function() {
  console.log("hover");
  $(this).children('.cup-overlay').animate({ 
   left: '+=50', top: '-=50'
  }, 200)
}
var animateDown = function() {
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