const shipFactory = function (length) {
  return {
    length: length,
    hitted: 0,

    hit() {
      this.hitted += 1;
    },

    isSunk() {
      return this.hitted === this.length;
    },
  }
}

const gameBoardFactory = function () {
  let emptyBoard = [];
  for (let i = 0; i < 100; i++) {
    emptyBoard.push(0);
  }

  return {
    board: emptyBoard,
    ships: {},
    placeShip(shipNumber, coordinateX, coordinateY, direction) {
      const shipSize = { 1: 5, 2: 4, 3: 3, 4: 3, 5: 2 };
      const newShip = shipFactory(shipSize[shipNumber]);

      if (direction === "row") {
        for (let i = 0; i < newShip.length; i++) {
          this.board[coordinateY * 10 + (coordinateX + i)] = shipNumber;
        }
      } else if (direction === "column") {
        for (let i = 0; i < newShip.length; i++) {
          this.board[(coordinateY + i) * 10 + coordinateX] = shipNumber;
        }
      }
      this.ships[shipNumber] = newShip;
    },
    receiveAttack(x, y) {
      x = parseInt(x);
      y = parseInt(y);
      let attackIndex = (y * 10) + x;
      let attackShipNumber = this.getMark(x, y);
      if (this.board[attackIndex] !== 0) {
        this.ships[attackShipNumber].hit();
        this.board[attackIndex] = "h";// hit
      } else {
        this.board[attackIndex] = "m";// miss
      }
      // this.printBoard();
      return this.board[attackIndex];
    },
    getMark(x, y) {
      return this.board[y * 10 + x];
    },
    isAllShipsSunk() {
      for (let shipNumber of Object.keys(this.ships)) {
        if (!this.ships[shipNumber].isSunk()) {
          return false;
        }
      }
      return true;
    },
    getBoard() {
      return this.board;
    },
    printBoard() {
      let result = "";
      for (let i = 0; i < 100; i++) {
        result += this.board[i];
        if ((i + 1) % 10 === 0) {
          result += "\n";
        } else {
          result += "  ";
        }
      }
      console.log(result);
    },
  }
}

const playerFactory = function (playerType, enemysBoard) {
  let play;
  if (playerType === "human") {
    play = function (x, y) {
      return this.enemysBoard.receiveAttack(x, y);
      // this.enemysBoard.printBoard();
    }
  } else if (playerType === "pc") {
    play = function () {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (this.enemysBoard.getMark(x, y) !== "h" && this.enemysBoard.getMark(x, y) !== "m") {
            let result = this.enemysBoard.receiveAttack(x, y);
            return {
              result: result,
              x: x,
              y: y
            }
          }
        }
      }
    }
  } else {
    throw new Error("playerType for playerFactory should be 'human' or 'pc'!!!");
  }

  const checkWin = function () {
    return enemysBoard.isAllShipsSunk();
  }

  return {
    enemysBoard: enemysBoard,
    play: play,
    checkWin: checkWin,
  }
}

export {
  shipFactory,
  gameBoardFactory,
  playerFactory,
}