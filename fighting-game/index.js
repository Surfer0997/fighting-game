const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.5;

const PLAYER_HEIGHT = 150;
const PLAYER_WIDTH = 50;
const HORIZONTAL_ACCELERATION = 4.5;


let GAME_TIME = 60;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // canvas context

const timer = document.querySelector('#timer');
const displayText = document.querySelector('#displayText');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height); // canvas API fillRect(x, y, width, height)
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: {
    x: 650, // bruteforce position of shop
    y: 173,
  },
  imageSrc: './img/shop.png',
  scale: 2.4,
  frameCount: 6,
});

let player = new Fighter(PLAYER_CONFIG);
player.width = PLAYER_WIDTH + 10;

let enemy = new Fighter(ENEMY_CONFIG);

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

  c.fillStyle = 'rgba(255,255,255,0.1)'; // make background more light to have contrast on players
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0; // resetting movement on each frame
  enemy.velocity.x = 0;
  ///// player

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -HORIZONTAL_ACCELERATION;
    player.lastDirection = 'Left';
    player.switchSprite('runLeft');
    // offset attackBox to hit other way
    if (!player.isAttacking) player.attackBox.attackOffset.x = -player.attackBox.width + 50;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = HORIZONTAL_ACCELERATION;
    player.lastDirection = 'Right';
    player.switchSprite('runRight');
    if (!player.isAttacking) player.attackBox.attackOffset.x = 0;
  } else player.switchSprite(`idle${player.lastDirection}`); // default sprite

  if (keys.w.pressed) {
    player.jump();
  }

  if (player.velocity.y < 0) {
    // if player going up
    player.switchSprite(`jump${player.lastDirection}`);
  } else if (player.velocity.y > 0) {
    // if player going down
    player.switchSprite(`fall${player.lastDirection}`);
  }

  ///// enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -HORIZONTAL_ACCELERATION;
    enemy.lastDirection = 'Left';
    enemy.switchSprite('runRight');
    // offset attackBox to hit other way
    if (!enemy.isAttacking) enemy.attackBox.attackOffset.x = -enemy.attackBox.width + 50;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = HORIZONTAL_ACCELERATION;
    enemy.lastDirection = 'Right';
    enemy.switchSprite('runLeft');
    if (!enemy.isAttacking) enemy.attackBox.attackOffset.x = 0;
  } else {
    enemy.switchSprite(`idle${enemy.lastDirection}`);
  }

  if (keys.ArrowUp.pressed) {
    enemy.jump();
  }

  if (enemy.velocity.y < 0) {
    // if enemy going up
    enemy.switchSprite(`jump${enemy.lastDirection}`);
  } else if (enemy.velocity.y > 0) {
    // if enemy going down
    enemy.switchSprite(`fall${enemy.lastDirection}`);
  }

  //// detect for collision & enemy gets hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    const damage = Math.random() * 25 + 1; // slower attack -> bigger damage
    enemy.takeHit(damage);
    player.isAttacking = false; // to prevent mutiple hits at one time
    if (enemy.health <= 0) {
      enemy.health = 0;
      gsap.to('#enemyHealth', {
        width: '0%',
      });
    }
    // Enemy was hit
    // gsap.to('#enemyHealth', {
    //   width: enemy.health + '%',
    // });
  }

  // if player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    const damage = Math.random() * 20;
    player.takeHit(damage);
    enemy.isAttacking = false; // to prenent mutiple hits at one time
    if (player.health <= 0) {
      player.health = 0;
      gsap.to('#playerHealth', {
        width: '0%',
      });
    }
    // Player was hit
    // gsap.to('#playerHealth', {
    //   width: player.health + '%',
    // });
  }
  // if enemy misses & player gets hit
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }
  //// end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    decideWhoWonAndDisplay(timeoutId);
  }
}
animate();


window.addEventListener('keyup', (e)=>{
  if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
    player = new Fighter(PLAYER_CONFIG);
    enemy = new Fighter(ENEMY_CONFIG);
    GAME_TIME = 60;
    gsap.to('#enemyHealth', {
      width: '100%',
    });
    gsap.to('#playerHealth', {
      width: '100%',
    });
    player.position.x = 150;
    player.position.y = 0;
    enemy.position.x = 850;
    enemy.position.y = 0;
    displayText.style.display = 'none';
    decreaseTimer();
  }
})