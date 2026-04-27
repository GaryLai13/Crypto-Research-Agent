
import axios from 'axios';
import { Coin, CoinDetail } from '../types';

export const cryptoApi = {
  getCoins: async (): Promise<Coin[]> => {
    // Fetch directly from CoinGecko for static site
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d'
      }
    });

    return response.data.map((item: any, index: number) => ({
      id: item.id,
      coingeckoId: item.id,
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      price: item.current_price,
      marketCap: item.market_cap,
      change24h: item.price_change_percentage_24h_in_currency || 0,
      change7d: item.price_change_percentage_7d_in_currency || 0,
      volume: item.total_volume,
      rank: index + 1
    }));
  },
  
  getCoinDetail: async (symbol: string): Promise<CoinDetail> => {
    const list = await cryptoApi.getCoins();
    const coin = list.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
    
    if (!coin) {
      throw new Error('Coin not found');
    }

    let history: any[] = [];
    try {
      const historyResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.coingeckoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: '1',
        }
      });

      // Transform CoinGecko's [timestamp, price] array
      history = historyResponse.data.prices.map(([ts, price]: [number, number]) => ({
        timestamp: new Date(ts).toISOString(),
        price: price
      }));
    } catch (cgError) {
      console.error('CoinGecko History Fetch Error:', cgError);
      // fallback mock using current price
      history = Array.from({ length: 24 }).map((_, i) => ({
        timestamp: new Date(Date.now() - (24 - i) * 3600 * 1000).toISOString(),
        price: coin.price * (1 + (Math.random() * 0.05 - 0.025))
      }));
    }

    return { ...coin, history } as CoinDetail;
  },
  
  saveAnalysis: async (data: any) => {
    // For static site, save to localStorage
    try {
      const history = JSON.parse(localStorage.getItem('ai_analysis_history') || '[]');
      history.push({ ...data, id: Date.now().toString(), timestamp: new Date().toISOString() });
      localStorage.setItem('ai_analysis_history', JSON.stringify(history));
    } catch (e) {
      console.error("Local storage error", e);
    }
    return data;
  }
};
