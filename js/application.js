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
  this.cup = function (name, hasBall) {
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
  this.move = function (position, direction) {
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
    this.animateMoves();
    
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
    $($('.cup')[this.startPosition]).append('<div class="ball"></div>');
    // $($('.cup')[this.startPosition]).children('.cup-overlay').animate({ 
    //   left: '+=50', top: '-=50'
    // }, 200);
    $($('.cup')[this.startPosition]).children('.cup-overlay').addClass('selected');

    $('#start-shuffle').click(function () {
      $('.selected').animate({ left: '-=50', top: '+=50' }, 200);
      //unbind event
      $(this).unbind();
      //call animateMoves ( TO BE COMPLETED )
    });
  }
  this.animateMoves = function () {
    this.movesArray.forEach(function (element) {
      console.log(element.position + element.direction);
      var currentCup = element.position;
      var currentDirection = element.direction;
      var animateLength = 305;
      var animateDirection = '-='
      var reverseDirection = '+='
      var affectedCup;
      if (currentDirection == 'left') {
        if (currentCup > 0) {
          affectedCup = currentCup - 1;
        } else {
          affectedCup = 2;
          animateLength = 610;
          animateDirection = '+='
          reverseDirection = '-='
        }
      } else if (currentDirection == 'right') {
        if (currentCup < 2) {
          affectedCup = currentCup + 1;
          animateDirection = '+='
          reverseDirection = '-='
        } else {
          affectedCup = 0;
          animateLength = 610;
        }
      }
      $('.cup:nth-child(' + eval(currentCup+1) + ')').animate({ left: animateDirection+animateLength}, 1000,
        complete: function() { $this.removeAttr('style');
      });
      //Reverse animation
      $('.cup:nth-child(' + eval(affectedCup+1) + ')').animate({ left: reverseDirection+animateLength}, 1000,
        complete: function() { $this.removeAttr('style'); 
      });
    });


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