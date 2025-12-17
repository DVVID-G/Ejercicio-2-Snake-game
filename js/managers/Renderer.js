import { GRID_CONFIG, COLORS } from '../config.js';

class RendererLogic {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  initialize(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }
    
    this.canvas.width = GRID_CONFIG.CANVAS_WIDTH;
    this.canvas.height = GRID_CONFIG.CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext('2d');
  }

  clear() {
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  drawGrid() {
    this.ctx.strokeStyle = COLORS.GRID_LINE;
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= GRID_CONFIG.WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * GRID_CONFIG.CELL_SIZE, 0);
      this.ctx.lineTo(x * GRID_CONFIG.CELL_SIZE, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= GRID_CONFIG.HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * GRID_CONFIG.CELL_SIZE);
      this.ctx.lineTo(this.canvas.width, y * GRID_CONFIG.CELL_SIZE);
      this.ctx.stroke();
    }
  }

  drawSnake(snakeBody) {
    snakeBody.forEach((segment, index) => {
      const x = segment.x * GRID_CONFIG.CELL_SIZE;
      const y = segment.y * GRID_CONFIG.CELL_SIZE;
      
      this.ctx.fillStyle = index === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY;
      this.ctx.fillRect(x + 1, y + 1, GRID_CONFIG.CELL_SIZE - 2, GRID_CONFIG.CELL_SIZE - 2);
      
      if (index === 0) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x + 4, y + 4, 5, 5);
        this.ctx.fillRect(x + GRID_CONFIG.CELL_SIZE - 9, y + 4, 5, 5);
      }
    });
  }

  drawFood(foodPosition) {
    const centerX = (foodPosition.x * GRID_CONFIG.CELL_SIZE) + (GRID_CONFIG.CELL_SIZE / 2);
    const centerY = (foodPosition.y * GRID_CONFIG.CELL_SIZE) + (GRID_CONFIG.CELL_SIZE / 2);
    const radius = (GRID_CONFIG.CELL_SIZE / 2) - 2;

    this.ctx.fillStyle = COLORS.FOOD;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(centerX - 3, centerY - 3, radius / 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  updateHUD(score, speed) {
    const scoreElement = document.getElementById('current-score');
    const speedElement = document.getElementById('current-speed');
    
    if (scoreElement) scoreElement.textContent = score;
    if (speedElement) speedElement.textContent = `${speed}ms`;
  }
}

const logic = new RendererLogic();

export class Renderer {
  static initialize(canvasId) {
    logic.initialize(canvasId);
  }

  static clear() {
    logic.clear();
  }

  static drawSnake(snakeBody) {
    logic.drawSnake(snakeBody);
  }

  static drawFood(foodPosition) {
    logic.drawFood(foodPosition);
  }

  static updateHUD(score, speed) {
    logic.updateHUD(score, speed);
  }
}