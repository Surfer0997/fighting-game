const MARGIN_FROM_CANVAS_BOTTOM_TO_GROUND = 96;

class Sprite {
  constructor({ position, imageSrc, scale = 1, frameCount = 1 }) {
    this.position = position;
    this.height = 50;
    this.width = 150;
    this.image = new Image(); // native API
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameCount = frameCount;
    this.frameCurrent = 0;
    this.framesElapsed = 0; // showed frames
    this.framesHold = 5; // for every X frames change sprite position
  }

  draw() {
    c.drawImage(
      this.image,

      this.frameCurrent * (this.image.width / this.frameCount), // crop coordinates to animate frames
      0,
      this.image.width / this.frameCount,
      this.image.height,

      this.position.x, // just position
      this.position.y,
      (this.image.width / this.frameCount) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) { // hold animation, to be not on every frame
      if (this.frameCurrent < this.frameCount - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
}

class Fighter {
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
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box drawn
    if (this.isAttacking) {
      c.fillStyle = 'white';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
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
