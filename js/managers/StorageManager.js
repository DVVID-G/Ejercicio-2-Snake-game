import { GRID_CONFIG } from '../config.js';

class StorageManagerLogic {
  constructor() {
    this.storageKey = 'snakeTop10';
  }

  getScores() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading scores:', e);
      return [];
    }
  }

  saveScores(scores) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(scores));
      return true;
    } catch (e) {
      console.error('Error saving scores:', e);
      return false;
    }
  }

  addNewScore(playerName, score) {
    const scores = this.getScores();
    
    const newScore = {
      id: this.generateUUID(),
      playerName: playerName.toUpperCase().substring(0, 3),
      score: score,
      date: new Date().toISOString(),
      gridSize: `${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}`
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    
    const top10 = scores.slice(0, 10);
    this.saveScores(top10);
    
    return top10;
  }

  isTopScore(score) {
    const scores = this.getScores();
    if (scores.length < 10) return true;
    return score > scores[scores.length - 1].score;
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

const logic = new StorageManagerLogic();

export class StorageManager {
  static getTop10() {
    return logic.getScores();
  }

  static addScore(playerName, score) {
    return logic.addNewScore(playerName, score);
  }

  static isTopScore(score) {
    return logic.isTopScore(score);
  }
}