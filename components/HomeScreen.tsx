import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, User, Trophy, ShoppingBag, Settings } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import type { Screen } from '@/app/index';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { player } = useGame();

  const menuItems = [
    { icon: Play, label: 'Play', screen: 'game' as Screen, primary: true },
    { icon: User, label: 'Profile', screen: 'profile' as Screen },
    { icon: Trophy, label: 'Leaderboard', screen: 'leaderboard' as Screen },
    { icon: ShoppingBag, label: 'Shop', screen: 'shop' as Screen },
    { icon: Settings, label: 'Settings', screen: 'settings' as Screen },
  ];

  return (
    <LinearGradient
      colors={['#87CEEB', '#4ECDC4', '#FF6B35']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Max's Adventure</Text>
          <Text style={styles.subtitle}>Dog Hero Platformer</Text>
        </View>

        {/* Max Character Display */}
        <View style={styles.characterContainer}>
          <View style={styles.maxCharacter}>
            <Text style={styles.maxEmoji}>🐕</Text>
          </View>
          <Text style={styles.characterName}>Max</Text>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>Welcome, {player?.name}!</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{player?.level}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Coins</Text>
              <Text style={styles.statValue}>{player?.coins}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{player?.score}</Text>
            </View>
          </View>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuButton,
                  item.primary && styles.primaryButton,
                ]}
                onPress={() => onNavigate(item.screen)}
              >
                <IconComponent
                  size={item.primary ? 32 : 24}
                  color={item.primary ? '#FFFFFF' : '#2C3E50'}
                />
                <Text
                  style={[
                    styles.menuButtonText,
                    item.primary && styles.primaryButtonText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#2C3E50',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  maxCharacter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  maxEmoji: {
    fontSize: 60,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: '#2C3E50',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playerInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    width: width * 0.8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 8,
    width: width * 0.7,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 20,
    marginVertical: 15,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});