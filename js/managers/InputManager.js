class InputManagerLogic {
  constructor() {
    this.bufferedDirection = null;
    this.keyMap = {
      'ArrowUp': { x: 0, y: -1 },
      'ArrowDown': { x: 0, y: 1 },
      'ArrowLeft': { x: -1, y: 0 },
      'ArrowRight': { x: 1, y: 0 }
    };
    this.initialize();
  }

  initialize() {
    document.addEventListener('keydown', (e) => {
      if (this.keyMap[e.key]) {
        e.preventDefault();
        this.bufferedDirection = this.keyMap[e.key];
      }
    });
  }

  getBuffered() {
    const direction = this.bufferedDirection;
    this.bufferedDirection = null;
    return direction;
  }

  clearBuffer() {
    this.bufferedDirection = null;
  }
}

const logic = new InputManagerLogic();

export class InputManager {
  static getBufferedDirection() {
    return logic.getBuffered();
  }

  static clearBuffer() {
    logic.clearBuffer();
  }
}