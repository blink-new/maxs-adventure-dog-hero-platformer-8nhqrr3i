import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const { width, height } = Dimensions.get('window');

export default function GameCanvas() {
  const { gameState, updateGameState } = useGame();
  const {
    gameObjects,
    animatedPlayerX,
    animatedPlayerY,
    animatedCameraX,
    startGameLoop,
    stopGameLoop,
    resetGame,
  } = useGameEngine();
  const { playCollectSound, playPowerUpSound, playHitSound } = useSoundEffects();

  const gameLoopStarted = useRef(false);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameLoopStarted.current) {
      gameLoopStarted.current = true;
      startGameLoop(
        (type: string, id: string, sprite?: string) => {
          // Handle collectibles
          if (type === 'collectible') {
            playCollectSound();
            updateGameState({
              score: gameState.score + 100,
              coins: gameState.coins + 1,
            });
          } else if (type === 'powerup') {
            playPowerUpSound();
            const powerUpType = sprite === '🔥' ? 'fireball' : 
                              sprite === '🌪️' ? 'spin' : 'jump';
            updateGameState({
              score: gameState.score + 200,
              powerUps: [...gameState.powerUps, powerUpType],
            });
          }
        },
        () => {
          // Handle player hit
          playHitSound();
          const newLives = gameState.lives - 1;
          updateGameState({ lives: newLives });
          
          if (newLives <= 0) {
            // Game over
            stopGameLoop();
            gameLoopStarted.current = false;
            updateGameState({ isPlaying: false });
          }
        }
      );
    } else if (!gameState.isPlaying || gameState.isPaused) {
      stopGameLoop();
      gameLoopStarted.current = false;
    }

    return () => {
      if (gameLoopStarted.current) {
        stopGameLoop();
        gameLoopStarted.current = false;
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, startGameLoop, stopGameLoop, updateGameState, gameState.score, gameState.coins, gameState.lives, gameState.powerUps]);

  useEffect(() => {
    if (!gameState.isPlaying && gameLoopStarted.current) {
      resetGame();
      gameLoopStarted.current = false;
    }
  }, [gameState.isPlaying, resetGame]);

  const renderGameObject = (obj: any) => {
    if (obj.collected) return null;

    return (
      <Animated.View
        key={obj.id}
        style={[
          styles.gameObject,
          {
            transform: [
              {
                translateX: Animated.subtract(
                  new Animated.Value(obj.x),
                  animatedCameraX
                ),
              },
            ],
            top: obj.y,
            width: obj.width,
            height: obj.height,
            backgroundColor: getObjectColor(obj.type),
          },
        ]}
      >
        {obj.sprite && (
          <Text style={[
            styles.sprite,
            obj.direction === -1 && styles.flippedSprite
          ]}>
            {obj.sprite}
          </Text>
        )}
      </Animated.View>
    );
  };

  const getObjectColor = (type: string) => {
    switch (type) {
      case 'platform':
        return '#8B4513';
      case 'enemy':
      case 'collectible':
      case 'powerup':
        return 'transparent';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.background}>
        {/* Clouds - parallax scrolling */}
        <Animated.View
          style={[
            styles.cloud,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.3),
                },
              ],
              left: 100,
              top: 50,
            },
          ]}
        >
          <Text style={styles.cloudText}>☁️</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.cloud,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.3),
                },
              ],
              left: 300,
              top: 80,
            },
          ]}
        >
          <Text style={styles.cloudText}>☁️</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.3),
                },
              ],
              left: 500,
              top: 60,
            },
          ]}
        >
          <Text style={styles.cloudText}>☁️</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.3),
                },
              ],
              left: 800,
              top: 70,
            },
          ]}
        >
          <Text style={styles.cloudText}>☁️</Text>
        </Animated.View>
        
        {/* Trees - mid-ground parallax */}
        <Animated.View
          style={[
            styles.tree,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.5),
                },
              ],
              left: 150,
              top: 320,
            },
          ]}
        >
          <Text style={styles.treeText}>🌳</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.tree,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.5),
                },
              ],
              left: 350,
              top: 330,
            },
          ]}
        >
          <Text style={styles.treeText}>🌲</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.tree,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.5),
                },
              ],
              left: 550,
              top: 325,
            },
          ]}
        >
          <Text style={styles.treeText}>🌳</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.tree,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.5),
                },
              ],
              left: 750,
              top: 335,
            },
          ]}
        >
          <Text style={styles.treeText}>🌲</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.tree,
            {
              transform: [
                {
                  translateX: Animated.multiply(animatedCameraX, -0.5),
                },
              ],
              left: 1050,
              top: 320,
            },
          ]}
        >
          <Text style={styles.treeText}>🌳</Text>
        </Animated.View>
      </View>

      {/* Game Objects */}
      {gameObjects.map(renderGameObject)}

      {/* Max the Dog Player */}
      <Animated.View
        style={[
          styles.player,
          {
            left: animatedPlayerX,
            top: animatedPlayerY,
          },
        ]}
      >
        <Text style={styles.playerSprite}>🐕</Text>
      </Animated.View>

      {/* Level Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: Animated.multiply(
                  Animated.divide(animatedCameraX, new Animated.Value(1600)),
                  new Animated.Value(100)
                ).interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Level 1 - City Park</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cloud: {
    position: 'absolute',
  },
  cloudText: {
    fontSize: 30,
  },
  tree: {
    position: 'absolute',
  },
  treeText: {
    fontSize: 40,
  },
  gameObject: {
    position: 'absolute',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    fontSize: 30,
  },
  flippedSprite: {
    transform: [{ scaleX: -1 }],
  },
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  playerSprite: {
    fontSize: 40,
  },
  progressContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
    textShadowColor: '#2C3E50',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});