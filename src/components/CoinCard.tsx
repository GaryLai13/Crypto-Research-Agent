
import { Link } from 'react-router-dom';
import { Coin } from '../types';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function CoinCard({ coin }: { coin: Coin }) {
  const isPositive = coin.change24h >= 0;

  return (
    <Link 
      to={`/coin/${coin.symbol}`}
      className="block group bg-[#111215] border border-slate-800 hover:border-indigo-500/30 hover:bg-[#16171d]/80 transition-all p-5 rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#1a1b1f] flex items-center justify-center text-sm font-bold text-slate-200 border border-slate-800">
            {coin.symbol[0]}
          </div>
          <div>
            <h3 className="font-bold tracking-tight text-white">{coin.name}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">{coin.symbol}</p>
          </div>
        </div>
        <div className={`p-1 transition-transform group-hover:scale-110 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-bold tracking-tighter text-slate-100 font-mono">
          ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: (coin.price < 1 ? 6 : 2) })}
        </p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold leading-none py-0.5 px-2 rounded-sm ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
          </span>
          <span className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">24H 數據快照</span>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-800/50 flex items-center justify-between">
        <div className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">
          排名 <span className="text-slate-300 font-bold font-sans">#{coin.rank}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          查看分析 <ArrowUpRight size={10} />
        </div>
      </div>
    </Link>
  );
}
