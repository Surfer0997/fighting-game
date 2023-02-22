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
  }) {
    super({
      position,
      imageSrc,
      scale,
      frameCount,
      offset,
    });
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
    }
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
    this.switchSprite('attack1');
  }

  switchSprite(sprite) {
    // overriding all other animations with the attack anim
    if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.frameCount - 1) return; // to disable sprite change while attacking
    // overriding all other animations with the take hit anim
    if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.frameCount - 1) return;

    // overriding all other animations with the death anim
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frameCount - 1) {
        this.dead = true;
      }
      return;
    }

    // this.frameCurrent = 0; // to avoid flashing, when trying to get from 8 frame anim to 2 frame anim
    // for example going from 4th frame to 2 frame anim causes flashing, cause there is no 5th sprite
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameCount = this.sprites.idle.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameCount = this.sprites.run.frameCount;
          this.frameCurrent = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) this.image = this.sprites.jump.image;
        this.frameCount = this.sprites.jump.frameCount;
        this.frameCurrent = 0;
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image) this.image = this.sprites.fall.image;
        this.frameCount = this.sprites.fall.frameCount;
        this.frameCurrent = 0;
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) this.image = this.sprites.attack1.image;
        this.frameCount = this.sprites.attack1.frameCount;
        this.frameCurrent = 0;
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) this.image = this.sprites.takeHit.image;
        this.frameCount = this.sprites.takeHit.frameCount;
        this.frameCurrent = 0;
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) this.image = this.sprites.death.image;
        this.frameCount = this.sprites.death.frameCount;
        this.frameCurrent = 0;
        break;
    }
  }

  takeHit(damage) {
    this.health -= damage;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else this.switchSprite('takeHit');
  }
}
