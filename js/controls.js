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
        keys.ArrowUp.pressed = true;
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
    // enemy
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      e.preventDefault();
      keys.ArrowUp.pressed = false;
      break;
    case 'ArrowDown':
      e.preventDefault();
      break;
  }
});
