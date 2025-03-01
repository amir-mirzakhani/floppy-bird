//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
  x: birdX,
  y: birdY,
  height: birdHeight,
  width: birdWidth,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0; // speed of the bird
let gravity = 0.4;

let gameOver = false;
let score = 0;

//sounds
let wingBird = new Audio("./assets/sounds/sfx_wing.wav");
let hitSound = new Audio("./assets/sounds/sfx_hit.wav");
let bgmSound = new Audio("./assets/sounds/backgroundsounds.mp3");
let pointSound = new Audio("./assets/sounds/sfx_point.wav");
let dieSound = new Audio("./assets/sounds/sfx_die.wav");
bgmSound.loop = true;
onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  //load images
  birdImg = new Image();
  birdImg.src = "./assets/images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./assets/images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, boardWidth, boardHeight);

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  if (bird.y > board.height) {
    gameOver = true;
    dieSound.play();
  }
  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Corrected "widht" to "width"
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pointSound.play();
      score += 0.5;
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      hitSound.play();
      gameOver = true;
    }
  }
  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);
  if (gameOver) {
    bgmSound.pause();
    bgmSound.currentTime = 0;
    context.fillText("GAME OVER", 40, 320);
    context.font = "20px sans-serif";
    context.fillText("tap space button to start", 75, 380);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardHeight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight, // Added missing width and height properties
    passed: false,
  };

  pipeArray.push(bottomPipe);
}
function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    if (bgmSound.pause) {
      bgmSound.play();
    }
    velocityY = -6;
    wingBird.play();
    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
