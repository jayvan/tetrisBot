define(function() {
  var PIECES = {
    I: {
      color: 'cyan',
      rotations:[
      {
        width: 4,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [0,0,0,0],
               [1,1,1,1]]
      },
      {
        width: 1,
        grid: [[1,0,0,0],
               [1,0,0,0],
               [1,0,0,0],
               [1,0,0,0]]
      }]
    },
    J: {
      color: 'blue',
      rotations: [
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,0,0,0],
               [1,1,1,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [1,1,0,0],
               [1,0,0,0],
               [1,0,0,0]]
      },
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,1,1,0],
               [0,0,1,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [0,1,0,0],
               [0,1,0,0],
               [1,1,0,0]]
      }]
    },
    L: {
      color: 'orange',
      rotations: [
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [0,0,1,0],
               [1,1,1,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [1,0,0,0],
               [1,0,0,0],
               [1,1,0,0]]
      },
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,1,1,0],
               [1,0,0,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [1,1,0,0],
               [0,1,0,0],
               [0,1,0,0]]
      }]
    },
    O: {
      color: 'yellow',
      rotations: [
      {
        width: 2,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,1,0,0],
               [1,1,0,0]]
      }]
    },
    S: {
      color: 'lime',
      rotations: [
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [0,1,1,0],
               [1,1,0,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [1,0,0,0],
               [1,1,0,0],
               [0,1,0,0]]
      }]
    },
    T: {
      color: 'darkMagenta',
      rotations: [
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,1,1,0],
               [0,1,0,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [0,1,0,0],
               [1,1,0,0],
               [0,1,0,0]]
      },
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [0,1,0,0],
               [1,1,1,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [1,0,0,0],
               [1,1,0,0],
               [1,0,0,0]]
      }]
    },
    Z: {
      color: 'red',
      rotations: [
      {
        width: 3,
        grid: [[0,0,0,0],
               [0,0,0,0],
               [1,1,0,0],
               [0,1,1,0]]
      },
      {
        width: 2,
        grid: [[0,0,0,0],
               [0,1,0,0],
               [1,1,0,0],
               [1,0,0,0]]
      }]
    }
  };

  var LETTERS = Object.keys(PIECES);

  var exports = {};

  // Return a permutation of all the tetris pieces
  exports.getRandomBag = function() {
    var letterOrder = LETTERS.slice();
    letterOrder.sort(function() { return Math.random() - 0.5; });
    return letterOrder;
  };

  exports.getByLetter = function(letter) {
    console.log(letter, LETTERS[letter]);
    return PIECES[letter];
  };

  return exports;
});
