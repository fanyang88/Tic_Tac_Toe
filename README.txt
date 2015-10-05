I used javascript implemented the minimax algorithm for the tic-tac-toe game.

Essence of the algorithm:
if we define if human win,  score = -1
		computer win, score =1

For computer:
   smart move: always to pick the maximum scoring move. 
   dummy move: always to pick the mininum scoring move.

For human:
   smart move: always to pick the mininum scoring move. 
   dummy move: always to pick the maximum scoring move.

To force human to lose, we just need to make sure pc is always pick the maximum scoring move
while we assume human also plays smart that he always pick the mininum scoring move. 
Based on that pc predict the best move.

To force human to win, we just need to make sure pc is always pick the mininum scoring move
while we assume human also plays dummy that he always pick the maximum scoring move. 
Based on that pc predict the worse move.



files includes:

- index.html
- ttt.js
- style.css


