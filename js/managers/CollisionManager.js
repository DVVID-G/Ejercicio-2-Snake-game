class CollisionManagerLogic {
  checkWall(head, width, height) {
    return head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;
  }

  checkSelf(head, snakeBody) {
    return snakeBody.some((segment, index) => 
      index !== 0 && segment.x === head.x && segment.y === head.y
    );
  }

  checkFood(head, foodPosition) {
    return head.x === foodPosition.x && head.y === foodPosition.y;
  }
}

const logic = new CollisionManagerLogic();

export class CollisionManager {
  static checkWallCollision(head, gridWidth, gridHeight) {
    return logic.checkWall(head, gridWidth, gridHeight);
  }

  static checkSelfCollision(head, snakeBody) {
    return logic.checkSelf(head, snakeBody);
  }

  static checkFoodCollision(head, foodPosition) {
    return logic.checkFood(head, foodPosition);
  }
}