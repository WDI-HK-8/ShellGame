'use strict';

//Game Class
function Game() {
  //variables
  this.cupArray = [];
  this.movesArray = [];

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

  this.start = function () {
    console.log("game Started!");
    this.createCups();
    this.move1 = new this.move(1,'right');

    console.log(this.cupArray);
    this.cupArray = this.executeMove(this.move1);
  }

}

$(document).ready(function() {


  var game = new Game();
  $('#game-start').click(function() {
    game.start();
    console.log(game.cupArray);
    $('.splash-screen').remove();
  });
});



