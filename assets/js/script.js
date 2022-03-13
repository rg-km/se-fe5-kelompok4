const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
let speed = 200;

const SNAKE_HEAD = "snakeHead";
const SNAKE_BODY = "snakeBody";

let health = 3;
let score = 0;
let level = 1;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake() {
  return {
    headImg: SNAKE_HEAD,
    bodyImg: SNAKE_BODY,
    ...initHeadAndBody(),
    direction: initDirection(),
  };
}
let snake = initSnake();

let apples = [
  {
    position: initPosition(),
  },
  {
    position: initPosition(),
  },
];

function drawCell(ctx, x, y, img) {
  var img = document.getElementById(img);
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawUI() {
  let scoreUI = document.querySelector("#score span");
  scoreUI.textContent = score;
  if (score === 5) {
    level = 2;
    speed = 175;
  }
  if (score === 10) {
    level = 3;
    speed = 150;
  }
  if (score === 15) {
    level = 4;
    speed = 125;
  }
  if (score === 20) {
    level = 5;
    speed = 100;
  }

  let levelUI = document.querySelector("#level span");
  levelUI.textContent = level;

  let speedUI = document.querySelector("#speed span");
  speedUI.textContent = speed;
}

function isPrime(n) {
  if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  if (n % 2 == 0) return n == 2;
  if (n % 3 == 0) return n == 3;
  var m = Math.sqrt(n);
  for (var i = 5; i <= m; i += 6) {
    if (n % i == 0) return false;
    if (n % (i + 2) == 0) return false;
  }
  return true;
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawCell(ctx, snake.head.x, snake.head.y, snake.headImg);
    for (let i = 1; i < snake.body.length; i++) {
      drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.bodyImg);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    drawUI(snake);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.body.push({ x: snake.head.x, y: snake.head.y });
      score++;
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function increaseHealth() {
  const container = document.querySelector(".healthContainer");
  const health = document.createElement("img");
  health.classList.add("healthIcon");
  health.src = "/assets/image/health.png";
  container.appendChild(health);
}

function decreaseHealth() {
  const container = document.querySelector(".healthContainer");
  container.removeChild(container.lastElementChild);
}

function checkCollision(snakes) {
  let isCollide = false;
  //this
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    health--;
    decreaseHealth();
    // Restart Game If Health is 0
    if (health === 0) {
      var audio = new Audio("/assets/sound/game-over.mp3");
      audio.play();
      alert("Game over");
      snake = initSnake();
      health = 3;
      level = 1;
      score = 0;
    } else {
      snake.body = [snake.body[0]];
    }
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake])) {
    setTimeout(function () {
      move(snake);
    }, speed);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "a") {
    turn(snake, DIRECTION.LEFT);
  } else if (event.key === "d") {
    turn(snake, DIRECTION.RIGHT);
  } else if (event.key === "w") {
    turn(snake, DIRECTION.UP);
  } else if (event.key === "s") {
    turn(snake, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake);
  const healthContainer = document.querySelector(".healthContainer");
  healthContainer.innerHTML = "";
  for (var i = 0; i < health; i++) {
    increaseHealth();
  }
}

initGame();
