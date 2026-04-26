/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CoinDetailPage from './pages/CoinDetail';
import AnalysisPage from './pages/Analysis';
import BuildLog from './pages/BuildLog';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-[#0a0b0d] text-slate-200 font-sans overflow-hidden relative">
          <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
          
          {/* Mobile Overlay */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <main className="flex-1 flex flex-col overflow-hidden bg-[#0d0e12] w-full">
            {/* Minimal Header Bar as seen in Design */}
            <header className="h-16 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between shrink-0 bg-[#0a0b0d] z-30">
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 lg:hidden text-slate-400 hover:text-white transition-colors"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest leading-none">市場狀態</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] md:text-[10px] text-emerald-500 font-mono">實時數據詳情</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:block h-4 w-[1px] bg-slate-800"></div>
                <span className="text-[9px] md:text-xs text-slate-400 font-mono">同步時間: {new Date().toLocaleTimeString()}</span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/coin/:symbol" element={<CoinDetailPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/build-log" element={<BuildLog />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

