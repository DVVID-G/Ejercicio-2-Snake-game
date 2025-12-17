export const GRID_CONFIG = Object.freeze({
  CELL_SIZE: 20,
  WIDTH: 20,
  HEIGHT: 20,
  get CANVAS_WIDTH() { return this.CELL_SIZE * this.WIDTH; },
  get CANVAS_HEIGHT() { return this.CELL_SIZE * this.HEIGHT; }
});

export const GAME_CONFIG = Object.freeze({
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 5,
  MIN_SPEED: 50,
  INITIAL_SNAKE_LENGTH: 3,
  FOOD_SCORE_VALUE: 10
});

export const GAME_STATE = Object.freeze({
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER'
});

export const COLORS = Object.freeze({
  BACKGROUND: '#1a1a2e',
  SNAKE_HEAD: '#4CAF50',
  SNAKE_BODY: '#45a049',
  FOOD: '#f44336',
  GRID_LINE: 'rgba(255, 255, 255, 0.05)'
});