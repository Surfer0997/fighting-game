const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.2;
const HORIZONTAL_ACCELERATION = 4.5;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // canvas context

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height); // canvas API fillRect(x, y, width, height)

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, 50,  this.height);
  }

  update() {
    this.draw();

    this.position.y += this.velocity.y; // apply the acceleration
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) { // stop on the bottom of screen
        this.velocity.y = 0;
    } else {
        this.velocity.y += GRAVITY; // apply gravity if not at the bottom of screen
    }
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
});

const keys = {
    d:{
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
}
let lastKey;

function animate() {
  window.requestAnimationFrame(animate); // to run our function on every frame
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height); // clear canvas to aviod painting effect or c.clearRect(0,0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  ///// player
  player.velocity.x = 0;
  if(keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -HORIZONTAL_ACCELERATION
  }
  if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = HORIZONTAL_ACCELERATION;
  }
  if (keys.w.pressed) {
    player.velocity.y = -10;
  }

  ///// enemy
  enemy.velocity.x = 0;
  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -HORIZONTAL_ACCELERATION
  }
  if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = HORIZONTAL_ACCELERATION;
  }
  if (keys.ArrowUp.pressed) {
    enemy.velocity.y = -10;
  }
}
animate();


///////////// CONTROLS //////////////

window.addEventListener('keydown', (e)=>{
    switch (e.key) {
        // player
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
        break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
        break;
        case 'w':
            keys.w.pressed = true;
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
    }
})

window.addEventListener('keyup', (e)=>{
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
})