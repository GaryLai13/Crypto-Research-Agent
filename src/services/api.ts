import axios from 'axios';
import { Coin, CoinDetail } from '../types';

const API = 'https://api.coingecko.com/api/v3';

function mapCoin(item: any, index: number): Coin {
  return {
    id: item.id,
    symbol: item.symbol.toUpperCase(),
    name: item.name,
    price: item.current_price,
    marketCap: item.market_cap,
    change24h: item.price_change_percentage_24h_in_currency || 0,
    change7d: item.price_change_percentage_7d_in_currency || 0,
    volume: item.total_volume,
    rank: index + 1,
    timestamp: new Date().toISOString(),
  };
}

export const cryptoApi = {
  getCoins: async (): Promise<Coin[]> => {
    const response = await axios.get(`${API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d',
      },
    });

    return response.data.map(mapCoin);
  },

  getCoinDetail: async (symbol: string): Promise<CoinDetail> => {
    const coins = await cryptoApi.getCoins();
    const coin = coins.find(c => c.symbol === symbol.toUpperCase());

    if (!coin) {
      throw new Error('Coin not found');
    }

    const historyResponse = await axios.get(`${API}/coins/${coin.id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: '1',
      },
    });

    const history = historyResponse.data.prices.map(([ts, price]: [number, number]) => ({
      timestamp: new Date(ts).toISOString(),
      price,
    }));

    return {
      ...coin,
      history,
    } as CoinDetail;
  },

  saveAnalysis: async (data: any) => {
    localStorage.setItem(`analysis-${data.symbol}-${Date.now()}`, JSON.stringify(data));
    return data;
  },
};
