$(document).ready(function() {
  //cup holder(har har har)
  var cupArray = [];
  //Holder for moves objects
  var movesArray = [];



  //cup functions
  function cup(name,hasBall) {
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
  
  //Move constructor
  function move(position,direction) {
    this.position = position;
    this.direction = direction;
  }

  function executeMove(move, arr) {
    var cupMovePosition = move.position;
    var cupMoveDirection = move.direction;
    var cupAffectedPosition;
    var tempArr;
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
    cupArray[cupMovePosition] = cupArray[cupAffectedPosition];
    cupArray[cupAffectedPosition] = tempCup;
  }



  //generate cups
  for (var i = 0; i < 3; i++) {
    cupArray.push(new cup("cup" + eval('i+1'),false));
  }

  console.log(cupArray);

  //Pick a cup
  console.log("Where to insert ball");

  var move1 = new move(0,'left');
  var move2 = new move(1,'left');
  var move3 = new move(2,'right');
  var move4 = new move(1,'right');
  var cupSelected = prompt();
  //set cup selected
  cupArray[cupSelected].hasBall = true;
  executeMove(move1,cupArray);



});