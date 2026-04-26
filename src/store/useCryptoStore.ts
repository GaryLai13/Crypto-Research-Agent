
import { create } from 'zustand';
import { Coin } from '../types';

interface CryptoStore {
  selectedCoin: Coin | null;
  setSelectedCoin: (coin: Coin | null) => void;
  lastAnalysis: any | null;
  setLastAnalysis: (analysis: any) => void;
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  selectedCoin: null,
  setSelectedCoin: (coin) => set({ selectedCoin: coin }),
  lastAnalysis: null,
  setLastAnalysis: (analysis) => set({ lastAnalysis: analysis }),
}));
