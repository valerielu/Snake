const Board = require("./snake.js");
const View = require("./view.js");

$(() => {
  let $context = $('.snake');
  let board = new Board();
  let view = new View(board, $context);
});
