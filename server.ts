
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // 1. Get Top 20 Coins
  app.get('/api/coins', async (req, res) => {
    try {
      // Check if we have recent data (last 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      let coins = await prisma.cryptoSnapshot.findMany({
        where: {
          timestamp: { gte: oneHourAgo }
        },
        orderBy: { rank: 'asc' },
        take: 20
      });

      // If no recent data, fetch from CoinGecko
      if (coins.length === 0) {
        console.log('Fetching from CoinGecko...');
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

        const data = response.data;
        
        // Save to DB
        const snapshots = data.map((item: any, index: number) => ({
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

        await prisma.cryptoSnapshot.createMany({
          data: snapshots
        });

        coins = await prisma.cryptoSnapshot.findMany({
          where: {
            timestamp: { gte: oneHourAgo }
          },
          orderBy: { rank: 'asc' },
          take: 20
        });
      }

      res.json(coins);
    } catch (error) {
      console.error('Error fetching coins:', error);
      res.status(500).json({ error: 'Failed to fetch coin data' });
    }
  });

  // 2. Get Single Coin Detail
  app.get('/api/coins/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const coin = await prisma.cryptoSnapshot.findFirst({
        where: { symbol: symbol.toUpperCase() },
        orderBy: { timestamp: 'desc' }
      });

      if (!coin) {
        return res.status(404).json({ error: 'Coin not found' });
      }

      // Fetch 24h history from CoinGecko for precise chart
      console.log(`Fetching 24h history for ${symbol}...`);
      let history = [];
      try {
        const historyResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.coingeckoId}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: '1',
          }
        });

        // Transform CoinGecko's [timestamp, price] array to our history format
        history = historyResponse.data.prices.map(([ts, price]: [number, number]) => ({
          timestamp: new Date(ts).toISOString(),
          price: price
        }));
      } catch (cgError) {
        console.error('CoinGecko History Fetch Error:', cgError);
        // Fallback to local history
        const snapshots = await prisma.cryptoSnapshot.findMany({
          where: { symbol: symbol.toUpperCase() },
          orderBy: { timestamp: 'desc' },
          take: 30
        });
        history = snapshots.reverse();
      }

      res.json({ ...coin, history });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch coin detail' });
    }
  });

  // 3. Analysis remains on the frontend based on the Skill guidance (Gemini should be called from frontend)
  // But for "Server side secrets" and "Proxying", I'll keep the logic clean.
  // The Prompt Engineering part will be in the frontend component.
  
  // Handle analysis storage (POST /api/analyze-save)
  app.post('/api/analysis', async (req, res) => {
    try {
      const { symbol, trend, confidence, summary, signals, risks, suggestion, metadata } = req.body;
      const analysis = await prisma.analysisSession.create({
        data: {
          symbol,
          trend,
          confidence,
          summary,
          signals: JSON.stringify(signals),
          risks: JSON.stringify(risks),
          suggestion,
          metadata: JSON.stringify(metadata)
        }
      });
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save analysis' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
