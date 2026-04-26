
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, History, Zap, Settings, X } from 'lucide-react';

export default function Navigation({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#111215] border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">CryptoAgent</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">v1.0.4 研究系統</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-slate-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-4">
          <li>
            <NavItem to="/dashboard" onClick={() => setIsOpen(false)} icon={<LayoutDashboard size={18} />} label="儀表板" />
          </li>
          <li>
            <NavItem to="/analysis" onClick={() => setIsOpen(false)} icon={<FlaskConical size={18} />} label="研究終端" />
          </li>
          <li>
            <NavItem to="/build-log" onClick={() => setIsOpen(false)} icon={<History size={18} />} label="開發日誌" />
          </li>
          <li className="pt-4 mt-4 border-t border-slate-800 px-4">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">工具</span>
          </li>
          <li>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 cursor-not-allowed opacity-50">
              <Settings size={18} />
              <span>設置</span>
            </div>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-[#1a1b1f] p-3 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-xs text-indigo-300 border border-indigo-500/20">AI</div>
          <div>
            <p className="text-xs text-slate-300 font-medium tracking-tight">Gemini Flash-3</p>
            <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">狀態: 在線</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-md tracking-tight
        ${isActive 
          ? 'bg-slate-800 text-white shadow-sm' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
      `}
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-indigo-400' : ''}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
