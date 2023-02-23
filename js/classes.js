const MARGIN_FROM_CANVAS_BOTTOM_TO_GROUND = 96;
const DISTANCE_TO_GROUND = 330;
class Sprite {
  constructor({ position, imageSrc, scale = 1, frameCount = 1, offset = { x: 0, y: 0 } }) {
    this.position = position;
    // this.height = 50;
    // this.width = 150;
    this.image = new Image(); // native API
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameCount = frameCount;
    this.frameCurrent = 0;
    this.framesElapsed = 0; // showed frames
    this.framesHold = 5; // for every X frames change sprite position
    this.offset = offset;

    
  }

  draw() {
    c.drawImage(
      this.image,

      this.frameCurrent * (this.image.width / this.frameCount), // crop coordinates to animate frames
      0,
      this.image.width / this.frameCount,
      this.image.height,

      this.position.x - this.offset.x, // just position, offset because fighter sprite has offset to fit attack and other animations
      this.position.y - this.offset.y,
      (this.image.width / this.frameCount) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      // hold animation, to be not on every frame
      if (this.frameCurrent < this.frameCount - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    attackBox: { attackOffset, attackBoxWidth, attackBoxHeight },
    imageSrc,
    scale = 1,
    frameCount = 1,
    offset = { x: 0, y: 0 },
    sprites,
    lastDirection = 'Left',
    htmlHealthBar
  }) {
    super({
      position,
      imageSrc,
      scale,
      frameCount,
      offset,
    });
    this.htmlHealthBar = htmlHealthBar;
    this.velocity = velocity;
    this.color = color;
    this.height = PLAYER_HEIGHT;
    this.width = PLAYER_WIDTH;
    this.lastKey;
    this.lastDirection = lastDirection;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      attackOffset,
      width: attackBoxWidth,
      height: attackBoxHeight,
    };
    this.isAttacking = false;
    this.health = 100;
    this.dead = false;

    this.frameCurrent = 0;
    this.framesElapsed = 0; // showed frames
    this.framesHold = 5; // for every X frames change sprite position

    this.sprites = sprites;
    for (const sprite in sprites) {
      // loop through all our prites to create instances of javascript Image + set source for them
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    };
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }

