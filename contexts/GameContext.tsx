import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  level: number;
  score: number;
  coins: number;
  unlockedCostumes: string[];
  currentCostume: string;
  achievements: string[];
}

export interface GameState {
  currentLevel: number;
  lives: number;
  score: number;
  coins: number;
  powerUps: string[];
  isPlaying: boolean;
  isPaused: boolean;
}

interface GameContextType {
  player: Player | null;
  gameState: GameState;
  setPlayer: (player: Player | null) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  currentLevel: 1,
  lives: 3,
  score: 0,
  coins: 0,
  powerUps: [],
  isPlaying: false,
  isPaused: false,
};

const defaultPlayer: Player = {
  id: 'guest',
  name: 'Guest Player',
  level: 1,
  score: 0,
  coins: 0,
  unlockedCostumes: ['default'],
  currentCostume: 'default',
  achievements: [],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(defaultPlayer);
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const startGame = () => {
    updateGameState({ isPlaying: true, isPaused: false });
  };

  const pauseGame = () => {
    updateGameState({ isPaused: true });
  };

  const resumeGame = () => {
    updateGameState({ isPaused: false });
  };

  return (
    <GameContext.Provider value={{
      player,
      gameState,
      setPlayer,
      updateGameState,
      resetGame,
      startGame,
      pauseGame,
      resumeGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}