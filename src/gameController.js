import { gameBoardFactory, playerFactory } from "./factories";
import Dom from "./dom";

export class Game {
  constructor() {
    Dom.createBoards();
    Dom.setButtons(this.start, this.startPlace);
  }

  startPlace = () => {
    Dom.createBoards();
    Dom.showShipsArea();
    Dom.setShipsArea(this.start);
  }

  start = (playerPlacedList) => {
    Dom.cleanAllSpaceMarks();
    Dom.showPcArea();
    this.player = playerFactory("human", gameBoardFactory());
    this.pc = playerFactory("pc", gameBoardFactory());
    this.stage = "playerTurn";
    this.placeTheShips(playerPlacedList);
    Dom.setPlayerAttack(this.playerAttack);
    Dom.setMessage("Your turn");
  }

  playerAttack = (e) => {
    if (this.stage !== "playerTurn") return;
    const targetX = e.target.dataset.x;
    const targetY = e.target.dataset.y;
    const result = this.player.play(targetX, targetY);
    Dom.updatePcBoard(result, targetX, targetY);
    if (this.player.checkWin()) {
      this.stage = "playerWin";
      Dom.setMessage("Player Win!!!!");
    } else {
      this.stage = "pcTurn";
      Dom.setMessage("PC turn");
      this.pcAttack();
    }

  }

  pcAttack() {
    const { result, x, y } = this.pc.play();
    Dom.updatePlayerBoard(result, x, y);
    if (this.pc.checkWin()) {
      this.stage = "pcWin";
      Dom.setMessage("PC Win!!!!");
    } else {
      this.stage = "playerTurn";
      Dom.setMessage("Your turn");
    }
  }

  placeTheShips(playerPlacedList) {
    this.player.enemysBoard.placeShip(1, 0, 0, "row");
    this.player.enemysBoard.placeShip(2, 0, 2, "column");
    this.player.enemysBoard.placeShip(3, 2, 2, "column");
    this.player.enemysBoard.placeShip(4, 4, 2, "column");
    this.player.enemysBoard.placeShip(5, 7, 2, "column");
    // this.player.enemysBoard.printBoard();

    // this.pc.enemysBoard.placeShip(1, 0, 0, "row");
    // this.pc.enemysBoard.placeShip(2, 0, 2, "column");
    // this.pc.enemysBoard.placeShip(3, 2, 2, "column");
    // this.pc.enemysBoard.placeShip(4, 4, 2, "column");
    // this.pc.enemysBoard.placeShip(5, 7, 2, "column");
    // this.pc.enemysBoard.printBoard();
    playerPlacedList.forEach(ship => {
      this.pc.enemysBoard.placeShip(ship.shipNumber, ship.x, ship.y, ship.direction);
    });
  }
}