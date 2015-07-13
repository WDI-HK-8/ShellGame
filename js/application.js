'use strict';
$(document).ready(function() {
  //cup holder(har har har)
  //cup functions

  function Cup(name, position, hasBall) {
    this.name = name;
    this.position = position;
    this.hasBall = hasBall || false;
  };

  var cupArray = [];
  //Holder for moves objects
  var movesArray = [];
  
  //Move constructor
  function Move(position, direction) {
    this.position = position;
    this.direction = direction;
  }

  function executeMove(move, arr) {
    var cupMovePosition = move.position;
    var cupMoveDirection = move.direction;
    var cupAffectedPosition;
    var tempArr = [];
    //deep copy cupArray
    for (var i = 0; i < cupArray.length; i++) {
      tempArr.push(cupArray[i]);
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
    tempCup = cupArray[cupMovePosition];
    tempArr[cupMovePosition] = tempArr[cupAffectedPosition];
    tempArr[cupAffectedPosition] = tempCup;

    return tempArr;
  }

  //generate cups
  // var cupArray = [];
  // for (var i = 0; i < 3; i++) {
  //   cupArray.push(new Cup("cup" + eval('i+1'), i));
  // }
  var cupArray = [1,1,1].map(function(val, index){ 
   return new Cup('cup'+(index+1), index)
  })

  console.log(cupArray);
  //Pick a cup
  console.log("Where to insert ball");
  //set cup selected
  var cupSelected = prompt();

  var move1 = new Move(0,'left');
  var move2 = new Move(1,'left');
  var move3 = new Move(2,'right');
  var move4 = new Move(1,'right');
  var cupSelected = prompt();
  //set cup selected
  cupArray[cupSelected].hasBall = true;
  executeMove(move1,cupArray);
});

