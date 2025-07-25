import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Pause, Home, RotateCcw } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import GameCanvas from './GameCanvas';
import GameHUD from './GameHUD';
import PauseMenu from './PauseMenu';
import type { Screen } from '@/app/index';

const { width, height } = Dimensions.get('window');

interface GameScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function GameScreen({ onNavigate }: GameScreenProps) {
  const { gameState, startGame, pauseGame, resumeGame, resetGame } = useGame();
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  useEffect(() => {
    // Start the game when component mounts
    startGame();
    return () => {
      resetGame();
    };
  }, []);

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
    resetGame();
    startGame();
  };

  const handleHome = () => {
    resetGame();
    onNavigate('home');
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
            <TouchableOpacity style={styles.directionButton}>
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directionButton}>
              <Text style={styles.controlText}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Right Side - Actions */}
          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>JUMP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>BARK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>SPIN</Text>
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
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});