    this.attackBox.position.x = this.position.x + this.attackBox.attackOffset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.attackOffset.y;

    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height); // show attack hitboxes

    this.position.y += this.velocity.y; // apply the acceleration
    this.position.x += this.velocity.x;

    /////////// MOVEMENT RESTRICTIONS
    // if (this.position.x <= 0 || this.position.x >= CANVAS_WIDTH) { // TELEPORT EFFECT
    //   this.position.x = 0;
    // }
    if (this.position.x <= 0) {
      this.position.x = 0;
    }
    if (this.position.x >= CANVAS_WIDTH - PLAYER_WIDTH - 10) {
      this.position.x = CANVAS_WIDTH - PLAYER_WIDTH - 10;
    }
    if (this.position.y <= -200) { // some space behind the scene for fun pvp
      this.velocity.y = 0;
      this.position.y = -200;
    }
    if (this.position.y + this.height + this.velocity.y >= canvas.height - MARGIN_FROM_CANVAS_BOTTOM_TO_GROUND) {
      // stop on the bottom of screen
      this.velocity.y = 0;
      this.position.y = DISTANCE_TO_GROUND; // to avoid gravity + acceleration bug
    } else {
      this.velocity.y += GRAVITY; // apply gravity if not at the bottom of screen
    }
  }

  attack() {
    if (this.isAttacking === true) return;
    this.isAttacking = true;
    if (Math.random() > 0.75) {
      this.switchSprite(`attack2${this.lastDirection}`);
    } else this.switchSprite(`attack1${this.lastDirection}`);
  }

  blockAnim() {
    // overriding all other animations with the attack anim
    if (this.image === this.sprites.attack1Left.image && this.frameCurrent < this.sprites.attack1Left.frameCount - 1)
      return true; // to disable sprite change while attacking
    if (this.image === this.sprites.attack2Left.image && this.frameCurrent < this.sprites.attack2Left.frameCount - 1)
      return true;
    if (this.image === this.sprites.attack1Right.image && this.frameCurrent < this.sprites.attack1Right.frameCount - 1)
      return true; // to disable sprite change while attacking
    if (this.image === this.sprites.attack2Right.image && this.frameCurrent < this.sprites.attack2Right.frameCount - 1)
      return true;
    // overriding all other animations with the take hit anim
    if (this.image === this.sprites.takeHitLeft.image && this.frameCurrent < this.sprites.takeHitLeft.frameCount - 1)
      return true;
    if (this.image === this.sprites.takeHitRight.image && this.frameCurrent < this.sprites.takeHitRight.frameCount - 1)
      return true;
  }

  switchSprite(sprite) {
    if (this.blockAnim()) return;

    // overriding all other animations with the death anim
    if (this.image === this.sprites.deathLeft.image) {
      if (this.frameCurrent === this.sprites.deathLeft.frameCount - 1) {
        this.dead = true;
      }
      return;
    }
    if (this.image === this.sprites.deathRight.image) {
      if (this.frameCurrent === this.sprites.deathRight.frameCount - 1) {
        this.dead = true;
      }
      return;
    }

    // this.frameCurrent = 0; // to avoid flashing, when trying to get from 8 frame anim to 2 frame anim
    // for example going from 4th frame to 2 frame anim causes flashing, cause there is no 5th sprite
    switch (sprite) {
      case 'idleLeft':
        if (this.image !== this.sprites.idleLeft.image) {
          this.image = this.sprites.idleLeft.image;
          this.frameCount = this.sprites.idleLeft.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'idleRight':
        if (this.image !== this.sprites.idleRight.image) {
          this.image = this.sprites.idleRight.image;
          this.frameCount = this.sprites.idleRight.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'runRight':
        if (this.image !== this.sprites.runRight.image) {
          this.image = this.sprites.runRight.image;
          this.frameCount = this.sprites.runRight.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'runLeft':
        if (this.image !== this.sprites.runLeft.image) {
          this.image = this.sprites.runLeft.image;
          this.frameCount = this.sprites.runLeft.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'jumpLeft':
        if (this.image !== this.sprites.jumpLeft.image) this.image = this.sprites.jumpLeft.image;
        this.frameCount = this.sprites.jumpLeft.frameCount;
        this.frameCurrent = 0;
        break;
      case 'jumpRight':
        if (this.image !== this.sprites.jumpRight.image) this.image = this.sprites.jumpRight.image;
        this.frameCount = this.sprites.jumpRight.frameCount;
        this.frameCurrent = 0;
        break;

      case 'fallLeft':
        if (this.image !== this.sprites.fallLeft.image) this.image = this.sprites.fallLeft.image;
        this.frameCount = this.sprites.fallLeft.frameCount;
        this.frameCurrent = 0;
        break;
      case 'fallRight':
        if (this.image !== this.sprites.fallRight.image) this.image = this.sprites.fallRight.image;
        this.frameCount = this.sprites.fallRight.frameCount;
        this.frameCurrent = 0;
        break;
      case 'attack1Left':
        if (this.image !== this.sprites.attack1Left.image) this.image = this.sprites.attack1Left.image;
        this.frameCount = this.sprites.attack1Left.frameCount;
        this.frameCurrent = 0;
        break;
      case 'attack2Left':
        if (this.image !== this.sprites.attack2Left.image) this.image = this.sprites.attack2Left.image;
        this.frameCount = this.sprites.attack2Left.frameCount;
        this.frameCurrent = 0;
        break;
      case 'attack1Right':
        if (this.image !== this.sprites.attack1Right.image) this.image = this.sprites.attack1Right.image;
        this.frameCount = this.sprites.attack1Right.frameCount;
        this.frameCurrent = 0;
        break;
      case 'attack2Right':
        if (this.image !== this.sprites.attack2Right.image) this.image = this.sprites.attack2Right.image;
        this.frameCount = this.sprites.attack2Right.frameCount;
        this.frameCurrent = 0;
        break;
      case 'takeHitLeft':
        if (this.image !== this.sprites.takeHitLeft.image) this.image = this.sprites.takeHitLeft.image;
        this.frameCount = this.sprites.takeHitLeft.frameCount;
        this.frameCurrent = 0;
        break;
      case 'takeHitRight':
        if (this.image !== this.sprites.takeHitRight.image) this.image = this.sprites.takeHitRight.image;
        this.frameCount = this.sprites.takeHitRight.frameCount;
        this.frameCurrent = 0;
        break;
      case 'deathLeft':
        if (this.image !== this.sprites.deathLeft.image) this.image = this.sprites.deathLeft.image;
        this.frameCount = this.sprites.deathLeft.frameCount;
        this.frameCurrent = 0;
        break;
      case 'deathRight':
        if (this.image !== this.sprites.deathRight.image) this.image = this.sprites.deathRight.image;
        this.frameCount = this.sprites.deathRight.frameCount;
        this.frameCurrent = 0;
        break;
    }
  }

  takeHit(damage) {
    this.health -= damage;
    gsap.to(this.htmlHealthBar, {
      width: this.health + '%',
    });
    if (this.health <= 0) {
      this.frameCurrent = 0;
     
      this.switchSprite('death' + this.lastDirection);
    } else this.switchSprite('takeHit' + this.lastDirection);
  }
  jump() {
    if (!this.dead)
        this.velocity.y = -10; 
  }
}
