import { GAME_STATE, GAME_CONFIG, GRID_CONFIG } from '../config.js';
import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { InputManager } from '../managers/InputManager.js';
import { CollisionManager } from '../managers/CollisionManager.js';
import { StorageManager } from '../managers/StorageManager.js';
import { Renderer } from '../managers/Renderer.js';

export class Game {
  constructor() {
    this.state = GAME_STATE.MENU;
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    
    this._initializeDOM();
  }

  _initializeDOM() {
    this.screens = {
      menu: document.getElementById('menu-screen'),
      game: document.getElementById('game-screen'),
      gameover: document.getElementById('gameover-screen')
    };

    this.elements = {
      finalScore: document.getElementById('final-score'),
      nameInputContainer: document.getElementById('name-input-container'),
      nameInput: document.getElementById('player-name-input'),
      scoresBody: document.getElementById('scores-body')
    };
  }

  initialize() {
    Renderer.initialize('game-canvas');
    this._switchScreen(GAME_STATE.MENU);
    this._updateScoresTable();
  }

  startGame() {
    this.snake.reset();
    this.food.respawn(this.snake.getBody());
    this.score = 0;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    InputManager.clearBuffer();
    
    this._switchScreen(GAME_STATE.PLAYING);
    this.state = GAME_STATE.PLAYING;
  }

  update() {
    if (this.state !== GAME_STATE.PLAYING) return;

    // Procesar input
    const newDirection = InputManager.getBufferedDirection();
    if (newDirection) {
      this.snake.setDirection(newDirection);
    }

    // Mover serpiente
    this.snake.move();
    const head = this.snake.getHead();

    // Verificar colisiones con paredes
    if (CollisionManager.checkWallCollision(head, GRID_CONFIG.WIDTH, GRID_CONFIG.HEIGHT)) {
      this.gameOver();
      return;
    }

    // Verificar auto-colisión
    if (CollisionManager.checkSelfCollision(head, this.snake.getBody())) {
      this.gameOver();
      return;
    }

    // Verificar colisión con comida
    if (CollisionManager.checkFoodCollision(head, this.food.getPosition())) {
      this.snake.grow();
      this.score += GAME_CONFIG.FOOD_SCORE_VALUE;
      
      // Aumentar velocidad
      this.speed = Math.max(
        GAME_CONFIG.MIN_SPEED,
        this.speed - GAME_CONFIG.SPEED_INCREMENT
      );
      
      // Respawn de comida
      this.food.respawn(this.snake.getBody());
    }
  }

  draw() {
    if (this.state !== GAME_STATE.PLAYING) return;

    Renderer.clear();
    Renderer.drawSnake(this.snake.getBody());
    Renderer.drawFood(this.food.getPosition());
    Renderer.updateHUD(this.score, this.speed);
  }

  gameOver() {
    this.state = GAME_STATE.GAMEOVER;
    this._switchScreen(GAME_STATE.GAMEOVER);
    
    this.elements.finalScore.textContent = this.score;
    
    // Verificar si es top score
    if (StorageManager.isTopScore(this.score)) {
      this.elements.nameInputContainer.classList.remove('hidden');
      this.elements.nameInput.value = '';
      this.elements.nameInput.focus();
    } else {
      this.elements.nameInputContainer.classList.add('hidden');
    }
  }

  saveScore() {
    const playerName = this.elements.nameInput.value.toUpperCase();
    
    if (playerName.length !== 3) {
      alert('El nombre debe tener exactamente 3 letras');
      return;
    }

    StorageManager.addScore(playerName, this.score);
    this.elements.nameInputContainer.classList.add('hidden');
    this._updateScoresTable();
  }

  backToMenu() {
    this.state = GAME_STATE.MENU;
    this._switchScreen(GAME_STATE.MENU);
    this._updateScoresTable();
  }

  _switchScreen(newState) {
    // Ocultar todas las pantallas
    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('active');
      screen.classList.add('hidden');
    });

    // Mostrar pantalla correspondiente
    switch (newState) {
      case GAME_STATE.MENU:
        this.screens.menu.classList.remove('hidden');
        this.screens.menu.classList.add('active');
        break;
      case GAME_STATE.PLAYING:
        this.screens.game.classList.remove('hidden');
        this.screens.game.classList.add('active');
        break;
      case GAME_STATE.GAMEOVER:
        this.screens.gameover.classList.remove('hidden');
        this.screens.gameover.classList.add('active');
        break;
    }
  }

  _updateScoresTable() {
    const scores = StorageManager.getTop10();
    const tbody = this.elements.scoresBody;
    
    tbody.innerHTML = '';
    
    if (scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; opacity:0.5;">No hay puntuaciones aún</td></tr>';
      return;
    }

    scores.forEach((score, index) => {
      const row = document.createElement('tr');
      const date = new Date(score.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.playerName}</td>
        <td>${score.score}</td>
        <td>${date}</td>
      `;
      
      tbody.appendChild(row);
    });
  }

  getCurrentSpeed() {
    return this.speed;
  }

  getState() {
    return this.state;
  }
}