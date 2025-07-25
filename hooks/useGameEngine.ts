import { useRef, useEffect, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'platform' | 'enemy' | 'collectible' | 'powerup';
  sprite?: string;
  velocityX?: number;
  velocityY?: number;
  collected?: boolean;
  direction?: number; // -1 for left, 1 for right
}

export interface Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  onGround: boolean;
  direction: number;
  width: number;
  height: number;
}

export function useGameEngine() {
  const playerRef = useRef<Player>({
    x: 50,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    direction: 1,
    width: 50,
    height: 50,
  });

  const cameraXRef = useRef(0);
  const gameObjectsRef = useRef<GameObject[]>([
    // Ground platforms
    { id: 'ground1', x: 0, y: 400, width: 800, height: 50, type: 'platform' },
    { id: 'ground2', x: 800, y: 400, width: 800, height: 50, type: 'platform' },
    { id: 'ground3', x: 1600, y: 400, width: 800, height: 50, type: 'platform' },
    
    // Floating platforms
    { id: 'platform1', x: 200, y: 300, width: 150, height: 20, type: 'platform' },
    { id: 'platform2', x: 400, y: 250, width: 150, height: 20, type: 'platform' },
    { id: 'platform3', x: 600, y: 200, width: 150, height: 20, type: 'platform' },
    { id: 'platform4', x: 900, y: 320, width: 150, height: 20, type: 'platform' },
    { id: 'platform5', x: 1200, y: 280, width: 150, height: 20, type: 'platform' },
    { id: 'platform6', x: 1500, y: 220, width: 150, height: 20, type: 'platform' },
    
    // Moving enemies
    { id: 'enemy1', x: 300, y: 360, width: 40, height: 40, type: 'enemy', sprite: '🐱', velocityX: -1, direction: -1 },
    { id: 'enemy2', x: 500, y: 210, width: 40, height: 40, type: 'enemy', sprite: '🐿️', velocityX: 1, direction: 1 },
    { id: 'enemy3', x: 1000, y: 280, width: 40, height: 40, type: 'enemy', sprite: '🐱', velocityX: -1.5, direction: -1 },
    { id: 'enemy4', x: 1300, y: 180, width: 40, height: 40, type: 'enemy', sprite: '🐿️', velocityX: 1.2, direction: 1 },
    
    // Collectibles
    { id: 'bone1', x: 250, y: 270, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone2', x: 450, y: 220, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone3', x: 650, y: 170, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone4', x: 950, y: 290, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone5', x: 1250, y: 250, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone6', x: 1550, y: 190, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    
    // Power-ups
    { id: 'powerup1', x: 350, y: 260, width: 35, height: 35, type: 'powerup', sprite: '⚡' },
    { id: 'powerup2', x: 750, y: 360, width: 35, height: 35, type: 'powerup', sprite: '🔥' },
    { id: 'powerup3', x: 1150, y: 240, width: 35, height: 35, type: 'powerup', sprite: '🌪️' },
  ]);

  const animatedPlayerX = useRef(new Animated.Value(50)).current;
  const animatedPlayerY = useRef(new Animated.Value(300)).current;
  const animatedCameraX = useRef(new Animated.Value(0)).current;

  // Physics constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const MAX_FALL_SPEED = 12;

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);

  // Update player physics
  const updatePlayer = useCallback(() => {
    const player = playerRef.current;
    
    // Apply gravity
    if (!player.onGround) {
      player.velocityY += GRAVITY;
      if (player.velocityY > MAX_FALL_SPEED) {
        player.velocityY = MAX_FALL_SPEED;
      }
    }

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Check platform collisions
    player.onGround = false;
    const platforms = gameObjectsRef.current.filter(obj => obj.type === 'platform');
    
    for (const platform of platforms) {
      if (checkCollision(player, platform)) {
        // Landing on top of platform
        if (player.velocityY > 0 && player.y < platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.onGround = true;
        }
        // Hitting platform from below
        else if (player.velocityY < 0 && player.y > platform.y) {
          player.y = platform.y + platform.height;
          player.velocityY = 0;
        }
        // Side collisions
        else if (player.velocityX > 0 && player.x < platform.x) {
          player.x = platform.x - player.width;
          player.velocityX = 0;
        }
        else if (player.velocityX < 0 && player.x > platform.x) {
          player.x = platform.x + platform.width;
          player.velocityX = 0;
        }
      }
    }

    // Keep player in bounds
    if (player.x < 0) {
      player.x = 0;
      player.velocityX = 0;
    }
    if (player.y > screenHeight) {
      // Player fell off screen - reset position
      player.x = 50;
      player.y = 300;
      player.velocityX = 0;
      player.velocityY = 0;
    }

    // Update camera to follow player
    const targetCameraX = Math.max(0, player.x - screenWidth / 3);
    cameraXRef.current = targetCameraX;

    // Animate player position
    Animated.timing(animatedPlayerX, {
      toValue: player.x - cameraXRef.current,
      duration: 16,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedPlayerY, {
      toValue: player.y,
      duration: 16,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedCameraX, {
      toValue: cameraXRef.current,
      duration: 16,
      useNativeDriver: false,
    }).start();
  }, [checkCollision, animatedPlayerX, animatedPlayerY, animatedCameraX]);

  // Update enemies
  const updateEnemies = useCallback(() => {
    const enemies = gameObjectsRef.current.filter(obj => obj.type === 'enemy');
    const platforms = gameObjectsRef.current.filter(obj => obj.type === 'platform');

    enemies.forEach(enemy => {
      if (!enemy.velocityX) return;

      // Move enemy
      enemy.x += enemy.velocityX;

      // Check if enemy is about to fall off platform or hit wall
      let onPlatform = false;
      for (const platform of platforms) {
        // Check if enemy is on this platform
        if (enemy.y + enemy.height >= platform.y && 
            enemy.y + enemy.height <= platform.y + platform.height + 5 &&
            enemy.x + enemy.width > platform.x && 
            enemy.x < platform.x + platform.width) {
          onPlatform = true;
          
          // Check if enemy is about to walk off the edge
          if ((enemy.velocityX! > 0 && enemy.x + enemy.width >= platform.x + platform.width) ||
              (enemy.velocityX! < 0 && enemy.x <= platform.x)) {
            enemy.velocityX = -enemy.velocityX!;
            enemy.direction = -enemy.direction!;
          }
          break;
        }
      }

      // If not on any platform, reverse direction
      if (!onPlatform) {
        enemy.velocityX = -enemy.velocityX!;
        enemy.direction = -enemy.direction!;
      }
    });
  }, []);

  // Check collectible collisions
  const checkCollectibles = useCallback((onCollect: (type: string, id: string, sprite?: string) => void) => {
    const player = playerRef.current;
    const collectibles = gameObjectsRef.current.filter(obj => 
      (obj.type === 'collectible' || obj.type === 'powerup') && !obj.collected
    );

    collectibles.forEach(item => {
      if (checkCollision(player, item)) {
        item.collected = true;
        onCollect(item.type, item.id, item.sprite);
      }
    });
  }, [checkCollision]);

  // Check enemy collisions
  const checkEnemyCollisions = useCallback((onHit: () => void) => {
    const player = playerRef.current;
    const enemies = gameObjectsRef.current.filter(obj => obj.type === 'enemy');

    enemies.forEach(enemy => {
      if (checkCollision(player, enemy)) {
        // Check if player is jumping on enemy (from above)
        if (player.velocityY > 0 && player.y < enemy.y - 10) {
          // Player defeats enemy
          enemy.collected = true;
          player.velocityY = JUMP_FORCE / 2; // Small bounce
        } else {
          // Player gets hit
          onHit();
        }
      }
    });
  }, [checkCollision, JUMP_FORCE]);

  // Player controls
  const moveLeft = useCallback(() => {
    playerRef.current.velocityX = -MOVE_SPEED;
    playerRef.current.direction = -1;
  }, [MOVE_SPEED]);

  const moveRight = useCallback(() => {
    playerRef.current.velocityX = MOVE_SPEED;
    playerRef.current.direction = 1;
  }, [MOVE_SPEED]);

  const stopMoving = useCallback(() => {
    playerRef.current.velocityX = 0;
  }, []);

  const jump = useCallback(() => {
    if (playerRef.current.onGround) {
      playerRef.current.velocityY = JUMP_FORCE;
      playerRef.current.onGround = false;
    }
  }, [JUMP_FORCE]);

  // Game loop
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const startGameLoop = useCallback((
    onCollect: (type: string, id: string, sprite?: string) => void,
    onHit: () => void
  ) => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      updatePlayer();
      updateEnemies();
      checkCollectibles(onCollect);
      checkEnemyCollisions(onHit);
    }, 16); // ~60 FPS
  }, [updatePlayer, updateEnemies, checkCollectibles, checkEnemyCollisions]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 50,
      y: 300,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      direction: 1,
      width: 50,
      height: 50,
    };
    cameraXRef.current = 0;
    
    // Reset collectibles
    gameObjectsRef.current.forEach(obj => {
      if (obj.type === 'collectible' || obj.type === 'powerup' || obj.type === 'enemy') {
        obj.collected = false;
      }
    });

    animatedPlayerX.setValue(50);
    animatedPlayerY.setValue(300);
    animatedCameraX.setValue(0);
  }, [animatedPlayerX, animatedPlayerY, animatedCameraX]);

  useEffect(() => {
    return () => {
      stopGameLoop();
    };
  }, [stopGameLoop]);

  return {
    player: playerRef.current,
    gameObjects: gameObjectsRef.current,
    cameraX: cameraXRef.current,
    animatedPlayerX,
    animatedPlayerY,
    animatedCameraX,
    moveLeft,
    moveRight,
    stopMoving,
    jump,
    startGameLoop,
    stopGameLoop,
    resetGame,
  };
}