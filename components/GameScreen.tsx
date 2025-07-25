import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Pause, Home, RotateCcw } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import GameCanvas from './GameCanvas';
import GameHUD from './GameHUD';
import PauseMenu from './PauseMenu';
import type { Screen } from '@/app/index';

const { width, height } = Dimensions.get('window');

interface GameScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function GameScreen({ onNavigate }: GameScreenProps) {
  const { gameState, startGame, pauseGame, resumeGame, resetGame, updateGameState } = useGame();
  const { moveLeft, moveRight, stopMoving, jump, resetGame: resetGameEngine } = useGameEngine();
  const { playJumpSound } = useSoundEffects();
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [gameOverShown, setGameOverShown] = useState(false);

  // Control states
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const moveIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start the game when component mounts
    startGame();
    return () => {
      resetGame();
      resetGameEngine();
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  // Handle game over
  useEffect(() => {
    if (gameState.lives <= 0 && !gameOverShown && gameState.isPlaying) {
      setGameOverShown(true);
      Alert.alert(
        'Game Over!',
        `Final Score: ${gameState.score}\nCoins Collected: ${gameState.coins}`,
        [
          {
            text: 'Play Again',
            onPress: handleRestart,
          },
          {
            text: 'Home',
            onPress: handleHome,
          },
        ]
      );
    }
  }, [gameState.lives, gameOverShown, gameState.isPlaying, gameState.score, gameState.coins]);

  // Handle continuous movement
  useEffect(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }

    if (isMovingLeft || isMovingRight) {
      moveIntervalRef.current = setInterval(() => {
        if (isMovingLeft) {
          moveLeft();
        } else if (isMovingRight) {
          moveRight();
        }
      }, 16); // ~60 FPS
    } else {
      stopMoving();
    }

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [isMovingLeft, isMovingRight, moveLeft, moveRight, stopMoving]);

  const handlePause = () => {
    pauseGame();
    setShowPauseMenu(true);
  };

  const handleResume = () => {
    setShowPauseMenu(false);
    resumeGame();
  };

  const handleRestart = () => {
    setShowPauseMenu(false);
    setGameOverShown(false);
    resetGame();
    resetGameEngine();
    updateGameState({
      currentLevel: 1,
      lives: 3,
      score: 0,
      coins: 0,
      powerUps: [],
    });
    startGame();
  };

  const handleHome = () => {
    resetGame();
    resetGameEngine();
    setGameOverShown(false);
    onNavigate('home');
  };

  const handleMoveLeftPress = () => {
    setIsMovingLeft(true);
    setIsMovingRight(false);
  };

  const handleMoveLeftRelease = () => {
    setIsMovingLeft(false);
  };

  const handleMoveRightPress = () => {
    setIsMovingRight(true);
    setIsMovingLeft(false);
  };

  const handleMoveRightRelease = () => {
    setIsMovingRight(false);
  };

  const handleJump = () => {
    playJumpSound();
    jump();
  };

  const handleBark = () => {
    // Bark attack - could be used to defeat enemies or activate switches
    updateGameState({ score: gameState.score + 10 });
  };

  const handleSpin = () => {
    // Spin attack - could break blocks or defeat multiple enemies
    if (gameState.powerUps.includes('spin')) {
      updateGameState({ 
        score: gameState.score + 50,
        powerUps: gameState.powerUps.filter(p => p !== 'spin')
      });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={['#87CEEB', '#98D8E8']}
        style={styles.background}
      >
        {/* Game Canvas */}
        <View style={styles.gameArea}>
          <GameCanvas />
        </View>

        {/* Game HUD */}
        <GameHUD />

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
            <Pause size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleHome}>
            <Home size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Game Controls */}
        <View style={styles.gameControls}>
          {/* Left Side - Movement */}
          <View style={styles.leftControls}>
            <TouchableOpacity 
              style={[styles.directionButton, isMovingLeft && styles.activeButton]}
              onPressIn={handleMoveLeftPress}
              onPressOut={handleMoveLeftRelease}
              activeOpacity={0.7}
            >
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.directionButton, isMovingRight && styles.activeButton]}
              onPressIn={handleMoveRightPress}
              onPressOut={handleMoveRightRelease}
              activeOpacity={0.7}
            >
              <Text style={styles.controlText}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Right Side - Actions */}
          <View style={styles.rightControls}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleJump}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>JUMP</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleBark}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>BARK</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                !gameState.powerUps.includes('spin') && styles.disabledButton
              ]}
              onPress={handleSpin}
              activeOpacity={0.7}
              disabled={!gameState.powerUps.includes('spin')}
            >
              <Text style={[
                styles.actionText,
                !gameState.powerUps.includes('spin') && styles.disabledText
              ]}>
                SPIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pause Menu Overlay */}
        {showPauseMenu && (
          <PauseMenu
            onResume={handleResume}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}

        {/* Game Status Overlay */}
        {!gameState.isPlaying && gameState.lives > 0 && !showPauseMenu && (
          <View style={styles.statusOverlay}>
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Game Paused</Text>
              <TouchableOpacity style={styles.resumeButton} onPress={() => startGame()}>
                <Text style={styles.resumeText}>Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    marginTop: 60,
    marginBottom: 120,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#87CEEB',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftControls: {
    flexDirection: 'row',
    gap: 15,
  },
  rightControls: {
    flexDirection: 'row',
    gap: 10,
  },
  directionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#4ECDC4',
    transform: [{ scale: 0.95 }],
  },
  controlText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 60,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 107, 53, 0.5)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  resumeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});