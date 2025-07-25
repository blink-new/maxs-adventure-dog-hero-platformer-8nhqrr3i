import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, RotateCcw, Home, Settings } from 'lucide-react-native';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function PauseMenu({ onResume, onRestart, onHome }: PauseMenuProps) {
  const menuItems = [
    { icon: Play, label: 'Resume', action: onResume, color: '#4ECDC4' },
    { icon: RotateCcw, label: 'Restart', action: onRestart, color: '#FF6B35' },
    { icon: Home, label: 'Home', action: onHome, color: '#95A5A6' },
  ];

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(44, 62, 80, 0.95)', 'rgba(52, 73, 94, 0.95)']}
          style={styles.menuContainer}
        >
          <Text style={styles.title}>Game Paused</Text>
          
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                  onPress={item.action}
                >
                  <IconComponent size={24} color="#FFFFFF" />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.gameInfo}>
            <Text style={styles.infoText}>Level 1 - City Park</Text>
            <Text style={styles.infoText}>Max's Adventure</Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    backgroundColor: 'rgba(44, 62, 80, 0.95)',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItems: {
    width: '100%',
    gap: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  gameInfo: {
    marginTop: 25,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    marginVertical: 2,
  },
});