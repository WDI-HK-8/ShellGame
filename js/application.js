'use strict';

var rand = function(limit) {
  return Math.floor((Math.random()*(limit+1)));
}

//------------------------------------------------------------
// CUP Class
//------------------------------------------------------------
function Cup(name, hasBall) {
  this.name    = name    || "tempCup";
  this.hasBall = hasBall || false;
}

//------------------------------------------------------------
// MOVE Class
//------------------------------------------------------------
function Move (position, direction) {
  this.position  = position;
  this.direction = direction;
}

//------------------------------------------------------------
// GAME Class
//------------------------------------------------------------
function Game() {
  this.numCups    = 3;
  this.cupArray   = [];
  this.movesArray = [];
}

Game.prototype.createCups = function () {
  for (var i=0; i < this.numCups; i++) {
    this.cupArray.push(new Cup("cup" + (i+1)));
  }
  console.log('Cups created:', this.cupArray)
}

Game.prototype.cloneCups = function (){
  var newCupArray = [];

  this.cupArray.forEach(function(cup){
    newCupArray.push(cup);
  })

  return newCupArray;
}

Game.prototype.executeMove = function (move) {
  var newPosition;
  var newCupArray = this.cloneCups();

  switch (move.direction) {
    case 'left':
      if (move.position > 0) { newPosition = move.position - 1; }
      else {                   newPosition = 2; }
      break;
    case 'right':
      if (move.position < 2) { newPosition = move.position + 1; }
      else {                   newPosition = 0; }
      break;
  }

  var tempCup = this.cupArray[move.position];
  newCupArray[move.position] = newCupArray[newPosition];
  newCupArray[newPosition]   = tempCup;

  return newCupArray;
}

Game.prototype.generateComputer = function (numMoves) {
  var numMoves = numMoves || 10;
  var direction;

  for (var i=0; i < numMoves; i++) {
    rand(1) === 0 ? direction = 'left' : direction = 'right';
    this.movesArray.push(new Move(rand(2), direction));
  }
}

Game.prototype.start = function () {
  console.log("Game Started!");
  this.createCups();
  this.cupArray = this.executeMove(new Move(1, 'right'));
}

var game = new Game();

$(document).ready(function() {

  $('#game-start').click(function() {
    game.start();
    game.generateComputer(10);
    $('.splash-screen').remove();
  });
});
