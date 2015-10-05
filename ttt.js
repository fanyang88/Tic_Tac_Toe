//encapsulate like jquery
(function(window, undefined) {
    
    
    ///////////////////////////////////////////////////
    //general classes
    //////////////////////////////////////////////////
    var Controller = function(val) {
        this.version = val || 2;  //default is 2
        this.view = null;
        this.order= 0; 
        this.human = 1;  
        this.computer = 2;
        this.square= [0, 0, 0, 0, 0, 0, 0, 0, 0];
    };

    var View = function() {
        this.markers = ['X', 'O'];
        this.statusTxt = document.getElementById('status');
        this.square =  document.getElementById('board').getElementsByTagName('div');
    };

    var State = function(order, index, status){
        this.order= order;
        this.index= index;
        this.status = 2;  //default is 2
    };

    ///////////////////////////////////////////////////////
    //main object
    ///////////////////////////////////////////////////////

    var game = new Controller();
    var view  = new View();


    /////////////////////////////////////////////
    // - Controller methods
    //////////////////////////////////////////////
    Controller.prototype.setGame = function(view, version) {
            this.view = view;
            this.version = version;
            for(var i=0;i<this.square.length;i++)
                this.square[i]=0;
            this.order = Math.floor(Math.random() * 2);   //decide who start first, 1: pc, 0: human           
    };

    Controller.prototype.viewUpdate = function(status) {
        this.order = (this.order + 1) % 2;
        if(this.order === 1 ) {
            if (status === 2)  this.pcMove();
        }       
    };
    
    Controller.prototype.humanMove = function(index) {
        if (this.square[index] == 0 && this.order=== 0 ) {  //it's human's turn  
            this.square[index] = 1; 
            var status =2;
            if(this.isWin(1, this.square))   status = -1;
            else if(this.isDraw(this.square))  status =0;
            else {}
            //console.log("humanmove:"+ status);
            var state = new State(this.order, index, status);
            state.status = status;
            return state;
        } 
        else 
            return null;
    };

    Controller.prototype.pcMove = function() {
        if (this.order ===1)  //it's pc's turn, caculate best move using minimax 
         {
            var move = this.minimax(this.square);  // best move for pc
            this.square[move] = 2; 
            var status =2;
            if(this.isWin(2, this.square))  status =1;
            else if(this.isDraw(this.square))  status =0;
            else {}
           // console.log("pcmove:"+ status);
            this.view.update(this.order, move, status);
        }
    };

     Controller.prototype.isWinorDraw = function(board){
        if(this.isWin(2, board))  return 1; //pc wins
        else if(this.isWin(1, board)) return -1; //human wins
        else if(this.isDraw(board)) return 0; //is Draw
        else return 2; //none of the above
     };
     
     Controller.prototype.isWin = function(player, board) {
        if ((board[0] == player && board[1] == player && board[2] == player) ||(board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||(board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||(board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||(board[2] == player && board[4] == player && board[6] == player)
            ) 
            return true;
        else 
            return false;
    };

    Controller.prototype.isDraw = function(board) {
        for (var i = 0; i < board.length; i++) {
            if (board[i] == 0)  
                return false; 
        }
        return true;
    };

///////////////////////////////////////////////////////////////
// - minimax algorithm
///////////////////////////////////////////////////////////////        
Controller.prototype.minimax = function(board) {
        var minimum = Number.MAX_VALUE;
        var maximum = Number.MAX_VALUE*(-1);
        console.log("version:" + this.version);
        var bestmove = 0;
        for (var i = 0; i < board.length; i++) {
            if (board[i] == 0) {
                board[i] = this.computer;

                if(this.version===2)  //smart version
                {
                    var move = this.getMin(board, this.computer, this.human);
                    if (move > maximum) {
                        maximum = move;
                        bestmove = i;
                    }
                }
                else{   //version ==1 dummy version
                    var move = this.getMax(board, this.human, this.computer);
                    if (move < minimum) {
                        minimum = move;
                        bestmove = i;
                    }
                }
                board[i]=0;
            }
        }
        return bestmove;
    };

    Controller.prototype.getMin = function(board, player1, player2) {
        var check = this.isWinorDraw(board);
        if(check !== 2)  return check;  //either draw or anyone wins
        else {
            var minimum = Number.MAX_VALUE;
            var move = 0;
            for (var i = 0; i < board.length; i++) {
                if (board[i] == 0) {
                    board[i] = player2;
                    var move_value = this.getMax(board, player1, player2);
                    if (move_value < minimum) {
                        minimum = move_value;
                        move = i;
                    }
                    board[i] = 0;
                }
            }
            return minimum;
        }
    };

    Controller.prototype.getMax = function(board, player1, player2) {
        var check = this.isWinorDraw(board);
        if(check !== 2)  return check;  
        else {
            var maximum = Number.MAX_VALUE*(-1);
            var move = 0;
            for (var i = 0; i < board.length; i++) {
                 if (board[i] == 0) {
                    board[i] = player1; 
                    var move_value = this.getMin(board, player1, player2);
                    if (move_value > maximum) {
                        maximum = move_value;
                        move = i;
                    }
                    board[i]=0;
                }
            }
            return maximum;
        }
    };

    /////////////////////////////////////////////////////////
    //- View methods
    ////////////////////////////////////////////////////////
    
   View.prototype.addListeners = function(handler) {
        var self = this;
        for (var i = 0; i < this.square.length; i++) {
            this.square[i].addEventListener('click', (function() {
                var index = i;
                return function(event) {
                    var state = handler(index);
                   // console.log("listen status:"+ state.status);
                    if (state) 
                        self.update(state.order, state.index, state.status);
                }
            })());
        }
    };
    
    //remove event listener when draw or win happens
    View.prototype.removeListeners = function() {
         for (var i = 0; i < this.square.length; i++) {
            var tile = this.square[i].cloneNode(true);
            this.square[i].parentNode.replaceChild(tile, this.square[i]);
         }
    };

    // update view
    View.prototype.update = function(order, index, status) {
      //  console.log("update:"+ status);
        this.square[index].textContent = this.markers[order];
        if(status !== 2)  //either a draw or some one win
        {
            if(status === 1) //pc wins
                this.statusTxt.textContent = "Computer Wins!";
            else if(status === -1) //human wins
                this.statusTxt.textContent = "You Win!";
            else 
                this.statusTxt.textContent = "Draw!";
            this.statusTxt.className = ''; 
            this.removeListeners(this.square);
        }
        else {
            var order = order;            
            order = (order + 1) % 2;
        }
        this.onUpdate(status);
    };

    View.prototype.clean = function(version){
        if(version === 2)
            this.statusTxt.textContent = "Easy to Lose";
        else
            this.statusTxt.textContent = "Easy to Win";
        this.statusTxt.className = '';
        for (var i = 0; i < this.square.length; i++) 
             this.square[i].textContent = ' ';
    }

    ///////////////////////////////////////
    // button to start game
    //////////////////////////////////////
    document.getElementById("start_win").addEventListener("click", function(){ 
         game.setGame(view, 1);
         game.view.clean(game.version);
         game.view.addListeners(game.humanMove.bind(game));
         game.view.onUpdate = game.viewUpdate.bind(game);
         game.pcMove();
        }
    );

    document.getElementById("start_lose").addEventListener("click", function(){ 
         game.setGame(view, 2);
         game.view.clean(game.version);
         game.view.addListeners(game.humanMove.bind(game));
         game.view.onUpdate = game.viewUpdate.bind(game);
         game.pcMove();
        }
    );
})(window);