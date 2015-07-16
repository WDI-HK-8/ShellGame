# Shell Game

  This is a game created for WDI program.  This is a simple game of following a ball

## Summary

  A player (or a computer) will choose where the ball will go and begin shuffling around the 3 cups.  After they are done shuffling
  the second player (or the player if against a computer) will see where the ball is orignally placed and when they are ready, the cups will begin shuffling.  After the cups are completed shuffling the finder will get a chance to choose a cup to open and see whether the ball is in there or not.

## Website Link

  Play the game here: http://shell-simulator.bitballoon.com/

## Installation

  - Clone the repository into your computer
  - Run [bower](http://www.bower.io) install in your terminal on the directory where the repository is located.
  - Start a webserver inside the directory and go to the webserver address OR open index.html.   (Webserver prefered)


## Basic Gameplay

  - Player 1 will select to play with another player or computer
  - Player 1 (or computer) will choose where to play the ball
  - Player 1 will shuffle the ball for 10 seconds
  - Player 2 will see the balls initial position
  - Once player 2 is ready the game will start shuffling the cups around according to player 1's movements
  - Player 2 will select where the ball ends up, if he/she gets it correct they win.
  - Every time the finder wins the shuffling gets faster until they lose

## Features

  - Play against a computer or another player!
  - Fully animated using [jQuery](http://www.jquery.com)!
  - Adjustable speed!  Open up js/application.js and modify the speed variable!
  - Change colors!  Open up js/application.js and modify the Color variable!

## Additional Information

### Bugs
    
  - Animation flashes during shuffled.  This is caused when I remove the styles on the animation making the element jump back to where it originally was.

### Future Features

 - Fully Responsive Design
 - Animations move in circular motion rather than straight through
 