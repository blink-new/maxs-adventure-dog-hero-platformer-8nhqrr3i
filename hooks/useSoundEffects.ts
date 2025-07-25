import { useRef } from 'react';

// Simple sound effect system using vibration and visual feedback
// In a real app, you'd use expo-av for actual audio

export function useSoundEffects() {
  const soundEnabled = useRef(true);

  const playJumpSound = () => {
    if (!soundEnabled.current) return;
    // Could implement actual sound here with expo-av
    // For now, we'll use haptic feedback if available
    try {
      // Vibration pattern for jump
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      // Ignore vibration errors
    }
  };

  const playCollectSound = () => {
    if (!soundEnabled.current) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 10, 30]);
      }
    } catch (error) {
      // Ignore vibration errors
    }
  };

  const playHitSound = () => {
    if (!soundEnabled.current) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error) {
      // Ignore vibration errors
    }
  };

  const playPowerUpSound = () => {
    if (!soundEnabled.current) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 20, 50, 20, 100]);
      }
    } catch (error) {
      // Ignore vibration errors
    }
  };

  const toggleSound = () => {
    soundEnabled.current = !soundEnabled.current;
    return soundEnabled.current;
  };

  return {
    playJumpSound,
    playCollectSound,
    playHitSound,
    playPowerUpSound,
    toggleSound,
    soundEnabled: soundEnabled.current,
  };
}