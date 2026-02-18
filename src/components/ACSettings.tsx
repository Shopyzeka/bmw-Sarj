import { motion } from 'framer-motion';
import { Zap, Info, Layers } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ACSettingsProps {
  amperage: number;
  phase: number;
  onAmperageChange: (amperage: number) => void;
  onPhaseChange: (phase: number) => void;
}

export function ACSettings({ amperage, phase, onAmperageChange, onPhaseChange }: ACSettingsProps) {
  
  const calculatePower = (amp: number, p: number) => {
    return ((amp * 220 * p) / 1000).toFixed(1);
  };

  const AMP_OPTIONS = [6, 8, 10, 12, 13, 16, 20, 24, 28, 32];

  return (
    <div className="space-y-4">
      {/* Faz Seçimi */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faz Sayısı</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 3].map((p) => (
            <button
              key={p}
              onClick={() => onPhaseChange(p)}
              className={`py-2 rounded-xl border text-sm font-bold transition-all ${
                phase === p
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {p === 1 ? 'Monofaz (1 Faz)' : 'Trifaz (3 Faz)'}
            </button>
          ))}
        </div>
      </div>

      {/* Amper Seçimi */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Şebeke Akımı</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-500 hover:text-slate-400 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-slate-900 border-slate-700">
                <p className="text-xs">Wallbox cihazınızın veya prizinizin desteklediği amper değerini seçin.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {AMP_OPTIONS.map((amp) => (
            <button
              key={amp}
              onClick={() => onAmperageChange(amp)}
              className={`p-2 rounded-xl border transition-all ${
                amperage === amp
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="text-sm font-bold">{amp}A</div>
              <div className="text-[9px] opacity-70">{calculatePower(amp, phase)} kW</div>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"
      >
        <span className="text-xs text-blue-400">Toplam Güç</span>
        <span className="text-sm font-bold text-blue-400">
          {calculatePower(amperage, phase)} kW ({phase} Faz)
        </span>
      </motion.div>
    </div>
  );
}