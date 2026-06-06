export type Vector2 = { x: number, y: number };

export enum CellType {
  EMPTY,
  WALL,
  DESTRUCTIBLE_WALL
}

export interface Bomb {
  x: number;
  y: number;
  timer: number;
  range: number;
  ownerId?: string;
}

export interface ExplosionParticle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'BOMB_UP' | 'RANGE_UP' | 'SPEED_UP';
  life: number;
}

export interface GameState {
  gridWidth: number;
  gridHeight: number;
  grid: CellType[][];
  snake: Vector2[];
  direction: Vector2;
  nextDirection: Vector2;
  apples: Vector2[];
  bombs: Bomb[];
  explosions: ExplosionParticle[];
  powerUps: PowerUp[];
  score: number;
  gameOver: boolean;
  maxBombs: number;
  bombRange: number;
  moveInterval: number;
  lastMoveTime: number;
  combo: number;
  comboTimer: number;
  snakeColor: string;
}

export const CELL_SIZE = 24;

export class GameEngine {
  public state: GameState;
  private onGameOver?: (score: number) => void;
  private onScore?: (score: number) => void;

  constructor(width: number, height: number) {
    this.state = this.getInitialState(width, height);
  }

  public setCallbacks(onGameOver: (score: number) => void, onScore: (score: number) => void) {
    this.onGameOver = onGameOver;
    this.onScore = onScore;
  }

  private getInitialState(width: number, height: number): GameState {
    const grid: CellType[][] = [];
    for (let x = 0; x < width; x++) {
      grid[x] = [];
      for (let y = 0; y < height; y++) {
        // Create an outer boundary and some random destructible walls
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          grid[x][y] = CellType.WALL;
        } else if (Math.random() < 0.1) {
           grid[x][y] = CellType.DESTRUCTIBLE_WALL;
        } else {
          grid[x][y] = CellType.EMPTY;
        }
      }
    }

    return {
      gridWidth: width,
      gridHeight: height,
      grid,
      snake: [{ x: Math.floor(width / 2), y: Math.floor(height / 2) }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      apples: [this.getRandomEmptyCell(grid, width, height)],
      bombs: [],
      explosions: [],
      powerUps: [],
      score: 0,
      gameOver: false,
      maxBombs: 1,
      bombRange: 2,
      moveInterval: 150, // ms between moves
      lastMoveTime: 0,
      combo: 0,
      comboTimer: 0,
      snakeColor: '#39FF14'
    };
  }

  private getRandomEmptyCell(grid: CellType[][], w: number, h: number): Vector2 {
    let x, y;
    do {
      x = Math.floor(Math.random() * (w - 2)) + 1;
      y = Math.floor(Math.random() * (h - 2)) + 1;
    } while (grid[x][y] !== CellType.EMPTY);
    return { x, y };
  }

  public setDirection(dx: number, dy: number) {
    // Prevent 180 degree turns
    if (this.state.snake.length > 1) {
      if (this.state.direction.x === -dx && this.state.direction.y === -dy) return;
    }
    this.state.nextDirection = { x: dx, y: dy };
  }

  public dropBomb() {
    if (this.state.gameOver) return;
    const head = this.state.snake[0];
    
    // Check if max bombs reached
    const activeBombs = this.state.bombs.filter(b => b.ownerId === 'player').length;
    if (activeBombs >= this.state.maxBombs) return;

    // Check if already a bomb here
    if (this.state.bombs.find(b => b.x === head.x && b.y === head.y)) return;

    this.state.bombs.push({
      x: head.x,
      y: head.y,
      timer: 2000, // 2 seconds to explode
      range: this.state.bombRange,
      ownerId: 'player'
    });
  }

  public update(deltaTime: number) {
    if (this.state.gameOver) return;

    const now = Date.now();
    
    // Update combo timer
    if (this.state.comboTimer > 0) {
      this.state.comboTimer -= deltaTime;
      if (this.state.comboTimer <= 0) {
        this.state.combo = 0;
      }
    }

    // Move snake
    if (now - this.state.lastMoveTime > this.state.moveInterval) {
      this.moveSnake();
      this.state.lastMoveTime = now;
    }

    // Update bombs
    this.state.bombs.forEach(bomb => {
      bomb.timer -= deltaTime;
    });

    // Explode bombs
    const explodingBombs = this.state.bombs.filter(b => b.timer <= 0);
    this.state.bombs = this.state.bombs.filter(b => b.timer > 0);

    explodingBombs.forEach(bomb => {
      this.explode(bomb.x, bomb.y, bomb.range);
    });

    // Update explosions
    this.state.explosions = this.state.explosions.map(e => ({
      ...e,
      life: e.life - deltaTime
    })).filter(e => e.life > 0);
    
    // Update powerups
    this.state.powerUps = this.state.powerUps.map(p => ({
      ...p,
      life: p.life - deltaTime
    })).filter(p => p.life > 0);
  }

