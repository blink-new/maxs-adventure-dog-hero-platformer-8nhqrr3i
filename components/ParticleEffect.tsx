import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ParticleEffectProps {
  x: number;
  y: number;
  type: 'collect' | 'powerup' | 'hit';
  onComplete: () => void;
}

export default function ParticleEffect({ x, y, type, onComplete }: ParticleEffectProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start(() => {
      onComplete();
    });
  }, [opacity, scale, translateY, onComplete]);

  const getParticleContent = () => {
    switch (type) {
      case 'collect':
        return { text: '+100', color: '#4ECDC4' };
      case 'powerup':
        return { text: '+200', color: '#FF6B35' };
      case 'hit':
        return { text: '-1 ❤️', color: '#FF4444' };
      default:
        return { text: '+', color: '#FFFFFF' };
    }
  };

  const { text, color } = getParticleContent();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x,
          top: y,
          opacity,
          transform: [
            { scale },
            { translateY },
          ],
        },
      ]}
    >
      <Text style={[styles.text, { color }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});