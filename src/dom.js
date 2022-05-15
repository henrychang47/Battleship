const playerBoardElement = document.querySelector("#playerBoard");
const pcBoardElement = document.querySelector("#pcBoard");
const messageBox = document.querySelector("#messageBox");
const pcArea = document.querySelector("#pcArea");
const shipsArea = document.querySelector("#shipsArea");
const startButton = document.querySelector("#startButton");
const reStartButton = document.querySelector("#reStartButton");
var playerPlacedList = [];
var removeCheckCanPlaceEvent;

const setButtons = function (startGame, startPlace) {
  startButton.addEventListener("click", () => {
    startGame(playerPlacedList)
    removeCheckCanPlaceEvent();
  });
  reStartButton.addEventListener("click", startPlace);
}

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
  reStartButton.style.display = "none";
  shipsArea.style.display = "block";
  startButton.style.display = "block";
}

const showPcArea = function () {
  pcArea.style.display = "block";
  reStartButton.style.display = "block";
  shipsArea.style.display = "none";
  startButton.style.display = "none";
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

  previewShip(shipsList[currentShipIndex].length, shipsList[currentShipIndex].placed);

  const playersGrids = playerBoardElement.querySelectorAll(".gameBoard-grid");
  playersGrids.forEach(grid => grid.addEventListener("mouseenter", checkCanPlace));
  removeCheckCanPlaceEvent = () => {
    playersGrids.forEach(grid => grid.removeEventListener("mouseenter", checkCanPlace));
  }
  setMessage("Place your ships");

  function checkCanPlace(e) {
    const [targetX, targetY] = getCoord(e.target);
    const length = shipsList[currentShipIndex].length;
    const direction = shipsList[currentShipIndex].direction;
    const checkingGrids = getCheckingGrids(targetX, targetY, length, direction);

    if (checkingGrids.length === 0) {
      e.target.classList.add("canNotPlace");
      e.target.addEventListener("mouseleave", () => {
        e.target.classList.remove("canNotPlace");
      }, { once: true });
    } else {
      checkingGrids.forEach(grid => {
        grid.classList.add("canPlace")
      });
      e.target.addEventListener("click", place, { once: true });
      e.target.addEventListener("mouseleave", () => {
        e.target.removeEventListener("click", place);
        checkingGrids.forEach(grid => {
          grid.classList.remove("canPlace");
        });
      }, { once: true });
    }
  }

  function place(e) {
    const shipNumber = currentShipIndex + 1;
    clearMarksWithShipNumber(shipNumber);
    markPlacingShip(e);
    markPlacingSpace(e);

    shipsList[currentShipIndex].placed = true;
    currentShipIndex = findUnplacedShipIndex();
    previewShip();
  }

  function findUnplacedShipIndex() {
    let i = 0;
    while (i < 5 && shipsList[i].placed !== false) {
      i++;
    }
    if (i < 5) return i;
    else {
      console.log("finish")
      startButton.disabled = false;
      return 0;
    }
  }

  function markPlacingShip(e) {
    const [targetX, targetY] = getCoord(e.target);
    const shipNumber = currentShipIndex + 1;
    const length = shipsList[currentShipIndex].length;
    const direction = shipsList[currentShipIndex].direction;
    let currentPlacing = undefined;

    if (direction === "row") {
      for (let i = 0; i < length; i++) {
        currentPlacing = getGrid(targetX + i, targetY)
        currentPlacing.classList.add("bePlacedShip", `ship${shipNumber}`);
        currentPlacing.textContent = shipNumber;
      }
    } else if (direction === "column") {
      for (let i = 0; i < length; i++) {
        currentPlacing = getGrid(targetX, targetY + i);
        currentPlacing.classList.add("bePlacedShip", `ship${shipNumber}`);
        currentPlacing.textContent = shipNumber;
      }
    }

    playerPlacedList[currentShipIndex] = {
      shipNumber: currentShipIndex + 1,
      x: targetX,
      y: targetY,
      direction: direction,
    };
  }

  function markPlacingSpace(e) {
    const [targetX, targetY] = getCoord(e.target);
    const shipNumber = currentShipIndex + 1;
    const length = shipsList[currentShipIndex].length;
    const direction = shipsList[currentShipIndex].direction;
    const toMarkSpace = [];

    if (direction === "row") {
      for (let i = -1; i < length + 1; i++) {
        toMarkSpace.push(getGrid(targetX + i, targetY - 1));
      }
      for (let i = -1; i < length + 1; i++) {
        toMarkSpace.push(getGrid(targetX + i, targetY + 1));
      }
      toMarkSpace.push(getGrid(targetX - 1, targetY));
      toMarkSpace.push(getGrid(targetX + length, targetY));
    } else if (direction === "column") {
      for (let i = -1; i < length + 1; i++) {
        toMarkSpace.push(getGrid(targetX - 1, targetY + i));
      }
      for (let i = -1; i < length + 1; i++) {
        toMarkSpace.push(getGrid(targetX + 1, targetY + i));
      }
      toMarkSpace.push(getGrid(targetX, targetY - 1));
      toMarkSpace.push(getGrid(targetX, targetY + length));
    }

    toMarkSpace.filter(grid => grid !== null).forEach(grid => {
      grid.classList.add("bePlacedSpace", `ship${shipNumber}`);
      grid.textContent = "X";
    });
  }

  function clearMarksWithShipNumber(shipNumber) {
    const toClear = playerBoardElement.querySelectorAll(`.ship${shipNumber}`);
    toClear.forEach(grid => {
      grid.classList.remove(`ship${shipNumber}`);
      if (!isBelongSomeShip(grid)) {
        grid.textContent = "";
        grid.classList.remove("bePlacedShip", "bePlacedSpace");
      }
    });
  }

  function isBelongSomeShip(grid) {
    const regex = /ship\d/g;
    if (grid.className.match(regex) !== null) return true;
    return false;
  }

  function justBelongCurrentShip(grid) {
    const regex = /ship\d/g;
    const belongShips = grid.className.match(regex);
    if (belongShips.length === 1 && belongShips[0] === `ship${currentShipIndex + 1}`) return true;
    return false
  }

  function getCheckingGrids(x, y, length, direction) {
    const checking = [];
    let currentGrid = undefined;

    if (direction === "row") {
      if (x + length > 10) return [];
      for (let i = 0; i < length; i++) {
        currentGrid = getGrid(x + i, y);
        if (isBelongSomeShip(currentGrid) && !justBelongCurrentShip(currentGrid)) return [];
        checking.push(currentGrid);
      }
    } else if (direction === "column") {
      if (y + length > 10) return [];
      for (let i = 0; i < length; i++) {
        currentGrid = getGrid(x, y + i);
        if (isBelongSomeShip(currentGrid) && !justBelongCurrentShip(currentGrid)) return [];
        checking.push(currentGrid);
      }
    }
    return checking;
  }

  function getGrid(x, y) {
    if (x < 0 || y < 0 || x > 9 || y > 9) return null;
    return playerBoardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }

  function getCoord(grid) {
    const x = parseInt(grid.dataset.x);
    const y = parseInt(grid.dataset.y);

    return [x, y];
  }

  function prevShip() {
    if (currentShipIndex == 0) currentShipIndex = 4;
    else currentShipIndex--;
    previewShip();
  }

  function nextShip() {
    if (currentShipIndex == 4) currentShipIndex = 0;
    else currentShipIndex++;
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
        `<div class=${shipsList[currentShipIndex].placed ? "placed" : "unplaced"}>
        </div>`;
    }
    if (shipsList[currentShipIndex].direction === "row") {
      ship.classList.add("rotated");
    } else {
      ship.classList.remove("rotated");
    }
  }
}

function cleanAllSpaceMarks() {
  const spaceMarks = playerBoardElement.querySelectorAll(".bePlacedSpace");
  spaceMarks.forEach(grid => {
    grid.classList.remove("bePlacedSpace");
    grid.textContent = "";
  });
}

export default {
  setButtons,
  createBoards,
  setPlayerAttack,
  updatePcBoard,
  updatePlayerBoard,
  setMessage,
  showPcArea,
  showShipsArea,
  setShipsArea,
  cleanAllSpaceMarks,
};