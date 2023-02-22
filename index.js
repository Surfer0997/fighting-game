const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.5;

const PLAYER_HEIGHT = 150;
const PLAYER_WIDTH = 50;
const HORIZONTAL_ACCELERATION = 4.5;

const ATTACKBOX_HEIGHT = 50;
const ATTACKBOX_WIDTH = 100;

let GAME_TIME = 10;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // canvas context

const enemyHealthBar = document.querySelector('#enemyHealth');
const playerHealthBar = document.querySelector('#playerHealth');
const timer = document.querySelector('#timer');
const displayText = document.querySelector('#displayText');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height); // canvas API fillRect(x, y, width, height)
const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x:650, // bruteforce position of shop
    y:173
  },
  imageSrc: './img/shop.png',
  scale: 2.4,
  frameCount: 6
})



const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'red',
  attackOffset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  frameCount: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  attackOffset: {
    x: -50,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  frameCount: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  }
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};


decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate); // to run our function on every frame
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height); // clear canvas to aviod painting effect or c.clearRect(0,0, canvas.width, canvas.height)
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0; // resetting movement on each frame
  enemy.velocity.x = 0;
  ///// player
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -HORIZONTAL_ACCELERATION;
    // offset attackBox to hit other way
    player.attackBox.attackOffset.x = -50;
  }
  if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = HORIZONTAL_ACCELERATION;
    player.attackBox.attackOffset.x = 0;
  }
  if (keys.w.pressed) {
    player.velocity.y = -10;
  }

  ///// enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -HORIZONTAL_ACCELERATION;
    // offset attackBox to hit other way
    enemy.attackBox.attackOffset.x = -50;
  }
  if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = HORIZONTAL_ACCELERATION;
    enemy.attackBox.attackOffset.x = 0;
  }
  if (keys.ArrowUp.pressed) {
    enemy.velocity.y = -10;
  }

  //// detect for collision
  if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
    player.isAttacking = false; // to prenent mutiple hits at one time
    enemy.health -= Math.random() * 20;
    if (enemy.health <= 0) {
      enemy.health = 0;
      enemyHealthBar.style.width = '0%';
    }
    enemyHealthBar.style.width = enemy.health + '%'; // Enemy was hit
  }
  if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false; // to prenent mutiple hits at one time
    player.health -= Math.random() * 20;
    if (player.health <= 0) {
      player.health = 0;
      playerHealthBar.style.width = '0%';
    }
    playerHealthBar.style.width = player.health + '%'; // Player was hit
  }
  //// end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    decideWhoWonAndDisplay(timeoutId);
  }
}
animate();

///////////// CONTROLS //////////////

window.addEventListener('keydown', e => {
  switch (e.key) {
    // player
    case 'd' || 'в':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a' || 'ф':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w' || 'ц':
      keys.w.pressed = true;
      break;
    case ' ':
      player.attack();
      break;
    // enemy
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      break;
    case 'Enter':
      enemy.attack();
      break;
  }
});

window.addEventListener('keyup', e => {
  switch (e.key) {
    // player
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
    // enemy
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
  }
});
