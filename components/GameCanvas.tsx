import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import { useGame } from '@/contexts/GameContext';

const { width, height } = Dimensions.get('window');

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'player' | 'platform' | 'enemy' | 'collectible' | 'powerup';
  sprite?: string;
}

export default function GameCanvas() {
  const { gameState } = useGame();
  const [cameraX, setCameraX] = useState(0);
  const playerX = useRef(new Animated.Value(50)).current;
  const playerY = useRef(new Animated.Value(300)).current;

  // Game objects for level 1
  const gameObjects: GameObject[] = [
    // Platforms
    { id: 'ground', x: 0, y: 400, width: 2000, height: 50, type: 'platform' },
    { id: 'platform1', x: 200, y: 300, width: 150, height: 20, type: 'platform' },
    { id: 'platform2', x: 400, y: 250, width: 150, height: 20, type: 'platform' },
    { id: 'platform3', x: 600, y: 200, width: 150, height: 20, type: 'platform' },
    
    // Enemies
    { id: 'enemy1', x: 300, y: 360, width: 40, height: 40, type: 'enemy', sprite: '🐱' },
    { id: 'enemy2', x: 500, y: 210, width: 40, height: 40, type: 'enemy', sprite: '🐿️' },
    
    // Collectibles
    { id: 'bone1', x: 250, y: 270, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone2', x: 450, y: 220, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    { id: 'bone3', x: 650, y: 170, width: 30, height: 30, type: 'collectible', sprite: '🦴' },
    
    // Power-ups
    { id: 'powerup1', x: 350, y: 260, width: 35, height: 35, type: 'powerup', sprite: '⚡' },
  ];

  const renderGameObject = (obj: GameObject) => {
    const isVisible = obj.x + obj.width > cameraX && obj.x < cameraX + width;
    
    if (!isVisible) return null;

    const screenX = obj.x - cameraX;
    
    return (
      <View
        key={obj.id}
        style={[
          styles.gameObject,
          {
            left: screenX,
            top: obj.y,
            width: obj.width,
            height: obj.height,
            backgroundColor: getObjectColor(obj.type),
          },
        ]}
      >
        {obj.sprite && (
          <Text style={styles.sprite}>{obj.sprite}</Text>
        )}
      </View>
    );
  };

  const getObjectColor = (type: string) => {
    switch (type) {
      case 'platform':
        return '#8B4513';
      case 'enemy':
        return 'transparent';
      case 'collectible':
        return 'transparent';
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
        {/* Clouds */}
        <Text style={[styles.cloud, { left: 100 - cameraX * 0.3, top: 50 }]}>☁️</Text>
        <Text style={[styles.cloud, { left: 300 - cameraX * 0.3, top: 80 }]}>☁️</Text>
        <Text style={[styles.cloud, { left: 500 - cameraX * 0.3, top: 60 }]}>☁️</Text>
        
        {/* Trees */}
        <Text style={[styles.tree, { left: 150 - cameraX * 0.5, top: 320 }]}>🌳</Text>
        <Text style={[styles.tree, { left: 350 - cameraX * 0.5, top: 330 }]}>🌲</Text>
        <Text style={[styles.tree, { left: 550 - cameraX * 0.5, top: 325 }]}>🌳</Text>
      </View>

      {/* Game Objects */}
      {gameObjects.map(renderGameObject)}

      {/* Max the Dog Player */}
      <Animated.View
        style={[
          styles.player,
          {
            left: playerX,
            top: playerY,
          },
        ]}
      >
        <Text style={styles.playerSprite}>🐕</Text>
      </Animated.View>

      {/* Level Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '25%' }]} />
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
    fontSize: 30,
  },
  tree: {
    position: 'absolute',
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