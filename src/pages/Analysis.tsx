
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cryptoApi } from '../services/api';
import { analyzeCrypto } from '../services/geminiService';
import { Coin, AnalysisResult } from '../types';
import { 
  Brain, FileSearch, TrendingUp, TrendingDown, 
  Minus, ShieldAlert, Lightbulb, CheckCircle2, 
  AlertTriangle, Loader2, Zap, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AnalysisPage() {
  const location = useLocation();
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(location.state?.coin || null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { data: coins } = useQuery({
    queryKey: ['coins'],
    queryFn: cryptoApi.getCoins
  });

  const mutation = useMutation({
    mutationFn: (coin: Coin) => analyzeCrypto(coin),
    onSuccess: (data) => {
      setResult(data);
      cryptoApi.saveAnalysis({
        symbol: selectedCoin!.symbol,
        ...data,
        metadata: selectedCoin
      });
    }
  });

  const handleRunAnalysis = () => {
    if (selectedCoin) {
      setResult(null);
      mutation.mutate(selectedCoin);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
             研究終端
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl">
            利用實時市場快照和機構級數據集執行高保真 AI 分析。
          </p>
        </div>
        <div className="p-3 md:p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl hidden sm:block">
           <Zap className="text-indigo-500" size={24} />
        </div>
      </div>

      {/* Asset Config Terminal */}
      <div className="bg-[#111215] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 md:px-6 py-3 bg-[#16171d] border-b border-slate-800 flex items-center justify-between">
          <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap mr-2">代理源配置 (AGENT_SOURCE_CONFIGURATION)</span>
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-rose-500/30"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/30"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
          </div>
        </div>
        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">
                目標數位資產
              </label>
              <select 
                value={selectedCoin?.symbol || ''}
                onChange={(e) => {
                  const coin = coins?.find(c => c.symbol === e.target.value);
                  setSelectedCoin(coin || null);
                }}
                className="w-full bg-[#0a0b0d] border border-slate-800 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none bg-no-repeat bg-[right_1rem_center] cursor-pointer hover:border-slate-700 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundSize: '1.25rem' }}
              >
                <option value="">選擇資產...</option>
                {coins?.map(coin => (
                  <option key={coin.symbol} value={coin.symbol}>
                    {coin.name.toUpperCase()} [{coin.symbol}]
                  </option>
                ))}
              </select>
            </div>
            
            <button
              disabled={!selectedCoin || mutation.isPending}
              onClick={handleRunAnalysis}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:grayscale text-white px-8 py-3 rounded-lg font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
              {mutation.isPending ? '正在處理...' : '執行分析'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Terminal Block */}
      <AnimatePresence mode="wait">
        {mutation.isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 space-y-8"
          >
            <div className="relative">
              <div className="h-24 w-24 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <Cpu className="text-indigo-400 animate-pulse" size={32} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold tracking-tight text-white uppercase font-mono">代理正在分析數據</p>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.15em]">正在計算情緒評分與風險向量...</p>
            </div>
          </motion.div>
        )}

        {result && !mutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#111215] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-[#16171d] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">代理響應緩衝區 (AGENT_RESPONSE_BUFFER)</span>
                  <div className="h-4 w-[1px] bg-slate-700"></div>
                  <span className="text-xs text-indigo-400 font-mono font-bold tracking-tighter uppercase">{selectedCoin?.name} / 報告_{new Date().getTime().toString().slice(-6)}</span>
                </div>
                <div className="flex gap-2">
                  <TrendBadge trend={result.trend} />
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold rounded uppercase tracking-widest border border-slate-700">置信度: {result.confidence.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-6 md:space-y-10">
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">I. 執行摘要</h3>
                  <p className="text-slate-200 leading-relaxed text-sm md:text-[15px] font-medium tracking-tight">
                    {result.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-500 underline underline-offset-8 decoration-emerald-500/30">
                      II. 主要信號
                    </h4>
                    <ul className="space-y-3">
                      {result.signals.map((s, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-3 group">
                          <span className="text-emerald-500 font-mono font-bold group-hover:scale-125 transition-transform shrink-0">+</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-500 underline underline-offset-8 decoration-rose-500/30">
                      III. 風險向量
                    </h4>
                    <ul className="space-y-3">
                      {result.risks.map((r, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-3 group">
                          <span className="text-rose-500 font-mono font-bold group-hover:scale-125 transition-transform shrink-0">!</span>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 md:p-6 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12 hidden sm:block">
                    <Lightbulb size={48} className="text-indigo-400" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                    IV. 研究建議
                  </h4>
                  <p className="text-sm text-slate-300 italic font-serif leading-relaxed md:pr-10">
                    "{result.suggestion}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[9px] text-slate-600 uppercase font-mono tracking-widest">AIGEN_AUTH_SIG: 0x82f...d3e</span>
                  <p className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.15em] italic text-center sm:text-right">
                    免責聲明：算法輸出僅供研究參考。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  const configs: any = {
    bullish: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: '看漲 (BULLISH)' },
    bearish: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: '看跌 (BEARISH)' },
    neutral: { color: 'bg-slate-800 text-slate-400 border-slate-700', label: '中性 (NEUTRAL)' }
  };

  const config = configs[trend.toLowerCase()] || configs.neutral;

  return (
    <div className={`${config.color} px-3 py-1 rounded text-[10px] font-mono font-bold border tracking-widest`}>
      {config.label}
    </div>
  );
}
