import { motion } from 'framer-motion';
import { BatteryCharging, BatteryFull } from 'lucide-react';

interface PercentageSliderProps {
  current: number;
  target: number;
  onCurrentChange: (value: number) => void;
  onTargetChange: (value: number) => void;
}

export function PercentageSlider({ current, target, onCurrentChange, onTargetChange }: PercentageSliderProps) {
  const getBatteryColor = (percentage: number) => {
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 50) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBatteryBg = (percentage: number) => {
    if (percentage <= 20) return 'from-red-500 to-red-600';
    if (percentage <= 50) return 'from-amber-500 to-amber-600';
    return 'from-emerald-500 to-emerald-600';
  };

  return (
    <div className="space-y-6">
      {/* Current Percentage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className={`w-4 h-4 ${getBatteryColor(current)}`} />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mevcut Şarj</span>
          </div>
          <motion.span 
            key={current}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-black ${getBatteryColor(current)}`}
          >
            %{current}
          </motion.span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={current}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onCurrentChange(val);
              if (val >= target) onTargetChange(Math.min(val + 10, 100));
            }}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 slider-thumb"
          />
          <div 
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 pointer-events-none"
            style={{ width: `${current}%` }}
          />
        </div>
      </div>

      {/* Target Percentage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryFull className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hedef Şarj</span>
          </div>
          <motion.span 
            key={target}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-blue-400"
          >
            %{target}
          </motion.span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="100"
            value={target}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onTargetChange(val);
              if (val <= current) onCurrentChange(Math.max(val - 10, 0));
            }}
            className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 slider-thumb"
          />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getBatteryBg(target)} pointer-events-none transition-all duration-300`}
            style={{ width: `${target}%` }}
          />
        </div>
      </div>

      {/* Visual Battery */}
      <div className="relative h-16 bg-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Current level background */}
          <div 
            className="h-full bg-slate-800/50 transition-all duration-500"
            style={{ width: `${current}%` }}
          />
          {/* Charging range */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500/30 via-blue-400/40 to-blue-500/30 transition-all duration-500 relative overflow-hidden"
            style={{ width: `${target - current}%` }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Mevcut</span>
            <span className="text-sm font-bold text-white">%{current}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-blue-400">%{target}</span>
            <span className="text-xs font-medium text-slate-400">Hedef</span>
          </div>
        </div>

        {/* Markers */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div className="w-px h-2 bg-slate-600/50" />
              <span className="text-[8px] text-slate-600">{mark}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
