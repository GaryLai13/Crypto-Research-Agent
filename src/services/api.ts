
import axios from 'axios';
import { Coin, CoinDetail } from '../types';

export const cryptoApi = {
  getCoins: async (): Promise<Coin[]> => {
    const response = await axios.get('/api/coins');
    return response.data;
  },
  
  getCoinDetail: async (symbol: string): Promise<CoinDetail> => {
    const response = await axios.get(`/api/coins/${symbol}`);
    return response.data;
  },
  
  saveAnalysis: async (data: any) => {
    const response = await axios.post('/api/analysis', data);
    return response.data;
  }
};
