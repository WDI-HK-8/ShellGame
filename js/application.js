'use strict';

function rand(limit) {
  return Math.floor((Math.random()*(limit+1)));
}

//Game Class
function Game() {
  //variables
  this.cupArray = [];
  this.movesArray = [];
  //cup constructor

  this.Cup = function (name, hasBall) {
    this.name = name || "tempCup";
    this.hasBall = hasBall || false;
  }
  this.createCups = function () {
    //generate cups
    for (var i = 0; i < 3; i++) {
      this.cupArray.push(new this.Cup("cup" + eval('i+1'), false));
    }
  }

  //Move constructor
  this.Move = function (position, direction) {
    this.position = position;
    this.direction = direction;
  }

  //methods
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
    var tempCup = this.cupArray[cupMovePosition];
    tempArr[cupMovePosition] = tempArr[cupAffectedPosition];
    tempArr[cupAffectedPosition] = tempCup;
    return tempArr;
  }

  this.generateComputer = function () {
    for (var i = 0; i < 10; i++) {
      //generate numbers for move
      var randomPosition = rand(2);
      var randomDirection = rand(1);
      var randomDirectionString
      randomDirection===0 ? randomDirectionString = 'left' : randomDirectionString = 'right';
      this.movesArray.push(new this.Move(randomPosition, randomDirectionString));
    }
  }

  this.start = function () {
    console.log("game Started!");
    this.createCups();
    this.move1 = new this.Move(1, 'right');
    console.log(this.cupArray);
    this.cupArray = this.executeMove(this.move1);
  }
}

$(document).ready(function() {
  var game = new Game();
  $('#game-start').click(function() {
    game.start();
    console.log(game.cupArray);
    game.generateComputer();
    $('.splash-screen').remove();
    console.log(game.movesArray);
  });
});

