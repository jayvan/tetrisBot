requirejs(['pieces'], function(PIECES) {
  BOARD_WIDTH = 10;
  BOARD_HEIGHT = 24;

  var Game = function() {
    this.cohesionFactor = 0.5;
    this.gapFactor = -5;
    this.heightFactor = -1;
    this.clearFactor = 4;
    this.clears = 0;
    this.speed = 500;
    this.lastResult = null;
    this.board = new Array(BOARD_HEIGHT);
    for (var y = 0; y < this.board.length; y++) {
      this.board[y] = new Array(BOARD_WIDTH);
    }

    this.pieceQueue = [];
  };

  Game.prototype.resetBoard = function() {
    this.clears = 0;
    this.board = new Array(BOARD_HEIGHT);
    for (var y = 0; y < this.board.length; y++) {
      this.board[y] = new Array(BOARD_WIDTH);
    }
  };

  // Returns a deep copy of the board
  Game.prototype.getBoard = function() {
    return JSON.parse(JSON.stringify(this.board));
  };

  Game.prototype.simulate = function() {
    var self = this;
    self.placeNextPiece();
    self.draw();

    if (self.isOver()) {
      window.setTimeout(function() {
        self.resetBoard();
        self.simulate();
      }, 2000);
    } else {
      setTimeout(function() {
        self.simulate();
      }, self.speed);
    }
  };

  Game.prototype.draw = function() {
    var score = document.getElementById('score');
    score.innerHTML = this.clears;

    if (this.lastResult) {
      var clears = document.getElementById('last-clears');
      clears.innerHTML = this.lastResult.clears;

      var cohesion = document.getElementById('last-cohesion');
      cohesion.innerHTML = this.lastResult.cohesion;

      var height = document.getElementById('last-height');
      height.innerHTML = this.lastResult.height;

      var covered = document.getElementById('last-gaps');
      covered.innerHTML = this.lastResult.covered;

      var score = document.getElementById('last-score');
      score.innerHTML = this.lastResult.score;
    }

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.canvas.width = BOARD_WIDTH * 25;
    ctx.canvas.height = BOARD_HEIGHT * 25;

    for (var y = 0; y < BOARD_HEIGHT; y++) {
      for (var x = 0; x < BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.fillStyle = this.board[y][x] || 'white';
        ctx.strokeStyle = 'black';
        ctx.rect(x * 25, y * 25, 25,25);
        ctx.fill();
        ctx.stroke();
      }
    }
  };

  Game.prototype.isOver = function() {
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < BOARD_WIDTH; x++) {
        if (this.board[y][x]) return true;
      }
    }
    return false;
  };

  Game.prototype.placeNextPiece = function() {
    // Grab a new bag of pieces of we're out
    if (this.pieceQueue.length == 0) {
      this.pieceQueue = PIECES.getRandomBag();
    }

    var piece = PIECES.getByLetter(this.pieceQueue.shift());

    this.placeBestPosition(piece);
  };

  // Try all of the given pieces rotations in all columns to find the best move
  // and update the grid to take the move
  Game.prototype.placeBestPosition = function(piece) {
    var bestScore = -Number.MAX_VALUE;
    var bestResult = undefined;

    for (var rot = 0; rot < piece.rotations.length; rot++) {
      var rotation = piece.rotations[rot];
      for (var x = 0; x < BOARD_WIDTH - rotation.width + 1; x++) {
        var dropResult = this.simulateDrop(rotation, x, piece.color);

        if (dropResult.score > bestScore) {
          bestScore = dropResult.score;
          bestResult = dropResult;
        }
      }
    }

    this.board = bestResult.board;
    this.clears += bestResult.clears;
    this.lastResult = bestResult;
  };

  Game.prototype.getScoreFor = function(dropResult) {
    return dropResult.cohesion * this.cohesionFactor +
           dropResult.covered * this.gapFactor +
           dropResult.height * this.heightFactor +
           dropResult.clears * this.clearFactor;
  };

  // Determine the new board setup and some values used by the scoring function given
  // a pieces rotation and the column to drop it in
  Game.prototype.simulateDrop = function(rot, column, color) {
    var newBoard = this.getBoard();
    var depth = -1;
    var collision = false;
    var clears = 0;
    var cohesion = 0;
    var height = 0;
    var covered = 0;

    // Find level of collision
    while(!collision) {
      depth++;
      for (var y = 0; y < 4; y++) {
        for (var x = 0; x < rot.width; x++) {
          // Check if we bottomed out or collided
          if (depth + y >= BOARD_HEIGHT || (newBoard[depth + y][column + x] && rot.grid[y][x])) {
            collision = true;
            break;
          }
        }
        if (collision) break;
      }
    }

    depth--; //Return to last acceptable depth

    // Place piece in grid & calculate cohesion
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < rot.width; x++) {
        if (rot.grid[y][x]) {

          // Piece to left
          if (column + x == 0 || newBoard[depth + y][column + x - 1]) {
            cohesion++;
          }

          // Piece to right
          if (column + x + 1 == BOARD_WIDTH || newBoard[depth + y][column + x + 1]) {
            cohesion++;
          }

          // Piece beneath
          if (depth + y + 1 == BOARD_HEIGHT || newBoard[depth + y + 1][column + x]) {
            cohesion++;
          }

          newBoard[depth + y][column + x] = color;
        }
      }
    }

    // Clear rows
    for (var y = 0; y < 4; y++) {
      var clear = true;
      for (var x = 0; x < BOARD_WIDTH; x++) {
        if (newBoard[depth + y][x] == null) {
          clear = false;
          break;
        }
      }

      if (clear) {
        clears++;
        newBoard.splice(depth + y, 1);
        newBoard.unshift(new Array(BOARD_WIDTH));
      }
    }

    // Determine the height of the pieces
    for (var y = 0; y < BOARD_HEIGHT; y++) {
      for (var x = 0; x < BOARD_WIDTH; x++) {
        if (newBoard[y][x]) {
          height = BOARD_HEIGHT - y;;
          break;
        }
      }
      if (height != 0) break;
    }

    // Determine the # of 'covered' pieces
    for (var y = 0; y < BOARD_HEIGHT - 1; y++) {
      for (var x = 0; x < BOARD_WIDTH; x++) {
        if (newBoard[y][x] && !newBoard[y + 1][x]) {
          covered++;
        }
      }
    }

    var result = {
      board: newBoard,
      clears: clears,
      cohesion: cohesion,
      height: height,
      covered: covered
    };

    result.score = this.getScoreFor(result);

    return result;
  };

  var myGame = new Game();
  myGame.simulate();

  document.getElementById('cohesion').onchange = function(e) {
    myGame.cohesionFactor = parseInt(e.srcElement.value, 10) || myGame.cohesionFactor;
  };

  document.getElementById('gap').onchange = function(e) {
    myGame.gapFactor = parseInt(e.srcElement.value, 10) || myGame.gapFactor;
  };

  document.getElementById('height').onchange = function(e) {
    myGame.heightFactor = parseInt(e.srcElement.value, 10) || myGame.heightFactor;
  };

  document.getElementById('clears').onchange = function(e) {
    myGame.clearFactor = parseInt(e.srcElement.value, 10) || myGame.clearFactor;
  };

  document.getElementById('slow').onclick = function(e) {
    myGame.speed = 500;
  };

  document.getElementById('medium').onclick = function(e) {
    myGame.speed = 250;
  };

  document.getElementById('fast').onclick = function(e) {
    myGame.speed = 100;
  };

  document.getElementById('turbo').onclick = function(e) {
    myGame.speed = 1;
  };
});
