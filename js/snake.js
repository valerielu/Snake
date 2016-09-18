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
