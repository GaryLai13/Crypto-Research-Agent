
import { useQuery } from '@tanstack/react-query';
import { cryptoApi } from '../services/api';
import CoinCard from '../components/CoinCard';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins'],
    queryFn: cryptoApi.getCoins,
    refetchInterval: 60000 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const topGainer = coins?.reduce((prev, current) => 
    (prev.change24h > current.change24h) ? prev : current
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">市場情報</h1>
          <p className="text-slate-500 text-sm">熱門數位資產的實時聚合數據</p>
        </div>
        <div className="flex items-center gap-4 bg-[#111215] border border-slate-800 p-2 pl-4 rounded-xl">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">總市值</p>
            <p className="text-sm font-mono text-white">$2.44T <span className="text-emerald-500 text-[10px] font-bold">+1.24%</span></p>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Activity size={18} className="text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Grid Layout inspired by Sophisticated Dark */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coins?.map((coin, index) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <CoinCard coin={coin} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
