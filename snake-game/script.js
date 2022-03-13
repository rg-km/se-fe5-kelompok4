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
}
const MOVE_INTERVAL = 200; // change this value to control snake speed (lower much faster)

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

let snake1 = {
    color: "purple",
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
}

let apple = {
    color: "red",
    position: initPosition(),
}
function drawCell(ctx, x, y, color) {
    const img = new Image();
    img.src = 'assets/snakeHead.png'
    ctx.drawImage(img,x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
function drawApple(ctx, x, y) {
    const img = new Image();
    img.src = 'assets/apple.png'
    ctx.drawImage(img,x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
function drawCellBody(ctx, x, y, color) {
    var img = new Image();
    img.src = 'assets/snakeScale.jpg';
    ctx.drawImage(img,x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    /*
    option for snake body pattern

    var ptrn = ctx.createPattern(img,'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    */
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        //loop
        for (let i = 1; i < snake1.body.length; i++) {
            drawCellBody(ctx,snake1.body[i].x , snake1.body[i].y, snake1.color);
        }
        drawApple(ctx, apple.position.x, apple.position.y);
        let score = document.getElementById("score");
        score.innerText = snake1.score;
        /*
        drawScore(snake1);
        let scoreBoard = document.getElementById("score1Board");
        if (scoreBoard.innerText == 5) {
            MOVE_INTERVAL -=150; 
            console.log("level bertambah")
        }*/
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

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        //this
        snake.body.push({x: snake.head.x, y: snake.head.y});
        console.log(`${snake.head.x, snake.head.y}`);
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
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
    setTimeout(function() {
        move(snake);
    }, MOVE_INTERVAL);
}

//this
function moveBody(snake) {

    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        snake1.direction = DIRECTION.LEFT;
    } else if (event.key === "ArrowRight") {
        snake1.direction = DIRECTION.RIGHT;
    } else if (event.key === "ArrowUp") {
        snake1.direction = DIRECTION.UP;
    } else if (event.key === "ArrowDown") {
        snake1.direction = DIRECTION.DOWN;
    }
})

move(snake1);
