import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '@/components/HomeScreen';
import GameScreen from '@/components/GameScreen';
import { GameProvider } from '@/contexts/GameContext';

export type Screen = 'home' | 'game' | 'profile' | 'leaderboard' | 'shop' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'game':
        return <GameScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <GameProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {renderScreen()}
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
});