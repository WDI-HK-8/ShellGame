'use strict';
$(document).ready(function() {
  //cup holder(har har har)
  var cupArray = [];
  //cup functions

  function cup(name, position, hasBall) {
    this.name = name;
    this.position = position;
    this.hasBall = hasBall;
  }
  //generate cups
  for (var i = 0; i < 3; i++) {
    cupArray.push(new cup("cup" + eval('i+1'), i, false));
  }
  console.log(cupArray);
  //Pick a cup
  console.log("Where to insert ball");
  var cupSelected = prompt();
  //set cup selected
  cupArray[cupSelected].hasBall = true;
});
