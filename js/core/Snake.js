import { GRID_CONFIG, GAME_CONFIG } from '../config.js';

export class Snake {
  constructor() {
    this._body = [];
    this._direction = { x: 1, y: 0 };
    this._nextDirection = { x: 1, y: 0 };
    this._shouldGrow = false;
    this.reset();
  }

  reset() {
    const startX = Math.floor(GRID_CONFIG.WIDTH / 2);
    const startY = Math.floor(GRID_CONFIG.HEIGHT / 2);
    
    this._body = [];
    for (let i = 0; i < GAME_CONFIG.INITIAL_SNAKE_LENGTH; i++) {
      this._body.push({ x: startX - i, y: startY });
    }
    
    this._direction = { x: 1, y: 0 };
    this._nextDirection = { x: 1, y: 0 };
    this._shouldGrow = false;
  }

  setDirection(newDirection) {
    // Prevenir movimiento 180 grados
    if (this._direction.x + newDirection.x === 0 && 
        this._direction.y + newDirection.y === 0) {
      return;
    }
    this._nextDirection = { ...newDirection };
  }

  move() {
    // Actualizar dirección al inicio del movimiento
    this._direction = { ...this._nextDirection };
    
    const head = this.getHead();
    const newHead = {
      x: head.x + this._direction.x,
      y: head.y + this._direction.y
    };

    this._body.unshift(newHead);

    if (!this._shouldGrow) {
      this._body.pop();
    } else {
      this._shouldGrow = false;
    }
  }

  grow() {
    this._shouldGrow = true;
  }

  getHead() {
    return this._body[0];
  }

  getBody() {
    return this._body;
  }

  getLength() {
    return this._body.length;
  }
}