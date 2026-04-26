
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  change24h: number;
  change7d: number;
  volume: number;
  rank: number;
  timestamp: string;
  history?: { timestamp: string, price: number }[];
}

export interface CoinDetail extends Coin {
  history: { timestamp: string; price: number }[];
}

export interface AnalysisResult {
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  summary: string;
  signals: string[];
  risks: string[];
  suggestion: string;
}

export interface BuildLogEntry {
  title: string;
  content: string;
  timestamp: string;
}
