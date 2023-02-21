const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.5;

const PLAYER_HEIGHT = 150;
const PLAYER_WIDTH = 50;
const HORIZONTAL_ACCELERATION = 4.5;

const ATTACKBOX_HEIGHT = 50;
const ATTACKBOX_WIDTH = 100;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // canvas context

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height); // canvas API fillRect(x, y, width, height)

class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.height = PLAYER_HEIGHT;
    this.width = PLAYER_WIDTH;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: ATTACKBOX_WIDTH,
      height: ATTACKBOX_HEIGHT,
    };
    this.isAttacking = false;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box drawn
    // if (this.isAttacking) {
    c.fillStyle = 'white';
    c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    // }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.y += this.velocity.y; // apply the acceleration
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      // stop on the bottom of screen
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY; // apply gravity if not at the bottom of screen
    }
  }

  attack() {
    if (this.isAttacking === true) return;
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate); // to run our function on every frame
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height); // clear canvas to aviod painting effect or c.clearRect(0,0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0; // resetting movement on each frame
  enemy.velocity.x = 0;
  ///// player
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -HORIZONTAL_ACCELERATION;
    // offset attackBox to hit other way
    player.attackBox.offset.x = -50
  }
  if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = HORIZONTAL_ACCELERATION;
    player.attackBox.offset.x = 0
  }
  if (keys.w.pressed) {
    player.velocity.y = -10;
  }

  ///// enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -HORIZONTAL_ACCELERATION;
    // offset attackBox to hit other way
    enemy.attackBox.offset.x = -50;

  }
  if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = HORIZONTAL_ACCELERATION;
    enemy.attackBox.offset.x = 0;
  }
  if (keys.ArrowUp.pressed) {
    enemy.velocity.y = -10;
  }

  //// detect for collision
  if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
    player.isAttacking = false; // to prenent mutiple hits at one time
    console.log('Enemy was hit');
  }
  if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false; // to prenent mutiple hits at one time
    console.log('Player was hit');
  }
}
animate();

///////////// CONTROLS //////////////

window.addEventListener('keydown', e => {
  switch (e.key) {
    // player
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
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
