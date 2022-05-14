import { Game } from "./gameController";
import Dom from "./dom";

import "./style.css";

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  game = new Game()
  game.start();
});

var game = new Game();
game.start();
Dom.setShipsArea();