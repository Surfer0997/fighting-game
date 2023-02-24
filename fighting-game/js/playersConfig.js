const ATTACKBOX_HEIGHT = 50;
const ATTACKBOX_WIDTH = 100;

const PLAYER_CONFIG = {
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
  imageSrc: './img/samuraiMack/IdleRight.png',
  frameCount: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  htmlHealthBar: "#playerHealth",
  lastDirection: 'Right',
  sprites: {
    idleLeft: {
      imageSrc: './img/samuraiMack/IdleLeft.png',
      frameCount: 8,
    },
    idleRight: {
      imageSrc: './img/samuraiMack/IdleRight.png',
      frameCount: 8,
    },
    runRight: {
      imageSrc: './img/samuraiMack/Run.png',
      frameCount: 8,
    },
    runLeft: {
      imageSrc: './img/samuraiMack/RunLeft.png',
      frameCount: 8,
    },
    jumpLeft: {
      imageSrc: './img/samuraiMack/JumpLeft.png',
      frameCount: 2,
    },
    jumpRight: {
      imageSrc: './img/samuraiMack/JumpRight.png',
      frameCount: 2,
    },
    fallLeft: {
      imageSrc: './img/samuraiMack/FallLeft.png',
      frameCount: 2,
    },
    fallRight: {
      imageSrc: './img/samuraiMack/FallRight.png',
      frameCount: 2,
    },
    attack1Left: {
      imageSrc: './img/samuraiMack/Attack1Left.png',
      frameCount: 6,
    },
    attack2Left: {
      imageSrc: './img/samuraiMack/Attack2Left.png',
      frameCount: 6,
    },
    attack1Right: {
      imageSrc: './img/samuraiMack/Attack1Right.png',
      frameCount: 6,
    },
    attack2Right: {
      imageSrc: './img/samuraiMack/Attack2Right.png',
      frameCount: 6,
    },
    takeHitLeft: {
      imageSrc: './img/samuraiMack/Take hit - white silhouetteLeft.png',
      frameCount: 4,
    },
    takeHitRight: {
      imageSrc: './img/samuraiMack/Take hit - white silhouetteRight.png',
      frameCount: 4,
    },
    deathLeft: {
      imageSrc: './img/samuraiMack/DeathLeft.png',
      frameCount: 6,
    },
    deathRight: {
      imageSrc: './img/samuraiMack/DeathRight.png',
      frameCount: 6,
    },
  },
};

const ENEMY_CONFIG = {
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
  htmlHealthBar: "#enemyHealth",
  imageSrc: './img/kenji/IdleLeft.png',
  frameCount: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 169,
  },
  lastDirection: 'Left',
  sprites: {
    idleLeft: {
      imageSrc: './img/kenji/IdleLeft.png',
      frameCount: 4,
    },
    idleRight: {
      imageSrc: './img/kenji/IdleRight.png',
      frameCount: 4,
    },
    runRight: {
      imageSrc: './img/kenji/Run.png',
      frameCount: 8,
    },
    runLeft: {
      imageSrc: './img/kenji/RunLeft.png',
      frameCount: 8,
    },
    jumpLeft: {
      imageSrc: './img/kenji/JumpLeft.png',
      frameCount: 2,
    },
    jumpRight: {
      imageSrc: './img/kenji/JumpRight.png',
      frameCount: 2,
    },
    fallLeft: {
      imageSrc: './img/kenji/FallLeft.png',
      frameCount: 2,
    },
    fallRight: {
      imageSrc: './img/kenji/FallRight.png',
      frameCount: 2,
    },
    attack1Left: {
      imageSrc: './img/kenji/Attack1Left.png',
      frameCount: 4,
    },
    attack2Left: {
      imageSrc: './img/kenji/Attack2Left.png',
      frameCount: 4,
    },
    attack1Right: {
      imageSrc: './img/kenji/Attack1Right.png',
      frameCount: 4,
    },
    attack2Right: {
      imageSrc: './img/kenji/Attack2Right.png',
      frameCount: 4,
    },
    takeHitLeft: {
      imageSrc: './img/kenji/Take hitLeft.png',
      frameCount: 3,
    },
    takeHitRight: {
      imageSrc: './img/kenji/Take hitRight.png',
      frameCount: 3,
    },
    deathLeft: {
      imageSrc: './img/kenji/DeathLeft.png',
      frameCount: 7,
    },
    deathRight: {
      imageSrc: './img/kenji/DeathRight.png',
      frameCount: 7,
    },
  },
};
