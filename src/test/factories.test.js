import { shipFactory, gameBoardFactory } from "../factories";

test("Ship hitting", () => {
  const ship = shipFactory(6);
  ship.hit();
  ship.hit();
  expect(ship.hitted).toEqual(2);
});

test("Ship sunk", () => {
  const ship1 = shipFactory(3);
  const ship2 = shipFactory(1);
  ship2.hit();
  expect(ship1.isSunk()).toBe(false);
  expect(ship2.isSunk()).toBe(true);
});

test("GameBoard place ship", () => {
  const myboard = gameBoardFactory();
  const testBoard = [];
  for (let i = 0; i < 100; i++) testBoard.push(0);
  expect(myboard.board).toEqual(testBoard);
  myboard.placeShip(5, 0, 0, "row");
  testBoard[0] = 5;
  testBoard[1] = 5;
  expect(myboard.board).toEqual(testBoard);
});

test("GameBaord all ship sunk", () => {
  const myBoard = gameBoardFactory();
  myBoard.placeShip(5, 2, 1, "row");
  myBoard.receiveAttack(2, 1);
  expect(myBoard.isAllShipsSunk()).toBe(false);
  myBoard.receiveAttack(3, 1);
  expect(myBoard.isAllShipsSunk()).toBe(true);
});