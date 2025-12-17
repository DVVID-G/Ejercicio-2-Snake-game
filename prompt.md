# Documento de Diseño Técnico (TDD) - Snake Game
**Versión**: 10/10 - 100% Funcional en Primera Iteración
**Arquitecto**: Senior Fullstack + Validador de Integración ES6
**Stack**: HTML5 Canvas, CSS3, JavaScript ES6+, Sin Frameworks

---

## 1. CONVENCIONES DE CÓDIGO NO NEGOCIABLES

### **1.1 Regla de Exportación Única (CRÍTICO - P0)**
Cada archivo `.js` en `js/managers/` y `js/core/` exportará **EXACTAMENTE UNA** clase con el **MISMO NOMBRE que el archivo** (sin sufijos).

**✅ CORRECTO**:
"""
// js/managers/InputManager.js
export class InputManager {
  static metodo() { /* ... */ }
}
"""
❌ PROHIBIDO:

// NO usar: export class InputManagerStatic
// NO usar: export const inputManager = new ...
// NO usar: export default

1.2 Verificación Cruzada Obligatoria
Antes de generar código, completa esta tabla demostrando coherencia:

Archivo    Clase Exportada    Importado En    Nombre Coincide
GameLoop.js    GameLoop    main.js    Sí
InputManager.js    InputManager    Game.js    Sí
StorageManager.js    StorageManager    Game.js    Sí
CollisionManager.js    CollisionManager    Game.js    Sí
Renderer.js    Renderer    Game.js    Sí
Game.js    Game    main.js    Sí
Snake.js    Snake    Game.js    Sí
Food.js    Food    Game.js    Sí

2. ESTRUCTURA DE ARCHIVOS CERRADA

/snake-game
├── index.html              # Entry point
├── css/
│   └── style.css           # Estilos y estados visuales
└── js/
    ├── main.js             # Inicialización y Game Loop
    ├── config.js           # Constantes globales (inmutables)
    ├── core/
    │   ├── Game.js         # Orquestador de estados (MENU/PLAYING/GAMEOVER)
    │   ├── GameLoop.js     # Bucle principal con requestAnimationFrame
    │   ├── Snake.js        # Lógica de movimiento y crecimiento
    │   └── Food.js         # Generación de posiciones
    ├── managers/
    │   ├── InputManager.js # Buffer de teclado (static)
    │   ├── CollisionManager.js # Detección de colisiones (static)
    │   ├── StorageManager.js # Persistencia localStorage (static)
    │   └── Renderer.js     # Renderizado canvas (static)
    └── utils/
        └── helpers.js      # Funciones puras (opcional)

3. PATRÓN DE CÓDIGO DE REFERENCIA

Replicar EXACTAMENTE esta estructura en todos los managers:
"""
// js/managers/CollisionManager.js - PATRÓN A REPLICAR
class CollisionManagerLogic {
  // Lógica interna con estado si es necesario
  checkWall(head, width, height) {
    return head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;
  }
}

const logic = new CollisionManagerLogic();

export class CollisionManager {
  // TODOS los métodos públicos son ESTÁTICOS
  static checkWallCollision(head, gridWidth, gridHeight) {
    return logic.checkWall(head, gridWidth, gridHeight);
  }
 
  static checkSelfCollision(head, snakeBody) {
    // Implementación directa también permitida
    return snakeBody.some((segment, index) =>
      index !== 0 && segment.x === head.x && segment.y === head.y
    );
  }
}
"""

REGLAS:
NUNCA exportes la clase interna (CollisionManagerLogic)
SIEMPRE exporta una clase con el nombre del archivo
TODOS los métodos públicos deben ser static
NUNCA uses export default

4. REQUERIMIENTOS FUNCIONALES

4.1 Core
Serpiente inicia en centro del grid (GRID_WIDTH/2, GRID_HEIGHT/2)
Movimiento continuo en dirección actual
Controles: ArrowUp, ArrowDown, ArrowLeft, ArrowRight
Prevenir movimiento 180° (no retroceder sobre sí misma)

4.2 Mecánicas
Comida:
Renderizada como círculo rojo
Posición aleatoria que NO coincida con ninguna celda de la serpiente
Algoritmo: Grid filling (preferido) o reintento con límites
Crecimiento:
Cada comida aumenta longitud en +1 segmento
Velocidad aumenta -5ms por comida (mínimo 50ms)
Puntuación: +10 puntos por comida
Colisiones:
Game Over al chocar con paredes
Game Over al chocar con propio cuerpo (excluyendo cabeza)
Persistencia:
Top 10 en localStorage bajo clave snakeTop10
Al perder: Si puntuación entra en Top 10, mostrar input para nombre (3 letras mayúsculas)
Guardar: { id: UUID, playerName, score, date: ISO, gridSize }
Interfaz:
3 estados: MENU → PLAYING → GAMEOVER (máquina de estados finita)
Canvas centrado, manteniendo aspect ratio
Tabla de posiciones ordenada descendente

5. DEFINICIÓN DE ESTRUCTURAS DE DATOS

