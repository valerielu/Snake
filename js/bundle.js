/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	const View = __webpack_require__(2);

	$(() => {
	  let $context = $('.snake');
	  let board = new Board();
	  let view = new View(board, $context);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Snake {
	  constructor(direction, segments) {
	    this.direction = direction;
	    this.segments = segments;
	    this.snake_body = this.findSnake();
	    this.apple_bonus = 0;
	  }

	  directionTranslate() {
	    let pos;
	    switch (this.direction) {
	      case "N":
	        pos = [-1, 0];
	        break;
	      case "E":
	        pos = [0, 1];
	        break;
	      case "S":
	        pos = [1, 0];
	        break;
	      case "W":
	        pos = [0, -1];
	    }
	    return pos;
	  }

	  move() {
	    let new_head = new Coord(this.segments[0].plus(this.directionTranslate()));
	    this.segments.unshift(new_head);
	    if (this.apple_bonus) {
	      this.apple_bonus -= 1;
	    } else {
	      this.segments.pop();
	    }

	  }

	  findSnake() {
	    let result = [];
	    this.segments.forEach((coord) => {
	      result.push(coord.pos);
	    });
	    return result;
	  }

	  turn(dir) {
	    let pos;
	    switch (dir) {
	      case "N":
	        pos = [-1, 0];
	        break;
	      case "E":
	        pos = [0, 1];
	        break;
	      case "S":
	        pos = [1, 0];
	        break;
	      case "W":
	        pos = [0, -1];
	    }

	    let new_dir = new Coord(pos);

	    if (!new_dir.isOpposite(this.directionTranslate())) {
	      this.direction = dir;
	    }
	  }


	}

	class Coord {
	  constructor(pos) {
	    this.pos = pos;
	    this.rowPos = pos[0];
	    this.colPos = pos[1];
	  }

	  plus(pos) {
	    return [this.rowPos+ pos[0], this.colPos+ pos[1]];
	  }

	  equals(pos) {
	    return this.rowPos === pos[0] && this.colPos === pos[1];
	  }

	  isOpposite(pos) {
	    return this.rowPos === pos[0] * -1 && this.colPos === pos[1] * -1;
	  }


	}

	class Board {
	  constructor() {
	    this.snake = new Snake("N", [new Coord([10, 10])]);
	    this.grid = new Array(20).fill(new Array(20));
	    this.apple = this.generateRandCoord();

	  }

	  generateRandCoord() {
	    let xPos = Math.floor(Math.random() * 20);
	    let yPos = Math.floor(Math.random() * 20);
	    return [xPos, yPos];
	  }

	  eat() {
	    if (this.snake.segments[0].equals(this.apple)) {
	      this.apple = this.generateRandCoord();
	      this.snake.apple_bonus = 3;
	    }
	  }

	  isLose() {
	    let snake_head = this.snake.segments[0];
	    return (snake_head.rowPos < 0 || snake_head.colPos < 0
	      || snake_head.rowPos > 19 || snake_head.colPos > 19
	      || this.snake.segments.slice(1).includes(snake_head));
	  }

	}

	module.exports = Board;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);

	class View {
	  constructor(board, $container) {
	    this.board = board;
	    this.$container = $container;
	    this.render();

	    $(window).on("keydown", (event) => {

	      event.preventDefault();
	      if (event.keyCode === 38) {
	        this.board.snake.turn("N");
	      } else if (event.keyCode === 40) {
	        this.board.snake.turn("S");
	      } else if (event.keyCode === 37) {
	        this.board.snake.turn("W");
	      } else if (event.keyCode === 39) {
	        this.board.snake.turn("E");
	      } else if (event.keyCode === 32) {
	        location.reload();
	      }
	    });
	    this.refreshIntervalId = setInterval(() => {
	      this.step();
	    }, 200);
	  }

	  setUpBoard() {
	    for (let i = 0; i < this.board.grid.length; i++) {
	      let $row = $('<ul></ul>');
	      $row.data('id', i);
	      this.$container.append($row);

	      for(let j = 0; j < this.board.grid.length; j++) {
	        let $square = $('<li></li>');
	        $square.attr('data-pos', [i,j]);
	        $row.append($square);
	      }
	    }
	  }

	  step() {
	    this.board.snake.move();
	    this.render();
	  }

	  render() {
	    this.$container.empty();
	    this.setUpBoard();

	    let num = (this.board.apple[0]) * 20 + this.board.apple[1];
	    let $apple = $('li').eq(num);
	    $apple.addClass('apple');

	    this.board.eat();

	    this.board.snake.segments.forEach((coord) => {
	      let $snakePart = $("li").eq(coord.rowPos * 20 + coord.colPos);
	      if (this.board.isLose()) {
	        alert("You lose!");
	        clearInterval(this.refreshIntervalId);
	    } else {
	      $snakePart.addClass("snake-body");
	      }
	    });

	  }
	}

	module.exports = View;


/***/ }
/******/ ]);