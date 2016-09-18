const Board = require('./snake.js');

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
