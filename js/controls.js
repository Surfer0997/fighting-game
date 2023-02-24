///////////// CONTROLS //////////////

window.addEventListener('keydown', e => {
  // player
  if (!player.dead) {
    switch (e.key) {
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
      case 'в':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'ф':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'ц':
        keys.w.pressed = true;
        break;
      case 'D':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'A':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'W':
        keys.w.pressed = true;
        break;
      case 'В':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'Ф':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'Ц':
        keys.w.pressed = true;
        break;
      case ' ':
        e.preventDefault();
        player.attack();
        break;
    }
  }
  // enemy
  if (!enemy.dead) {
    switch (e.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        e.preventDefault();
        keys.ArrowUp.pressed = true;
        break;
      case 'ArrowDown':
        e.preventDefault();
        break;
      case 'Enter':
        enemy.attack();
        break;
    }
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
    case 'в':
      keys.d.pressed = false;
      break;
    case 'ф':
      keys.a.pressed = false;
      break;
    case 'ц':
      keys.w.pressed = false;
      break;
    case 'D':
      keys.d.pressed = false;
      break;
    case 'A':
      keys.a.pressed = false;
      break;
    case 'W':
      keys.w.pressed = false;
      break;
    case 'В':
      keys.d.pressed = false;
      break;
    case 'Ф':
      keys.a.pressed = false;
      break;
    case 'Ц':
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
