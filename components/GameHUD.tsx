import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '@/contexts/GameContext';

export default function GameHUD() {
  const { gameState, player } = useGame();

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.topHUD}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Score</Text>
          <Text style={styles.hudValue}>{gameState.score.toLocaleString()}</Text>
        </View>
        
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Coins</Text>
          <Text style={styles.hudValue}>{gameState.coins}</Text>
        </View>
        
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>Lives</Text>
          <View style={styles.livesContainer}>
            {Array.from({ length: gameState.lives }, (_, i) => (
              <Text key={i} style={styles.lifeIcon}>❤️</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Power-ups Display */}
      {gameState.powerUps.length > 0 && (
        <View style={styles.powerUpsContainer}>
          <Text style={styles.powerUpsLabel}>Power-ups:</Text>
          <View style={styles.powerUpsList}>
            {gameState.powerUps.map((powerUp, index) => (
              <View key={index} style={styles.powerUpItem}>
                <Text style={styles.powerUpIcon}>
                  {getPowerUpIcon(powerUp)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const getPowerUpIcon = (powerUp: string) => {
  switch (powerUp) {
    case 'fireball':
      return '🔥';
    case 'spin':
      return '🌪️';
    case 'jump':
      return '⬆️';
    default:
      return '⚡';
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  topHUD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  hudItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  hudLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  hudValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  livesContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  lifeIcon: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  powerUpsContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 10,
    maxWidth: 200,
  },
  powerUpsLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 5,
  },
  powerUpsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  powerUpItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  powerUpIcon: {
    fontSize: 18,
  },
});