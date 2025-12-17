export class GameLoop {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.isRunning = false;
    this.rafId = null;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;
    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick(currentTime) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += deltaTime;

    const currentSpeed = this.game.getCurrentSpeed();
    
    if (this.accumulatedTime >= currentSpeed) {
      this.accumulatedTime = 0;
      this.game.update();
      this.game.draw();
    }

    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }
}