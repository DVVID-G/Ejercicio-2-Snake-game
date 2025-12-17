import { GRID_CONFIG } from '../config.js';

export class Food {
  constructor() {
    this._position = { x: 0, y: 0 };
  }

  respawn(occupiedPositions) {
    // Algoritmo Grid Filling
    const allPositions = [];
    
    for (let x = 0; x < GRID_CONFIG.WIDTH; x++) {
      for (let y = 0; y < GRID_CONFIG.HEIGHT; y++) {
        allPositions.push({ x, y });
      }
    }

    // Filtrar posiciones ocupadas
    const availablePositions = allPositions.filter(pos => 
      !occupiedPositions.some(occupied => 
        occupied.x === pos.x && occupied.y === pos.y
      )
    );

    if (availablePositions.length === 0) {
      // Juego ganado (grid lleno)
      this._position = { x: -1, y: -1 };
      return;
    }

    // Seleccionar posición aleatoria de las disponibles
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    this._position = availablePositions[randomIndex];
  }

  getPosition() {
    return this._position;
  }
}