  private moveSnake() {
    this.state.direction = this.state.nextDirection;
    const currentHead = this.state.snake[0];
    const newHead = {
      x: currentHead.x + this.state.direction.x,
      y: currentHead.y + this.state.direction.y,
    };

    // Check collisions
    // Self collision
    if (this.state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      this.triggerGameOver();
      return;
    }

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= this.state.gridWidth ||
      newHead.y < 0 ||
      newHead.y >= this.state.gridHeight ||
      this.state.grid[newHead.x][newHead.y] !== CellType.EMPTY
    ) {
      this.triggerGameOver();
      return;
    }
    
    // Explosion collision
    if (this.state.explosions.some(e => e.x === newHead.x && e.y === newHead.y)) {
       this.triggerGameOver();
       return;
    }

    // Move body
    this.state.snake.unshift(newHead);

    // Check Apple Eat
    const appleIndex = this.state.apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
    if (appleIndex !== -1) {
      this.state.apples.splice(appleIndex, 1);
      this.state.apples.push(this.getRandomEmptyCell(this.state.grid, this.state.gridWidth, this.state.gridHeight));
      this.addScore(10);
      // Speed up slightly
      this.state.moveInterval = Math.max(50, this.state.moveInterval - 2);
    } else {
      this.state.snake.pop(); // Remove tail if no apple eaten
    }
    
    // Check PowerUp Eat
    const powerUpIndex = this.state.powerUps.findIndex(p => p.x === newHead.x && p.y === newHead.y);
    if (powerUpIndex !== -1) {
      const powerUp = this.state.powerUps[powerUpIndex];
      this.state.powerUps.splice(powerUpIndex, 1);
      
      if (powerUp.type === 'BOMB_UP') this.state.maxBombs++;
      if (powerUp.type === 'RANGE_UP') this.state.bombRange++;
      if (powerUp.type === 'SPEED_UP') {
          // Temporarily? Or permanent? Let's just give points for speed up for now to avoid breaking mechanics.
          this.addScore(50);
      }
      this.addScore(25);
    }
  }

  private explode(x: number, y: number, range: number) {
    this.state.combo++;
    this.state.comboTimer = 3000;
    const pointsMul = this.state.combo;
    
    let blocksDestroyed = 0;

    const addExplosion = (ex: number, ey: number) => {
      this.state.explosions.push({
        x: ex, y: ey, life: 300, maxLife: 300, color: '#f00'
      });
      
      // Check if it kills snake
      if (this.state.snake.some(s => s.x === ex && s.y === ey)) {
        this.triggerGameOver();
      }
      
      // Chain reaction
      const bombIndex = this.state.bombs.findIndex(b => b.x === ex && b.y === ey);
      if (bombIndex !== -1) {
          this.state.bombs[bombIndex].timer = 0; // Trigger it instantly
      }
    };

    addExplosion(x, y);

    const directions = [ {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1} ];

    for (const dir of directions) {
      for (let i = 1; i <= range; i++) {
        const ex = x + dir.dx * i;
        const ey = y + dir.dy * i;

        if (ex < 0 || ex >= this.state.gridWidth || ey < 0 || ey >= this.state.gridHeight) break;

        const cell = this.state.grid[ex][ey];
        if (cell === CellType.WALL) break;

        addExplosion(ex, ey);

        if (cell === CellType.DESTRUCTIBLE_WALL) {
          this.state.grid[ex][ey] = CellType.EMPTY;
          blocksDestroyed++;
          
          // Chance to spawn powerup
          if (Math.random() < 0.15) {
              const types: ('BOMB_UP' | 'RANGE_UP' | 'SPEED_UP')[] = ['BOMB_UP', 'RANGE_UP', 'SPEED_UP'];
              this.state.powerUps.push({
                  x: ex, y: ey, type: types[Math.floor(Math.random() * types.length)], life: 10000
              })
          }
          break; // Explosion stops at wall
        }
      }
    }
    
    if (blocksDestroyed > 0) {
        this.addScore(blocksDestroyed * 5 * pointsMul);
    }
  }

  private addScore(amount: number) {
    this.state.score += amount;
    if (this.onScore) this.onScore(this.state.score);
  }

  private triggerGameOver() {
    this.state.gameOver = true;
    if (this.onGameOver) this.onGameOver(this.state.score);
  }
}
