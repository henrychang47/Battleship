const playerBoardElement = document.querySelector("#playerBoard");
const pcBoardElement = document.querySelector("#pcBoard");
const messageBox = document.querySelector("#messageBox");
const pcArea = document.querySelector("#pcArea");
const shipsArea = document.querySelector("#shipsArea");


const createBoards = function () {
  let html = "";
  for (let i = 0; i < 100; i++) {
    const grid = `<div class="gameBoard-grid unknown" data-x=${i % 10} data-y=${Math.floor(i / 10)}></div>`
    html += grid;
  }

  playerBoardElement.innerHTML = html;
  pcBoardElement.innerHTML = html;
}

const setPlayerAttack = function (playerAttack) {
  const grids = pcBoardElement.querySelectorAll(".gameBoard-grid");
  grids.forEach(grid => {
    grid.addEventListener('click', (e) => {
      if (!e.target.classList.contains("unknown")) return;
      playerAttack(e)
    });
  });
}

const updatePcBoard = function (result, x, y) {
  const targetGrid = pcBoardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`)
  if (result === "h") {
    targetGrid.textContent = "x";
    targetGrid.classList.remove("unknown");
    targetGrid.classList.add("hit");
  } else if (result === "m") {
    targetGrid.textContent = "";
    targetGrid.classList.remove("unknown");
    targetGrid.classList.add("miss");
  }
}

const updatePlayerBoard = function (result, x, y) {
  const targetGrid = playerBoardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`)
  if (result === "h") {
    targetGrid.textContent = "x";
    targetGrid.classList.remove("unknown");
    targetGrid.classList.add("hit");
  } else if (result === "m") {
    targetGrid.textContent = "";
    targetGrid.classList.remove("unknown");
    targetGrid.classList.add("miss");
  }
}

const setMessage = function (msg) {
  messageBox.textContent = msg;
}

const showShipsArea = function () {
  pcArea.style.display = "none";
  shipsArea.style.display = "block";

}

const setShipsArea = function () {
  const ship = shipsArea.querySelector(".ship");
  const shipNumberDisplay = shipsArea.querySelector(".shipNumber");
  const prevButton = shipsArea.querySelector(".prevButton");
  const rotateButton = shipsArea.querySelector(".rotateButton");
  const nextButton = shipsArea.querySelector(".nextButton");
  prevButton.addEventListener("click", prevShip);
  rotateButton.addEventListener("click", rotateShip);
  nextButton.addEventListener("click", nextShip);

  const shipsList = [
    { length: 5, direction: "row", placed: false },
    { length: 4, direction: "row", placed: false },
    { length: 3, direction: "row", placed: false },
    { length: 3, direction: "row", placed: false },
    { length: 2, direction: "row", placed: false }
  ]
  let currentShipIndex = 0;
  let checkingGrids = [];

  previewShip(shipsList[currentShipIndex].length, shipsList[currentShipIndex].placed);

  const playersGrids = playerBoardElement.querySelectorAll(".gameBoard-grid");
  playersGrids.forEach(grid => grid.addEventListener("mouseenter", checkCanPlace));

  function checkCanPlace(e) {
    const targetX = parseInt(e.target.dataset.x);
    const targetY = parseInt(e.target.dataset.y);
    checkingGrids = [];

    if (shipsList[currentShipIndex].direction === "row") {
      for (let i = 0; i < shipsList[currentShipIndex].length; i++) {
        checkingGrids.push(getGrid(targetX + i, targetY));
      }
    } else if (shipsList[currentShipIndex].direction === "column") {
      for (let i = 0; i < shipsList[currentShipIndex].length; i++) {
        checkingGrids.push(getGrid(targetX, targetY + i));
      }
    }

    if (checkingGrids.includes(null)) {
      checkingGrids[0].classList.add("canNotPlace");
      checkingGrids[0].addEventListener("mouseleave", () => {
        checkingGrids[0].classList.remove("canNotPlace");
      }, { once: true });
    } else {
      checkingGrids.forEach(grid => {
        grid.classList.add("canPlace")
      });
      checkingGrids[0].addEventListener("click", place);
      checkingGrids[0].addEventListener("mouseleave", () => {
        checkingGrids[0].removeEventListener("click", place);
        checkingGrids.forEach(grid => {
          grid.classList.remove("canPlace");
        });
      }, { once: true });
    }
  }

  function place(e) {
    const [targetX, targetY] = getCoord(e.target);
    const length = shipsList[currentShipIndex].length;
    // console.log(targetX, targetY, length);
  }

  function getGrid(x, y) {
    return playerBoardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }

  function getCoord(grid) {
    const x = parseInt(grid.dataset.x);
    const y = parseInt(grid.dataset.y);

    return [x, y];
  }

  function prevShip() {
    if (currentShipIndex == 0) return;
    currentShipIndex--;
    previewShip();
  }

  function nextShip() {
    if (currentShipIndex == 4) return;
    currentShipIndex++;
    previewShip();
  }

  function rotateShip() {
    shipsList[currentShipIndex].direction =
      shipsList[currentShipIndex].direction === "row" ? "column" : "row";
    if (shipsList[currentShipIndex].direction === "row") {
      ship.classList.add("rotated");
    } else {
      ship.classList.remove("rotated");
    }
  }

  function previewShip() {
    ship.innerHTML = "";
    shipNumberDisplay.innerHTML = currentShipIndex + 1;
    for (let i = 0; i < shipsList[currentShipIndex].length; i++) {
      ship.innerHTML +=
        `<div class=${shipsList[currentShipIndex].placed ? "placed" : "unplaced"}></div>`;
    }
    if (shipsList[currentShipIndex].direction === "row") {
      ship.classList.add("rotated");
    } else {
      ship.classList.remove("rotated");
    }
  }
}


export default {
  createBoards,
  setPlayerAttack,
  updatePcBoard,
  updatePlayerBoard,
  setMessage,
  showShipsArea,
  setShipsArea
};