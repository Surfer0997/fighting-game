function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
      rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
  }
  
  function decideWhoWonAndDisplay(timeoutId) {
    displayText.textContent =
      player.health > enemy.health ? 'Player 1 wins!' : player.health < enemy.health ? 'Player 2 wins!' : 'Tie!';
    displayText.style.display = 'flex';
  
    clearTimeout(timeoutId); // stop the timer
  }
  
  
  let timeoutId;
  function decreaseTimer() {
    if (GAME_TIME > 0) {
      GAME_TIME--;
      timeoutId = setTimeout(decreaseTimer, 1000);
      timer.textContent = GAME_TIME;
    } else {
      // end game based on time
      decideWhoWonAndDisplay(timeoutId);
    }
  }