const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const GRAVITY = 0.5;

const PLAYER_HEIGHT = 150;
const PLAYER_WIDTH = 50;
const HORIZONTAL_ACCELERATION = 4.5;

const ATTACKBOX_HEIGHT = 50;
const ATTACKBOX_WIDTH = 100;

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

const player = new Fighter({
  position: {
    x: 150,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'red',
  attackBox: {
    attackOffset: {
      x: 0,
      y: 38,
    },
    attackBoxHeight: ATTACKBOX_HEIGHT,
    attackBoxWidth: 250,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  frameCount: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      frameCount: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      frameCount: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      frameCount: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      frameCount: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      frameCount: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take hit - white silhouette.png',
      frameCount: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      frameCount: 6,
    },
  },
});
player.width = PLAYER_WIDTH + 10;

const enemy = new Fighter({
  position: {
    x: 800,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  attackBox: {
    attackOffset: {
      x: -170,
      y: 50,
    },
    attackBoxHeight: ATTACKBOX_HEIGHT,
    attackBoxWidth: 220,
  },
  imageSrc: './img/kenji/Idle.png',
  frameCount: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 169,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      frameCount: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      frameCount: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      frameCount: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      frameCount: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      frameCount: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      frameCount: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      frameCount: 7,
    },
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
    player.switchSprite('run');
    // offset attackBox to hit other way
    player.attackBox.attackOffset.x = -player.attackBox.width + 50;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = HORIZONTAL_ACCELERATION;
    player.switchSprite('run');
    player.attackBox.attackOffset.x = 0;
  } else player.switchSprite('idle'); // default sprite

  if (keys.w.pressed) {
    player.velocity.y = -10;
  }

  if (player.velocity.y < 0) {
    // if player going up
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    // if player going down
    player.switchSprite('fall');
  }

  ///// enemy
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -HORIZONTAL_ACCELERATION;
    enemy.switchSprite('run');
    // offset attackBox to hit other way
    enemy.attackBox.attackOffset.x = -enemy.attackBox.width + 50;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = HORIZONTAL_ACCELERATION;
    enemy.switchSprite('run');
    enemy.attackBox.attackOffset.x = 0;
  } else {
    enemy.switchSprite('idle');
  }

  if (keys.ArrowUp.pressed) {
    enemy.velocity.y = -10;
  }

  if (enemy.velocity.y < 0) {
    // if enemy going up
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    // if enemy going down
    enemy.switchSprite('fall');
  }

  //// detect for collision & enemy gets hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    const damage = Math.random() * 25 + 1; // slower attack -> bigger damage
    enemy.takeHit(damage);
    player.isAttacking = false; // to prenent mutiple hits at one time
    if (enemy.health <= 0) {
      enemy.health = 0;
      gsap.to('#enemyHealth', {
        width:  '0%'
      })
    }
// Enemy was hit
    gsap.to('#enemyHealth', {
      width:  enemy.health + '%'
    })
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
        width:  '0%'
      })
    }
 // Player was hit
    gsap.to('#playerHealth', {
      width:  player.health + '%'
    })
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
