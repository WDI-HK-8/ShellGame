'use strict';
$(document).ready(function() {
  //cup holder(har har har)
  //cup functions

  function Cup(name, position, hasBall) {
    this.name = name;
    this.position = position;
    this.hasBall = hasBall || false;
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
  var cupSelected = prompt();
  //set cup selected
  cupArray[cupSelected].hasBall = true;
});
