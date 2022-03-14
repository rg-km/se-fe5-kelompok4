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

let wall = [ {
  x: 0,
  y: 0,
  w: 600,
  h: 20
 }, {
  x: 64,
  y: 400,
  w: 225,
  h: 20
 }, {
  x: 400,
  y: 100,
  w: 200,
  h: 20
 }, {
  x: 100,
  y: 100,
  w: 200,
  h: 20
 }]

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
    drawWall(ctx);
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
  let audio = new Audio("/assets/sound/apple-bite.ogg");
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.body.push({ x: snake.head.x, y: snake.head.y });
      score++;
      audio.play();
      if (score % 5 == 0 && score <= 25 && score != 0) {
        lvlUpAudio();
      }
    }
  }
}

// struglle to play this function exactly one time
function lvlUpAudio() {
  var audio = new Audio("/assets/sound/level_up.mp3");
  audio.play();
  alert(`Kamu naik ke level ${level + 1}`);
}

function checkState() {
  if (health < 1) {
    var audio = new Audio("/assets/sound/game-over.mp3");
    audio.play();
    alert("Game over");
    snake = initSnake();
    health = 3;
    level = 1;
    score = 0;
    speed = 200;
    initGame();
  } else {
    snake.body = [snake.body[0]];
  }
}

function checkWall(snake, rect) {
  
  if (level > 1) {
    if (Math.abs(snake.head.y - wall[0].y) === wall[0].y) {
      decreaseHealth();
      checkState();
    }
  }
  if (level > 2) {
    for (let i = Math.sqrt(wall[1].x) - 5; i < Math.sqrt(wall[1].w) ; i++) {
      if (snake.head.x === i && snake.head.y === Math.sqrt(wall[1].y)) {
        decreaseHealth();
        checkState();
      }
    }
  }
  if (level > 3) {
    for (let i = 20; i <= 29 ; i++) {
      if (snake.head.x === i && snake.head.y === (wall[2].y / 20)) {
        decreaseHealth();
        checkState();
      }
    }
  }
  if (level > 4) {
    for (let i = 5; i < 15 ; i++) {
      if (snake.head.x === i && snake.head.y === (wall[3].y / 20)) {
        decreaseHealth();
        checkState();
      }
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
  checkWall(snake);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
  checkWall(snake);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
  checkWall(snake);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
  checkWall(snake);
}

function increaseHealth() {
  const container = document.querySelector(".healthContainer");
  const health = document.createElement("img");
  health.classList.add("healthIcon");
  health.src = "/assets/image/health.png";
  container.appendChild(health);
}

function decreaseHealth() {
  health--;
  const container = document.querySelector(".healthContainer");
  console.log(health);
  if (health > 0) container.removeChild(container.lastElementChild);
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
    // Restart Game If Health is 0
    decreaseHealth();
    checkState();
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

function drawWall(ctx) {
  if (level > 1) {
    ctx.beginPath();
    ctx.rect(wall[0].x, wall[0].y, wall[0].w, wall[0].h);
    ctx.fillStyle = "red";
    ctx.fill();
  }
  if (level >2) {
    ctx.beginPath();
    ctx.rect(wall[1].x, wall[1].y, wall[1].w, wall[1].h);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
  if (level > 3) {
    ctx.beginPath();
    ctx.rect(wall[2].x, wall[2].y, wall[2].w, wall[2].h);
    ctx.fillStyle = "green";
    ctx.fill();
  }
  if (level > 4) {
    ctx.beginPath();
    ctx.rect(wall[3].x, wall[3].y, wall[3].w, wall[3].h);
    ctx.fillStyle = "black";
    ctx.fill();
  }
}

function initGame() {
  move(snake);
  const healthContainer = document.querySelector(".healthContainer");
  healthContainer.innerHTML = "";
  for (var i = 0; i < health; i++) {
    increaseHealth();
  }
}

initGame();
