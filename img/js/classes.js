class Sprite {
  constructor({ position }) {
    this.position = position;
    this.height = PLAYER_HEIGHT;
    this.width = PLAYER_WIDTH;
  }

  draw() {

  }

  update() {
    this.draw();
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