5.1 Serpiente en Memoria
"""
// Propiedad privada _body en Snake.js
this._body = [
  { x: 10, y: 10 }, // Cabeza (índice 0)
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
this._direction = { x: 1, y: 0 }; // Vector unitario
5.2 JSON localStorage
JSON
Copy
{
  "snakeTop10": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "playerName": "AAA",
      "score": 150,
      "date": "2025-12-06T14:30:00.000Z",
      "gridSize": "20x20"
    }
  ]
}
"""
5.3 Constantes Globales (config.js)
"""
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
"""

6. DIAGRAMA DE FLUJO LÓGICO

6.1 Game Loop (GameLoop.js)
"""
export class GameLoop {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    requestAnimationFrame(this.tick.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  tick(currentTime) {
    if (!this.isRunning) return;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime >= this.game.getCurrentSpeed()) {
      this.accumulatedTime = 0;
      this.game.update(); // UPDATE PHASE
      this.game.draw();   // DRAW PHASE
    }
    requestAnimationFrame(this.tick.bind(this));
  }
}
"""
6.2 Lógica de Colisiones (CollisionManager.js)
"""
export class CollisionManager {
  static checkWallCollision(head, gridWidth, gridHeight) {
    return head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight;
  }

  static checkSelfCollision(head, snakeBody) {
    return snakeBody.some((segment, index) =>
      index !== 0 && segment.x === head.x && segment.y === head.y
    );
  }

  static checkFoodCollision(head, foodPosition) {
    return head.x === foodPosition.x && head.y === foodPosition.y;
  }
}
"""

7. GESTIÓN DE ESTADOS Y UI

7.1 Estados del Juego
MENU: Pantalla inicial, esperando "Jugar"
PLAYING: Juego activo, input habilitado, bucle corriendo
GAMEOVER: Pantalla final, input deshabilitado, muestra formulario de nombre si aplica
7.2 Transiciones Permitidas
Copy
MENU --(startGame)--> PLAYING
PLAYING --(collision)--> GAMEOVER
GAMEOVER --(restart)--> PLAYING
GAMEOVER --(backToMenu)--> MENU
7.3 Control de Visibilidad DOM
"""
.screen.hidden { display: none !important; }
.screen.active { display: flex !important; }
"""
"""
Estado    Elementos Visibles    Elementos Ocultos
MENU    #menu-screen    #game-screen, #gameover-screen
PLAYING    #game-screen, #hud    #menu-screen, #gameover-screen
GAMEOVER    #gameover-screen    #menu-screen, #game-screen}
"""
8. PLAN DE IMPLEMENTACIÓN (PASO A PASO)
Fase 1: Esqueleto
Crear directorios /css, /js, /js/core, /js/managers, /js/utils
Crear index.html con 3 pantallas (MENU, PLAYING, GAMEOVER)
Crear css/style.css con clases .screen, .hidden, .active
Crear js/config.js con todas las constantes (GRID, GAME, COLORS, STATE)
Fase 2: Lógica de Dominio
js/core/Snake.js: Propiedad _body, métodos move(), grow(), setDirection(), getHead(), getBody()
js/core/Food.js: Método respawn(occupiedPositions) con algoritmo grid-filling
Fase 3: Managers (Seguir PATRÓN OBLIGATORIO)
js/managers/CollisionManager.js: Métodos estáticos puros
js/managers/Renderer.js: Inicializa canvas, métodos drawSnake, drawFood, drawHUD
js/managers/InputManager.js: PATRÓN - Clase interna + export estática
js/managers/StorageManager.js: PATRÓN - Clase interna + export estática
Fase 4: Orquestación
js/core/Game.js: Máquina de estados, método update() con switch, método draw()
js/core/GameLoop.js: DEBE EXISTIR - Implementar RAF con delta time
js/main.js: Instanciar Game y GameLoop, conectar eventos de botones
Fase 5: Integración
Conectar DOMContentLoaded para inicializar
Implementar Game._switchScreen(state) con classList.toggle
Testear flujo completo: carga → jugar → mover → comer → chocar → guardar → reiniciar
9. GENERACIÓN DE CÓDIGO FINAL
Instrucción: Genera TODO EL CÓDIGO de cada archivo listado en la estructura de archivos (Sección 2) en bloques separados de markdown.
ANTES de generar código, completa la tabla de validación cruzada de la Sección 1.2.
Cada archivo debe cumplir:
✅ Ningún export adicional fuera de la clase principal
✅ Todos los métodos públicos son static
✅ Nombre de clase exportada = nombre del archivo
✅ Código completo y ejecutable sin modificaciones

10. VALIDACIÓN POST-GENERACIÓN (Checklist QA)
[ ] index.html carga sin errores 404
[ ] Consola cero SyntaxError: The requested module ... does not provide an export
[ ] GameLoop.js existe y es importado en main.js
[ ] InputManager.getBufferedDirection() es callable desde Game.js
[ ] StorageManager.addScore() es callable desde Game.js
[ ] Teclas de flecha controlan serpiente
[ ] Colisiones funcionan (pared y auto-colisión)
[ ] Puntuación persiste en localStorage y muestra Top 10
[ ] Transiciones de UI funcionan (MENU → PLAYING → GAMEOVER → MENU)
Resultado Esperado: Código funcional al pegar todos los archivos en un servidor estático (live-server, http-server, etc.) sin modificaciones.