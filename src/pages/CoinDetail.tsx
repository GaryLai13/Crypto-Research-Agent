
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cryptoApi } from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  ArrowLeft, Brain, TrendingUp, TrendingDown, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function CoinDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const { data: coin, isLoading } = useQuery({
    queryKey: ['coin', symbol],
    queryFn: () => cryptoApi.getCoinDetail(symbol!),
    enabled: !!symbol
  });

  if (isLoading || !coin) {
    return <div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">正在初始化數據流...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 返回儀表板
        </button>
        <div className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
          SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="flex-1 space-y-6 lg:space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/50">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#111215] border border-slate-800 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-xl">
                   {coin.symbol[0]}
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white">
                    {coin.name} 
                    <span className="ml-2 md:ml-3 text-lg md:text-xl text-slate-600 font-mono font-medium uppercase">{coin.symbol}</span>
                  </h1>
                  <p className="text-[10px] md:text-xs text-slate-500 font-mono mt-1 tracking-wider uppercase">市場排名 #{coin.rank}</p>
                </div>
              </div>
            </div>
            
            <div className="md:text-right">
              <p className="text-3xl md:text-4xl font-bold tracking-tighter text-slate-100 font-mono">
                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: (coin.price < 1 ? 6 : 2) })}
              </p>
              <div className={`flex items-center md:justify-end gap-2 font-bold text-sm ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {coin.change24h.toFixed(2)}% <span className="text-[10px] text-slate-500 font-mono">/ 24H</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111215] border border-slate-800 p-4 md:p-8 rounded-xl h-[300px] md:h-[450px] shadow-2xl relative transition-all">
             <div className="absolute top-4 left-6 text-[9px] md:text-[10px] font-mono text-slate-600 uppercase tracking-widest">資產性能圖表 (24h)</div>
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={coin.history} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="timestamp" hide />
                <YAxis 
                  domain={['auto', 'auto']} 
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1)+'k' : val.toFixed(1)}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0b0d', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#6366f1' }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, '價格']}
                  labelFormatter={() => ''}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:w-80 space-y-6 shrink-0">
          <div className="bg-[#111215] border border-slate-800 p-6 rounded-xl space-y-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4">
               市場統計
            </h3>
            
            <div className="space-y-2">
              <StatItem label="交易量" value={`$${(coin.volume / 1e9).toFixed(2)}B`} />
              <StatItem label="市值" value={`$${(coin.marketCap / 1e9).toFixed(2)}B`} />
              <StatItem label="7日增幅" value={`${coin.change7d.toFixed(2)}%`} color={coin.change7d >=0 ? 'text-emerald-400' : 'text-rose-400'} />
            </div>

            <button
              onClick={() => navigate('/analysis', { state: { coin } })}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-lg font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Brain size={18} />
              啟動研究代理
            </button>
          </div>

          <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl">
             <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-2">
               <ShieldAlert size={14} /> 風險警示
             </h4>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
               數位資產是高波動性的金融工具。研究結果僅供參考。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color = "text-slate-200" }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-800/20 last:border-0 hover:bg-slate-800/10 px-1 transition-colors">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}
