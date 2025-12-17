import { Game } from './core/Game.js';
import { GameLoop } from './core/GameLoop.js';

let game = null;
let gameLoop = null;

function initializeGame() {
  game = new Game();
  game.initialize();
  
  gameLoop = new GameLoop(game);

  // Conectar botones
  const btnStart = document.getElementById('btn-start');
  const btnRestart = document.getElementById('btn-restart');
  const btnMenu = document.getElementById('btn-menu');
  const btnSaveScore = document.getElementById('btn-save-score');
  const playerNameInput = document.getElementById('player-name-input');

  btnStart.addEventListener('click', () => {
    game.startGame();
    gameLoop.start();
  });

  btnRestart.addEventListener('click', () => {
    gameLoop.stop();
    game.startGame();
    gameLoop.start();
  });

  btnMenu.addEventListener('click', () => {
    gameLoop.stop();
    game.backToMenu();
  });

  btnSaveScore.addEventListener('click', () => {
    game.saveScore();
  });

  // Enter para guardar puntuación
  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      game.saveScore();
    }
  });

  // Forzar mayúsculas en input
  playerNameInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
  });
}

document.addEventListener('DOMContentLoaded', initializeGame);