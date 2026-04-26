
import { motion } from 'motion/react';
import { Cpu, Terminal, Database, Sparkles } from 'lucide-react';

export default function BuildLog() {
  const logs = [
    {
      title: "Model Selection: Gemini 3 Flash",
      icon: <Cpu className="text-indigo-400" />,
      content: "Leveraged Gemini 3 Flash for near-real-time inference and strict JSON schema enforcement via native response types.",
      tags: ["AI", "Gemini"]
    },
    {
      title: "Architecture & Data Pipeline",
      icon: <Database className="text-slate-400" />,
      content: "Built an Express persistence layer with Prisma (SQLite) to snapshot CoinGecko market data. Prevents API rate-limiting while providing high-fidelity logs for analysis.",
      tags: ["Backend", "Prisma"]
    },
    {
      title: "Aesthetic: Sophisticated Dark",
      icon: <Terminal className="text-indigo-500" />,
      content: "Transitioned to a sidebar-driven layout with indigo accents. Used Slate and Zinc color palettes to drive a technical, institutional terminal look.",
      tags: ["Frontend", "Design"]
    },
    {
      title: "Vibe Coding Workflow",
      icon: <Sparkles className="text-amber-500" />,
      content: "Used AI Studio's iterative coding loops to generate structural components, then manually refactored the prompt engineering for research accuracy.",
      tags: ["Workflow", "Vibe"]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="space-y-2 border-b border-slate-800 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          開發清單
        </h1>
        <p className="text-slate-500 text-sm">
          記錄技術約束、架構決策和設計演進的文檔。
        </p>
      </div>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-[#111215] border border-slate-800 p-6 rounded-xl hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start gap-5">
              <div className="p-3 bg-[#0a0b0d] rounded-lg group-hover:bg-slate-900 transition-colors">
                {log.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold tracking-tight text-slate-200 group-hover:text-white transition-colors">{log.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {log.content}
                </p>
                <div className="flex gap-2 pt-2">
                  {log.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-widest font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border border-indigo-500/10 bg-indigo-500/[0.02] p-8 rounded-xl space-y-4">
        <div className="flex items-center gap-2 font-bold text-indigo-400 uppercase text-[10px] tracking-[0.2em]">
          技術規格
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SpecEntry label="語言" value="TypeScript 5.8" />
            <SpecEntry label="數據庫" value="Prisma/SQLite" />
          </div>
          <div className="space-y-2">
            <SpecEntry label="基礎框架" value="React 19 / Vite 6" />
            <SpecEntry label="樣式庫" value="Tailwind 4.0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecEntry({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-[11px] font-mono border-b border-slate-800/40 pb-2">
      <span className="text-slate-500 uppercase tracking-tighter">{label}</span>
      <span className="text-slate-300 font-bold">{value}</span>
    </div>
  );
}
