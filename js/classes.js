const MARGIN_FROM_CANVAS_BOTTOM_TO_GROUND = 96;

class Sprite {
  constructor({ position, imageSrc, scale = 1, frameCount = 1, offset = {x:0,y:0}}) {
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
  if (this.framesElapsed % this.framesHold === 0) { // hold animation, to be not on every frame
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
  constructor({ position, velocity, color = 'red', attackOffset, imageSrc, scale = 1, frameCount = 1, offset = {x:0,y:0} }) {
    super({
      position, imageSrc, scale, frameCount, offset
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
      width: ATTACKBOX_WIDTH,
      height: ATTACKBOX_HEIGHT,
    };
    this.isAttacking = false;
    this.health = 100;

    this.frameCurrent = 0;
    this.framesElapsed = 0; // showed frames
    this.framesHold = 5; // for every X frames change sprite position
  }

  update() {
    this.draw();
    this.animateFrames();
    
    this.attackBox.position.x = this.position.x + this.attackBox.attackOffset.x;
    this.attackBox.position.y = this.position.y;

    this.position.y += this.velocity.y; // apply the acceleration
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - MARGIN_FROM_CANVAS_BOTTOM_TO_GROUND) {
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
