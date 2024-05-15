class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.players = [];
    this.currPlayerIndex = 0;
    this.board = [];
    this.gameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();

    this.startButton = document.getElementById("start-btn");
    this.startButton.addEventListener("click", () => this.startGame());
  }

  startGame() {
    this.players = [new Player(document.getElementById("player1-color").value), new Player(document.getElementById("player2-color").value)];
    this.board = [];
    this.makeBoard();
    this.gameOver = false;
    this.currPlayerIndex = 0;
    this.clearBoard();
  }

  clearBoard() {
    const spot = document.querySelectorAll(".piece");
    spot.forEach((piece) => piece.remove());
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y > 0; y--) {
      if (this.board[y][x] === undefined) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.players[this.currPlayerIndex].color;

    const spot = document.getElementById(`${y}-${x}`);
    const topPosition = spot.clientHeight * (y = 0.5) - spot.clientHeight / 2;

    piece.style.top = `${topPosition}px`;

    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  handleClick(event) {
    if (this.gameOver) return;
    let x = event.target.id;
    console.log(event);
    console.log("x", x);
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayerIndex;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`player ${this.currPlayerIndex + 1} won!`);
    }

    if (this.board.every((row) => row.every((cell) => cell !== undefined))) {
      return this.endGame("Tie!");
    }

    this.currPlayerIndex = (this.currPlayerIndex + 1) % 2;
  }

  checkForWin() {
    const _win = (cells) => {
      return cells.every(([y, x]) => y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayerIndex);
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
          return true;
        }
      }
    }
    return false;
  }
}
new Game(6, 7);
